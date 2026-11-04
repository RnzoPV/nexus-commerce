import { Injectable } from '@nestjs/common';
import { catalogPricingPort } from '../ports/catalog-pricing.port';

@Injectable()
export class InMemoryCatalogAdapter implements catalogPricingPort {
  private readonly catalog = new Map<string, number>([
    ['PROD-001', 1999],
    ['PROD-002', 1050],
  ]);
  getPriceCents(productId: string): number | undefined {
    return this.catalog.get(productId);
  }
}
