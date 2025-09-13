import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';
import { PrismaService } from './services/prisma.service';
import { OptionModule } from './option/option.module';
import { PaymentModule } from './payment/payment.module';
import { PriceModule } from './price/price.module';
import whatsappConfig from './config/whatsapp.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [whatsappConfig],
    }),
    WebhookModule,
    SessionModule,
    OptionModule,
    PaymentModule,
    PriceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
