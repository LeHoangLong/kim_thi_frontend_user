import Decimal from "decimal.js";
import { Address } from "./Address";
import { AddressTransportFee, BillBasedTransportFee } from "./TransportFee";

export interface OrderItemUnitModel {
    [index: string]: {
        quantity: Decimal,
    },
}

export interface OrderModel {
    id: number,
    items: {
        [index: number] : OrderItemUnitModel,
    },
    address: Address,
    message: string,
    paymentAmount: Decimal,
}
