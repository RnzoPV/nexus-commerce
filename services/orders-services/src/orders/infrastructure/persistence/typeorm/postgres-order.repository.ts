import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {OrderEntity} from './order.entity';
import { OrderMapper } from './order.mapper';
import { Order } from '../../../interfaces/order.interfaces';

@Injectable()
export class PostgresOrderRepository{
    constructor(
        @InjectRepository(OrderEntity)
        private readonly ordersRepository: Repository<OrderEntity>
    ){}

    async findById(id:string):Promise<Order|null>{
        const orderEntity = await this.ordersRepository.findOne({
            where:{id},
            relations:{
                items: true
            }
        });

        if(!orderEntity){
            return null;
        }
        return OrderMapper.toDomain(orderEntity);
    }
}