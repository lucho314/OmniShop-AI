import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { VendureProduct, VendureProductsResponse } from './price.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly vendureApi: string;
  private readonly vendureToken: string;
  constructor(private readonly config: ConfigService) {
    this.vendureApi =
      this.config.get('VENDURE_API') || 'http://localhost:3000/shop-api';
    this.vendureToken = this.config.get('VENDURE_TOKEN') || '';
  }

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
      this.vendureApi,
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

  /** Obtener detalle de un producto por id */
  async getDetail(productId: string) {
    const body = {
      query: `
        query Product($id: ID!) {
          product(id: $id) {
            id
            name
            description
            variants {
              id
              sku
              priceWithTax { value currencyCode }
            }
          }
        }
      `,
      variables: { id: productId },
    };

    try {
      const res = await axios.post<{ data: { product: any } }>(
        this.vendureApi,
        body,
        {
          headers: {
            Authorization: `Bearer ${this.vendureToken}`,
          },
        },
      );

      if (
        !res.data ||
        typeof res.data !== 'object' ||
        !res.data.data?.product
      ) {
        throw new Error('Estructura de respuesta inválida');
      }

      return res.data.data.product;
    } catch (error: unknown) {
      console.error('Error al obtener detalle del producto:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(
        `No se pudo obtener el detalle del producto: ${errorMessage}`,
      );
    }
  }
}
