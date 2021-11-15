import Decimal from "decimal.js";
import { inject, injectable } from "inversify";
import Symbols from "../config/Symbols";
import { Address } from "../models/Address";
import { IGeocodingService } from "../services/IGeocodingService";
import { IAddressRepository } from "./IAddressRepository";
import { IShippingFeeRepository } from "./IShippingFeeRepository";

@injectable()
export class LocalAddressRepository implements IAddressRepository {
    @inject( Symbols.GEOCODING_SERVICE ) private geocoder: IGeocodingService
    @inject( Symbols.SHIPPING_FEE_REPOSITORY ) private shippingFeeRepository: IShippingFeeRepository

    async removeAddress(id: number): Promise<void> {
        let addresses = this.fetchAllAddresses()
        let index = addresses.findIndex(e => e.id === id)
        if (index !== -1) {
            addresses.splice(index, 1)
        }
        localStorage.setItem('addresses', JSON.stringify(addresses))
    }

    async updateAddress(id: number, address: Address): Promise<Address> {
        let addresses = this.fetchAllAddresses()
        let index = addresses.findIndex(e => e.id === id)
        if (index === -1) {
            address.id = id
            addresses.push(address)
            return address
        } else {
            addresses[index] = address
        }
        localStorage.setItem('addresses', JSON.stringify(addresses))
        return address
    }

    async createAddress(address: string, recipientName: string, recipientPhoneNumber: string): Promise<Address> {
        let addressesStr : string | null = localStorage.getItem('addresses')
        let addresses : Address[]
        if (addressesStr == null) {
            addresses = []
        } else {
            addresses = JSON.parse(addressesStr)
        }

        let geocodedAddress = await this.geocoder.geocode(address)
        let newAddress : Address = {
            id: addresses.length + 1,
            address: geocodedAddress.address,
            latitude: geocodedAddress.latitude,
            longitude: geocodedAddress.longitude,
            city: geocodedAddress.city,
            recipientName: recipientName,
            phoneNumber: recipientPhoneNumber,
            isDefault: addresses.length == 0, // if first address created then is default
            isSelected: false,
        }
        addresses.push(newAddress)
        localStorage.setItem('addresses', JSON.stringify(addresses))
        return newAddress
    }

    async fetchNumberOfAddresses(): Promise<number> {
        return this.fetchAllAddresses().length
    }

    async fetchAddresses(offset: number, limit: number) : Promise<Address[]> {
        return this.fetchAllAddresses().slice(offset, offset + limit)
    }

    fetchAllAddresses() : Address[] {
        let addressesStr : string | null = localStorage.getItem('addresses')
        let addresses : Address[]
        if (addressesStr == null) {
            addresses = []
        } else {
            addresses = JSON.parse(addressesStr)
        }
        return addresses
    }
}