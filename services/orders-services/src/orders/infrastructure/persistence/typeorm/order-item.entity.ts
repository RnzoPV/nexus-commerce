import{Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity{
    @PrimaryGeneratedColumn('identity',{ type:'bigint'})
    id:string;
    @Column({name:'order_id',type:'uuid'})
    orderId:string;
    @Column({name:'product_id',type:'varchar',length:100})
    productId:string;
    @Column({type:'integer'})
    quantity:number;
    @Column({name:'unit_price_cents',type:'bigint'})
    unitPriceCents:string;
    @Column({name:'subtotal_cents',type:'bigint'})
    subtotalCents:string;

    @ManyToOne(()=>OrderEntity,(order)=> order.items,{nullable:false})
    @JoinColumn({name:'order_id'})
    order:OrderEntity
}