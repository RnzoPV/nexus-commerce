export interface OrderItem {
  productId: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
}

export interface Order {
  id: string;
  status: 'PENDING';
  currency: 'PEN';
  items: OrderItem[];
  totalCents: number;
}
