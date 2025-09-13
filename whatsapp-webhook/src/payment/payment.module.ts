import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [PaymentService, PrismaService],
})
export class PaymentModule {}
