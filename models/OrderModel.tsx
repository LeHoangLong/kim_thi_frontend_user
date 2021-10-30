import { Address } from "./Address";
import { AddressTransportFee, BillBasedTransportFee } from "./TransportFee";

export interface OrderItemUnitModel {
    [index: string]: {
        quantity: number,
    },
}

export interface OrderModel {
    id: number,
    items: {
        [index: number] : OrderItemUnitModel,
    },
    address: Address,
    billBasedTransportFees: BillBasedTransportFee[],
    addressTransportFees: AddressTransportFee[],
}
