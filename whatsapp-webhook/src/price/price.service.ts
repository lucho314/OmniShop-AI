import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { VendureProduct, VendureProductsResponse } from './price.types';

@Injectable()
export class PriceService {
  private readonly shopApiUrl =
    process.env.VENDURE_SHOP_API ?? 'http://localhost:3000/shop-api';

  async findByName(name: string): Promise<VendureProduct[]> {
    const query = `
      query GetProductByName($term: String!) {
        products(options: { filter: { name: { contains: $term } }, take: 5 }) {
          items {
            id
            name
            variants {
              id
              name
              priceWithTax
              currencyCode
            }
          }
        }
      }
    `;

    const response = await axios.post<VendureProductsResponse>(
      this.shopApiUrl,
      { query, variables: { term: name } },
      { headers: { 'Content-Type': 'application/json' } },
    );

    return response.data.data.products.items ?? [];
  }

  formatPrice(product: VendureProduct): string {
    if (!product || !product.variants?.length) return 'Producto sin variantes.';

    const variant = product.variants[0];
    const price = (variant.priceWithTax / 100).toFixed(2);
    return `${product.name} → ${price} ${variant.currencyCode}`;
  }
}
