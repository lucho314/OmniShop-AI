// lo que WhatsApp manda en "messages"
export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'interactive';
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
}

export interface WhatsAppTextMessage {
  message: WhatsAppMessage | null;
  contact?: {
    wa_id?: string;
    profile?: { name?: string };
  };
}
