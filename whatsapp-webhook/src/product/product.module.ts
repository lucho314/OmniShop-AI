import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ProductService, ConfigService],
})
export class ProductModule {}
