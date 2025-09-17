import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';
import { PrismaService } from './services/prisma.service';
import { OptionModule } from './option/option.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
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
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
