import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { SessionService } from 'src/session/session.service';
import { PrismaService } from 'src/services/prisma.service';
import { WebhookService } from './webhook.service';
import { ConfigService } from '@nestjs/config';
import { OptionService } from 'src/option/option.service';
import { OptionHandlerFactory } from './option-handler.factory';
import { OrderHandler } from './handlers/order.handler';
import { PriceHandler } from './handlers/price.handler';
import { PaymentHandler } from './handlers/payment.handler';
import { MenuHandler } from './handlers/menu.handler';
import { PaymentService } from 'src/payment/payment.service';
import { PriceService } from 'src/price/price.service';

@Module({
  controllers: [WebhookController],
  providers: [
    SessionService,
    PrismaService,
    WebhookService,
    ConfigService,
    WebhookService,
    OptionService,
    OptionHandlerFactory,
    OrderHandler,
    PriceHandler,
    PaymentHandler,
    MenuHandler,
    PaymentService,
    PriceService,
  ],
})
export class WebhookModule {}
