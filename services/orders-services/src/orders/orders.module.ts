import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { InMemoryCatalogAdapter } from './adapters/in-memory-catalog.adapter';
import { CATALOG_PRICING } from './ports/catalog-pricing.token';
import { ORDER_REPOSITORY } from './ports/order-repository.token';
import { InMemoryOrderRepository } from './adapters/in-memory-order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './infrastructure/persistence/typeorm/order.entity';
import { OrderItemEntity } from './infrastructure/persistence/typeorm/order-item.entity';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: CATALOG_PRICING,
      useClass: InMemoryCatalogAdapter,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: InMemoryOrderRepository,
    },
  ],
  imports:[TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])]
})
export class OrdersModule { }
