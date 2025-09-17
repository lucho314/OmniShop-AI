import { Injectable } from '@nestjs/common';

import { msg, OptionHandler } from '../types/option-handler.interface';
import { SessionService } from 'src/session/session.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { normalizeWhatsAppNumber } from 'src/common/utils/phone.util';
import { ProductService } from 'src/product/product.service';
import { VendureProduct } from 'src/product/price.types';

@Injectable()
export class PriceHandler implements OptionHandler {
  private readonly token: string;
  private readonly phoneId: string;
  constructor(
    private readonly productService: ProductService,
    private readonly sessions: SessionService,
    private config: ConfigService,
  ) {
    this.token = this.config.get('WHATSAPP_TOKEN') || '';
    this.phoneId = this.config.get('WHATSAPP_PHONE_ID') || '';
  }

  async handle(user: string, msg: msg) {
    // si no hay texto, pedimos el nombre
    const text = msg?.text?.body?.toString().trim() ?? '';
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
    const query: string = context.query ?? String(text);

    const products = await this.productService.findByName(query);

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

    const lines = slice.map((p) => this.productService.formatPrice(p));
    const message = `📦 Productos que coinciden con "${query}" (página ${page}):\n\n${lines.join('\n')}`;

    if (end >= products.length) {
      await this.sessions.setContext(user, { page: 1 });
    }

    await this.sendList(user, message, slice, end < products.length);
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

  private async sendList(
    to: string,
    text: string,
    products: VendureProduct[],
    hasMore: boolean,
  ) {
    to = normalizeWhatsAppNumber(to);

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: '📦 Productos encontrados' },
        body: { text },
        footer: {
          text: hasMore
            ? 'Elegí un producto para ver el detalle 👇\nEscribí "más" para obtener mas resultados'
            : 'Elegí un producto para ver el detalle 👇',
        },
        action: {
          button: 'Ver productos',
          sections: [
            {
              title: 'Resultados',
              rows: products.map((p) => ({
                id: `BTN_PRICE_DETAIL_${p.id}`, // 👈 callback único
                title: p.name.slice(0, 24),
                description: this.productService.formatPrice(p),
              })),
            },
          ],
        },
      },
    };

    await axios.post(
      `https://graph.facebook.com/v17.0/${this.phoneId}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${this.token}` } },
    );
  }
}
