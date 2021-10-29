import { StatusModel } from "../models/StatusModel";
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";

export interface ShippingFeeState {
    billBasedFees: BillBasedTransportFee[],
    addressTransportFee: AddressTransportFee[],
    operationStatus: StatusModel,
}