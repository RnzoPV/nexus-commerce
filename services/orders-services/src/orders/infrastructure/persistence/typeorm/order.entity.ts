import{Column,Entity,OneToMany,PrimaryColumn} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity{
    @PrimaryColumn('uuid')
    id:string;
    @Column({type:'varchar', length:20})
    status:string;
    @Column({type:'varchar',length:3})
    currency:string;
    @Column({name:'total_cents',type:'bigint'})
    totalCents:string;

    @OneToMany(()=>OrderItemEntity,(item)=>item.order)
    items:OrderItemEntity[]
}