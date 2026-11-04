export interface catalogPricingPort {
  getPriceCents(productId: string): number | undefined;
}
