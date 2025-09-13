import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  providers: [SessionService, PrismaService],
  exports: [SessionService, PrismaService],
})
export class SessionModule {}
