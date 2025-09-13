import { Injectable } from '@nestjs/common';
import { OptionService } from 'src/option/option.service';
import { SessionService } from 'src/session/session.service';
import { WhatsAppTextMessage } from './types/whatsapp-message';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { OptionHandlerFactory } from './option-handler.factory';
import { normalizeWhatsAppNumber } from 'src/common/utils/phone.util';
import { buildRules } from './message.rules';

@Injectable()
export class WebhookService {
  private readonly token: string;
  private readonly phoneId: string;
  constructor(
    private readonly sessions: SessionService,
    private readonly options: OptionService,
    private config: ConfigService,
    private readonly factory: OptionHandlerFactory,
  ) {
    this.token = this.config.get<string>('whatsapp.token') ?? '';
    this.phoneId = this.config.get<string>('whatsapp.phoneId') ?? '';
  }

  async handleMessage(msg: WhatsAppTextMessage) {
    const { message, contact } = msg;
    if (!message?.id) return;

    const from = message.from;
    const type = message.type;

    if (await this.sessions.hasProcessed(message.id)) return;
    await this.sessions.markProcessed(message.id);

    const session = await this.sessions.get(from);

    // 🚀 bienvenida
    if (!session) {
      await this.sessions.set(from, 'menu');
      await this.sendMenu(
        from,
        `Hola ${contact?.profile?.name ?? from}, bienvenido 👋`,
      );
      return;
    }

    const text =
      type === 'text' && message.text
        ? message.text.body.trim().toLowerCase()
        : '';

    const rules = buildRules(
      this.sessions,
      this.factory,
      async (to, greeting) => this.sendMenu(to, greeting),
    );

    for (const rule of rules) {
      if (rule.predicate(type, text, session, message)) {
        await rule.action(from, message);
        return;
      }
    }

    console.log(
      `Mensaje sin regla: ${from} (${type}) estado: ${session.state}`,
    );
  }

  private async sendMenu(to: string, greeting: string): Promise<void> {
    const options = await this.options.getMenuOptions();
    to = normalizeWhatsAppNumber(to);
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Menú principal', // opcional
        },
        body: {
          text: greeting,
        },
        footer: {
          text: 'Elegí una de las opciones 👇', // opcional
        },
        action: {
          button: 'Ver opciones',
          sections: [
            {
              title: 'Opciones disponibles',
              rows: options.map((o) => ({
                id: o.code,
                title: o.title.slice(0, 24), // WhatsApp máx. 24 caracteres
                description: o.title, // opcional
              })),
            },
          ],
        },
      },
    };

    console.log('Payload LIST:', JSON.stringify(payload, null, 2));

    await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } },
    );
  }
}
