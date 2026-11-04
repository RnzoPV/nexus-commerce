import { Injectable } from '@nestjs/common';
import { OrderRepositoryPort } from '../ports/order-repository.port';
import { Order } from '../interfaces/order.interfaces';

@Injectable()
export class InMemoryOrderRepository implements OrderRepositoryPort {
  private readonly orders = new Map<string, Order>();
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }
}
