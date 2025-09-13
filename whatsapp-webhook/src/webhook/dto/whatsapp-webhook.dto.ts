/** messages[0].text */

import {
  IsArray,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class WhatsAppTextDTO {
  @IsString()
  body!: string;
}

/** messages[0] (solo texto) */

export class WhatsAppMessageDTO {
  @IsString()
  from!: string;

  @IsString()
  id!: string;

  @IsString()
  timestamp!: string;

  @IsIn(['text'])
  type!: 'text';

  @IsDefined()
  @ValidateNested()
  @Type(() => WhatsAppTextDTO as any)
  text!: WhatsAppTextDTO;
}

/** value */

export class WhatsAppValueDTO {
  @IsString()
  messaging_product!: 'whatsapp';

  /** Solo nos importa messages para este caso */

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppMessageDTO as any)
  messages!: WhatsAppMessageDTO[];

  /** Opcional, pero útil si lo querés leer */

  @IsOptional()
  metadata?: {
    display_phone_number?: string;

    phone_number_id?: string;
  };

  /** Opcional: no lo procesamos, pero puede venir */

  @IsOptional()
  contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
}

/** changes[] */

export class WhatsAppChangeDTO {
  @IsString()
  field!: 'messages';

  @ValidateNested()
  @Type(() => WhatsAppValueDTO as any)
  value!: WhatsAppValueDTO;
}

/** entry[] */

export class WhatsAppEntryDTO {
  @IsString()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppChangeDTO as any)
  changes!: WhatsAppChangeDTO[];
}

/** payload raíz del webhook */

export class WhatsAppWebhookDTO {
  @IsString()
  object!: 'whatsapp_business_account';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppEntryDTO as any)
  entry!: WhatsAppEntryDTO[];
}
