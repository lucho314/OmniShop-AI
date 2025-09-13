import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  providers: [OptionService, PrismaService],
})
export class OptionModule {}
