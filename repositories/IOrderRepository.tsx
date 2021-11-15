import Decimal from "decimal.js";
import { Address } from "../models/Address";
import { OrderItemUnitModel, OrderModel } from "../models/OrderModel";
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";

export interface OrderItemsModel {
    [index: number] : OrderItemUnitModel,
}

export class OutDatedFeeOrItem {
    toString() : string {
        return 'Outdated fee or item'
    }
}

export interface IOrderRepository {
    // bilLBasedTransportFee and addressTransportFee are used to 
    // verify with backend in case something is updated during this time
    // if there is any discrepencies, we will throw OutDatedFeeOrItem error
    createOrder(
        orderItems: OrderItemsModel,
        address: Address,
        expectedPaymentAmount: Decimal,
        message: string,
    ) : Promise<OrderModel>
}