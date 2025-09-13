import { Injectable } from '@nestjs/common';

import { OptionHandler } from '../types/option-handler.interface';
import { PriceService } from 'src/price/price.service';
import { SessionService } from 'src/session/session.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { normalizeWhatsAppNumber } from 'src/common/utils/phone.util';

@Injectable()
export class PriceHandler implements OptionHandler {
  private readonly token: string;
  private readonly phoneId: string;
  constructor(
    private readonly priceService: PriceService,
    private readonly sessions: SessionService,
    private config: ConfigService,
  ) {
    this.token = this.config.get('WHATSAPP_TOKEN') || '';
    this.phoneId = this.config.get('WHATSAPP_PHONE_ID') || '';
  }

  async handle(user: string, msg: any) {
    // si no hay texto, pedimos el nombre
    const text = msg?.text?.body?.trim();
    if (!text) {
      await this.sessions.set(user, 'awaiting_product_name');
      await this.sendText(
        user,
        '🔎 Decime el nombre del producto que querés consultar.',
      );
      return;
    }

    const context = await this.sessions.getContext<{
      page?: number;
      query?: string;
    }>(user);
    const page = context.page ?? 1;
    const query = context.query ?? text;

    const products = await this.priceService.findByName(query);

    if (!products.length) {
      await this.sendText(
        user,
        `⚠️ No encontré productos que coincidan con "${query}".`,
      );
      return;
    }

    const perPage = 5;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = products.slice(start, end);

    const lines = slice.map((p) => this.priceService.formatPrice(p));
    let message = `📦 Productos que coinciden con "${query}" (página ${page}):\n\n${lines.join('\n')}`;

    if (end < products.length) {
      message += `\n\nEscribí "más" para ver más resultados.`;
      await this.sessions.setContext(user, { page: page + 1, query });
    } else {
      message += `\n\n✅ Fin de la lista.`;
      await this.sessions.setContext(user, { page: 1 });
    }

    await this.sendText(user, message);
  }

  private async sendText(to: string, text: string) {
    to = normalizeWhatsAppNumber(to);

    const payload = {
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    };

    await axios.post(
      `https://graph.facebook.com/v17.0/${this.phoneId}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${this.token}` } },
    );
  }
}
