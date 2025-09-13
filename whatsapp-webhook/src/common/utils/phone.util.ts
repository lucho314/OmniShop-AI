import { ConfigService } from '@nestjs/config';

let overrides: Record<string, string> = {};

export function initPhoneOverrides(config: ConfigService) {
  try {
    overrides = JSON.parse(
      config.get<string>('PHONE_OVERRIDES') || '{}',
    ) as Record<string, string>;
  } catch (err) {
    console.error('Error parseando PHONE_OVERRIDES:', err);
    overrides = {};
  }
}

export function normalizeWhatsAppNumber(raw: string): string {
  return overrides[raw] ?? raw;
}
