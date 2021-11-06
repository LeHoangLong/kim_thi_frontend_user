import Decimal from "decimal.js";
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";

export interface IShippingFeeRepository {
    fetchBillBasedTransportFees(city: string, latitude: Decimal, longitude: Decimal) : Promise<BillBasedTransportFee[]>
    fetchAreaTransportFee(city: string, latitude: Decimal, longitude: Decimal) : Promise<AddressTransportFee>
}