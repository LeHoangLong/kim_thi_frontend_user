import { injectable } from "inversify";
import { Address } from "../models/Address";
import { OrderModel } from "../models/OrderModel";
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";
import { IOrderRepository, OrderItemsModel } from "./IOrderRepository";

@injectable()
export class MockOrderRepository implements IOrderRepository {
    async createOrder(
        orderItems: OrderItemsModel,
        address: Address,
    ) : Promise<OrderModel> {
        return {
            id: 0,
            items: orderItems,
            address: address,
        }
    }
}