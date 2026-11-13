import type { Order } from "../../../interfaces/order.interfaces";
import { OrderEntity } from "./order.entity";


function toSafeInteger(value:string):number {
    const integer = BigInt(value);
    if(integer > BigInt(Number.MAX_SAFE_INTEGER)|| integer < BigInt(Number.MIN_SAFE_INTEGER)){
        throw new Error(`Entero fuera del rango seguro : ${value}`);
    }
    return Number(integer);
}

export class OrderMapper{
    static toDomain(entity: OrderEntity):Order{
        if(entity.status !== 'PENDING'){
            throw new Error(`Estado no reconocido: ${entity.status}`);
        }
        if(entity.currency !== 'PEN'){
            throw new Error(`Moneda no reconocida: ${entity.currency}`);
        }
        return{
            id: entity.id,
            status: entity.status,
            currency: entity.currency,
            totalCents: toSafeInteger(entity.totalCents),
            items: entity.items.map((item)=>({
                productId: item.productId,
                quantity: item.quantity,
                unitPriceCents: toSafeInteger(item.unitPriceCents),
                subtotalCents: toSafeInteger(item.subtotalCents)
            }))
        }
    }
}