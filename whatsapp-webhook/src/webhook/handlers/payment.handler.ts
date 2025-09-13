import { Injectable } from '@nestjs/common';
import { OptionHandler } from '../types/option-handler.interface';
import { PaymentService } from '../../payment/payment.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { normalizeWhatsAppNumber } from 'src/common/utils/phone.util';

@Injectable()
export class PaymentHandler implements OptionHandler {
  private readonly token: string;
  private readonly phoneId: string;
  constructor(
    private readonly paymentService: PaymentService,
    private config: ConfigService,
  ) {
    this.token = this.config.get('WHATSAPP_TOKEN') || '';
    this.phoneId = this.config.get('WHATSAPP_PHONE_ID') || '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(user: string, _msg: any) {
    console.log(`Mostrando medios de pago a ${user}`);
    const to = normalizeWhatsAppNumber(user);
    const payments = await this.paymentService.getAll();

    // Armamos el texto informativo
    const bodyText =
      'Nuestros medios de pago son:\n\n' +
      payments.map((p) => `• ${p.name}`).join('\n');

    // Payload con botón único
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'BTN_MENU', // lo manejás después en tu factory
                title: 'Volver al menú',
              },
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
