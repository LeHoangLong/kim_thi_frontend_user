import Decimal from "decimal.js";
import { BillBasedTransportFee } from "../models/TransportFee";

export interface IShippingFeeRepository {
    fetchBillBasedTransportFees() : Promise<BillBasedTransportFee[]>
    fetchAreaTransportFee(latitude: Decimal, longitude: Decimal) : Promise<number>
}