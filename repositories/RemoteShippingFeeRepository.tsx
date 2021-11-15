import axios, { AxiosError } from "axios";
import Decimal from "decimal.js";
import { injectable } from "inversify";
import { BACKEND_URL } from "../config/Url";
import { NotFound } from "../exceptions/NotFound";
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";
import { IShippingFeeRepository } from "./IShippingFeeRepository";

@injectable()
export class RemoteShippingFeeRepository implements IShippingFeeRepository {
    jsonToBillBasedTransportFee(json: any) : BillBasedTransportFee {
        return {
            minBillValue: json.minBillValue,
            basicFee: json.basicFee,
            fractionOfBill: json.fractionOfBill,
            fractionOfTotalTransportFee: json.fractionOfTotalTransportFee,
        }
    }

    async fetchBillBasedTransportFees(city: string, latitude: Decimal, longitude: Decimal) : Promise<BillBasedTransportFee[]> {
        try {
            let response = await axios.get(`${BACKEND_URL}/transport_fees/bill_based`, {
                params: {
                    city: city,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                }
            })
            let ret: BillBasedTransportFee[] = []
            for (let i = 0; i < response.data.length; i++) {
                ret.push(this.jsonToBillBasedTransportFee(response.data[i]))
            }
            return ret
        } catch (exception) {
            if (axios.isAxiosError(exception)) {
                let axiosError = exception as AxiosError
                if (axiosError.response.status === 404) {
                    throw new NotFound('AreaTransportFee', 'city', city)
                }
            }

            throw exception
        }
    }

    jsonToAddressTransportFee(json: any): AddressTransportFee {
        return {
            addressId: json.addressId,
            transportFee: typeof(json.transportFee) === 'number'? json.transportFee : parseInt(json.transportFee),
        }
    }

    async fetchAreaTransportFee(city: string, latitude: Decimal, longitude: Decimal) : Promise<AddressTransportFee> {
        try {
            let response = await axios.get(`${BACKEND_URL}/transport_fees/area`, {
                params: {
                    city: city,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                }
            })
            return this.jsonToAddressTransportFee(response.data)
        } catch (exception) {
            if (axios.isAxiosError(exception)) {
                let axiosError = exception as AxiosError
                if (axiosError.response.status === 404) {
                    throw new NotFound('AreaTransportFee', 'city', city)
                }
            }
            throw exception
        }
    }
}