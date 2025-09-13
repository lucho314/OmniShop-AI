import { OptionHandlerFactory } from './option-handler.factory';
import { SessionService } from '../session/session.service';
import { WhatsAppMessage } from './types/whatsapp-message';
import { Session } from '@prisma/client';

export type Rule = {
  predicate: (
    type: string,
    text: string,
    session: Session | null,
    message: WhatsAppMessage,
  ) => boolean;
  action: (from: string, message: WhatsAppMessage) => Promise<void>;
};

export function buildRules(
  sessions: SessionService,
  factory: OptionHandlerFactory,
  sendMenu: (to: string, greeting: string) => Promise<void>,
): Rule[] {
  return [
    {
      predicate: (type, text) =>
        type === 'text' && ['hola', 'ayuda'].some((w) => text.includes(w)),
      action: async (f) => {
        await sessions.set(f, 'menu');
        await sendMenu(f, '¿En qué puedo ayudarte?');
      },
    },
    {
      predicate: (type, text) =>
        type === 'text' && (text === 'más' || text === 'mas'),
      action: async (f, m) => {
        const handler = factory.getHandler('BTN_PRICE');
        if (handler) await handler.handle(f, m);
      },
    },
    {
      predicate: (type, _text, s) =>
        type === 'text' && s?.state === 'awaiting_product_name',
      action: async (f, m) => {
        const handler = factory.getHandler('BTN_PRICE');
        if (handler) await handler.handle(f, m);
      },
    },
    {
      predicate: (type) => type === 'interactive',
      action: async (f, m) => {
        if (m.type !== 'interactive' || !m.interactive) return;
        const replyId =
          m.interactive.button_reply?.id ?? m.interactive.list_reply?.id;
        if (!replyId) return;
        const handler = factory.getHandler(replyId);
        if (handler) await handler.handle(f, m);
      },
    },
  ];
}
