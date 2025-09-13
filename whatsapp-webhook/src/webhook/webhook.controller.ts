import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { WhatsAppWebhookDTO } from './dto/whatsapp-webhook.dto';
import { WhatsAppMessage } from 'src/decorators/whatsapp-message.decorator';
import { WhatsAppTextMessage } from './types/whatsapp-message';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  private readonly verifyToken: string;

  constructor(
    private readonly webhookService: WebhookService,
    private config: ConfigService,
  ) {
    this.verifyToken = this.config.get('whatsapp.verifyToken') ?? '';
  }

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
  ) {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return 'Error de verificación';
  }

  @Post()
  async handle(
    @Body() payload: WhatsAppWebhookDTO,
    @WhatsAppMessage() msg: WhatsAppTextMessage,
  ) {
    if (!msg) return { status: 'ignored' };

    return this.webhookService.handleMessage(msg);
  }
}
