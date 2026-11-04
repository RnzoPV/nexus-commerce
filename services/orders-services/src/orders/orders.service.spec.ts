import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import type { catalogPricingPort } from './ports/catalog-pricing.port';
import type { OrderRepositoryPort } from './ports/order-repository.port';
import { Order } from './interfaces/order.interfaces';

describe('OrdersService', () => {
  let service: OrdersService;

  const catalogPricing: jest.Mocked<catalogPricingPort> = {
    getPriceCents: jest.fn(),
  };
  const orderRepository: jest.Mocked<OrderRepositoryPort> = {
    save: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    service = new OrdersService(catalogPricing, orderRepository);
  });

  it('should create an order with the correct total', async () => {
    catalogPricing.getPriceCents
      .mockReturnValueOnce(1999)
      .mockReturnValueOnce(1050);
    orderRepository.save.mockResolvedValue(undefined);

    const dto = {
      items: [
        { productId: 'PROD-001', quantity: 2 },
        { productId: 'PROD-002', quantity: 3 },
      ],
    };
    const result = await service.create(dto);
    expect(result.status).toBe('PENDING');
    expect(result.currency).toBe('PEN');
    expect(result.totalCents).toBe(7148);
    expect(orderRepository.save).toHaveBeenCalledTimes(1);
    expect(orderRepository.save).toHaveBeenCalledWith(result);
  });
  it('should rejected an order with an unknow product', async () => {
    catalogPricing.getPriceCents.mockReturnValue(undefined);

    const dto: CreateOrderDto = {
      items: [
        {
          productId: 'PROD-999',
          quantity: 1,
        },
      ],
    };

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });
  it('should propagate repository errors', async () => {
    //Arrange
    catalogPricing.getPriceCents.mockReturnValue(1999);
    orderRepository.save.mockRejectedValue(new Error('Database unavailable'));

    const dto: CreateOrderDto = {
      items: [{ productId: 'PROD-001', quantity: 1 }],
    };

    await expect(service.create(dto)).rejects.toThrow('Database unavailable');
    expect(orderRepository.save).toHaveBeenCalledTimes(1);
  });
  it('should return an existing order', async () => {
    const order: Order = {
      id: 'order-123',
      status: 'PENDING',
      currency: 'PEN',
      items: [
        {
          productId: 'PROD-001',
          quantity: 2,
          unitPriceCents: 1999,
          subtotalCents: 3998,
        },
      ],
      totalCents: 3998,
    };
    orderRepository.findById.mockResolvedValue(order);
    const result = await service.findOne('order-123');
    expect(result).toEqual(order);
    expect(orderRepository.findById).toHaveBeenCalledWith('order-123');
  });
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(service.findOne('order-unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should reject an order when subtotal exceeds safe integer limit', async () => {
    catalogPricing.getPriceCents.mockReturnValue(Number.MAX_SAFE_INTEGER);

    const dto: CreateOrderDto = {
      items: [
        {
          productId: 'PROD-001',
          quantity: 2,
        },
      ],
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });
  it('should rejected an order when acumulated total exceeds safe integer limit', async () => {
    const safePrice = Number.MAX_SAFE_INTEGER - 1;
    catalogPricing.getPriceCents
      .mockReturnValueOnce(safePrice)
      .mockReturnValueOnce(2);

    const dto: CreateOrderDto = {
      items: [
        {
          productId: 'PROD-001',
          quantity: 1,
        },
        {
          productId: 'PROD-002',
          quantity: 1,
        },
      ],
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });
});
