import { registerAs } from '@nestjs/config';

export default registerAs('whatsapp', () => ({
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
  token: process.env.WHATSAPP_TOKEN,
  phoneId: process.env.WHATSAPP_PHONE_ID,
}));
