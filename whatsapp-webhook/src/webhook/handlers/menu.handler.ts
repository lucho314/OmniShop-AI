import { Injectable } from '@nestjs/common';
import { OptionHandler } from '../types/option-handler.interface';
import { OptionService } from '../../option/option.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { normalizeWhatsAppNumber } from 'src/common/utils/phone.util';

@Injectable()
export class MenuHandler implements OptionHandler {
  private readonly token: string;
  private readonly phoneId: string;
  constructor(
    private readonly optionService: OptionService,
    private config: ConfigService,
  ) {
    this.token = this.config.get('WHATSAPP_TOKEN') || '';
    this.phoneId = this.config.get('WHATSAPP_PHONE_ID') || '';
  }

  async handle(user: string, _msg: any) {
    console.log(`Mostrando menú principal a ${user}`);
    await this.sendMenu(user, 'Hola 👋 ¿en qué puedo ayudarte?');
  }

  private async sendMenu(to: string, greeting: string) {
    const options = await this.optionService.getMenuOptions();
    to = normalizeWhatsAppNumber(to);
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: 'Menú principal' },
        body: { text: greeting },
        footer: { text: 'Elegí una de las opciones 👇' },
        action: {
          button: 'Ver opciones',
          sections: [
            {
              title: 'Opciones disponibles',
              rows: options.slice(0, 10).map((o) => ({
                id: o.code,
                title: o.title.slice(0, 24), // límite API
                description: o.title.slice(0, 72), // opcional
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
