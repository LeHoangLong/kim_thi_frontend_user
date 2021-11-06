import Decimal from "decimal.js";
import { injectable } from "inversify";
import { Address } from "../models/Address";
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";
import { IShippingFeeRepository } from "./IShippingFeeRepository";

@injectable()
export class MockShippingFeeRepository implements IShippingFeeRepository {
    async fetchBillBasedTransportFees(city: string, latitude: Decimal, longitude: Decimal) : Promise<BillBasedTransportFee[]> {
        return [
            {
                minBillValue: '10000',
                basicFee: '-10000',
                fractionOfBill: '-0.1',
                fractionOfTotalTransportFee: '-0.1'
            },
            {
                minBillValue: '20000',
                basicFee: '-10000',
            },
        ]
    }

    async fetchAreaTransportFee(city: string, latitude: Decimal, longitude: Decimal) : Promise<AddressTransportFee> {
        return { 
            addressId: 0, 
            transportFee: 100000
        }
    }
}