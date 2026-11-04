import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './interfaces/order.interfaces';
import { CATALOG_PRICING } from './ports/catalog-pricing.token';
import type { catalogPricingPort } from './ports/catalog-pricing.port';
import type { OrderRepositoryPort } from './ports/order-repository.port';
import { ORDER_REPOSITORY } from './ports/order-repository.token';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(CATALOG_PRICING)
    private readonly catalogPricing: catalogPricingPort,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const items: OrderItem[] = [];
    let totalCents = 0;
    for (const requestedItem of dto.items) {
      const unitPriceCents = this.catalogPricing.getPriceCents(
        requestedItem.productId,
      );
      if (unitPriceCents === undefined) {
        throw new BadRequestException(
          `Product ${requestedItem.productId} is not available`,
        );
      }
      const subtotalCents = requestedItem.quantity * unitPriceCents;
      const nextTotalCents = totalCents + subtotalCents;
      if (
        !Number.isSafeInteger(subtotalCents) ||
        !Number.isSafeInteger(nextTotalCents)
      ) {
        throw new BadRequestException(
          'Order amount exceeds the supported limit',
        );
      }

      items.push({
        productId: requestedItem.productId,
        quantity: requestedItem.quantity,
        unitPriceCents,
        subtotalCents,
      });
      totalCents = nextTotalCents;
    }
    const order: Order = {
      id: randomUUID(),
      status: 'PENDING',
      currency: 'PEN',
      items,
      totalCents,
    };

    await this.orderRepository.save(order);
    return order;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }
}
