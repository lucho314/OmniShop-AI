import { Controller, Get, Query } from '@nestjs/common';
import { PriceService } from './price.service';
import { VendureProduct } from './price.types';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  async findByName(@Query('q') q: string): Promise<string[]> {
    if (!q) {
      return ['Debes pasar un query param ?q=producto'];
    }

    const products: VendureProduct[] = await this.priceService.findByName(q);

    if (!products.length) {
      return [`No encontré productos con "${q}"`];
    }

    return products.map((p) => this.priceService.formatPrice(p));
  }
}
