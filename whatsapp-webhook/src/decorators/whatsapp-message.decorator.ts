import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WhatsAppWebhookDTO } from 'src/webhook/dto/whatsapp-webhook.dto';

export const WhatsAppMessage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const payload = request.body as unknown as WhatsAppWebhookDTO;

    const value = payload?.entry?.[0]?.changes?.[0]?.value;

    return {
      message: value?.messages?.[0] ?? null,
      contact: value?.contacts?.[0],
    };
  },
);
