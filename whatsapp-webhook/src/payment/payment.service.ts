import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  getAll(): Promise<PaymentMethod[]> {
    return this.prisma.paymentMethod.findMany({ where: { active: true } });
  }
}
