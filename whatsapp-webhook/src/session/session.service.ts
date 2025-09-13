import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  get(wa_id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { wa_id } });
  }

  set(wa_id: string, state: string, context: any = {}): Promise<Session> {
    const updatedAt = Date.now();
    return this.prisma.session.upsert({
      where: { wa_id },
      update: {
        state,
        context: JSON.stringify(context),
        updatedAt: BigInt(updatedAt),
      },
      create: {
        wa_id,
        state,
        context: JSON.stringify(context),
        updatedAt: BigInt(updatedAt),
      },
    });
  }

  reset(wa_id: string): Promise<Session> {
    return this.set(wa_id, 'idle', {});
  }

  async hasProcessed(messageId: string): Promise<boolean> {
    const existing = await this.prisma.processedMessage.findUnique({
      where: { id: messageId },
    });
    return !!existing;
  }

  async markProcessed(messageId: string) {
    await this.prisma.processedMessage.create({
      data: { id: messageId },
    });
  }

  async getContext<T = any>(wa_id: string): Promise<T> {
    const session = await this.get(wa_id);
    return (session?.context as T) ?? ({} as T);
  }

  async setContext(wa_id: string, context: any) {
    return this.prisma.session.update({
      where: { wa_id },
      data: { context: JSON.stringify(context), updatedAt: BigInt(Date.now()) },
    });
  }
}
