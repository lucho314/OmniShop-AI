import { Injectable } from '@nestjs/common';
import { Option } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  getMenuOptions(): Promise<Option[]> {
    return this.prisma.option.findMany({
      where: { type: 'menu' },
      orderBy: { id: 'asc' },
    });
  }

  getByCode(code: string): Promise<Option | null> {
    return this.prisma.option.findUnique({ where: { code } });
  }

  updateOption(code: string, data: Partial<Option>): Promise<Option> {
    return this.prisma.option.update({
      where: { code },
      data,
    });
  }

  deleteOption(code: string): Promise<Option> {
    return this.prisma.option.delete({ where: { code } });
  }
}
