import { Address } from "../models/Address";

export interface IAddressRepository {
    // create address if not already exists
    updateAddress(id: number, address: Address): Promise<Address>
    // throw UnsupportedCity if we don't ship to this address
    createAddress(address: string, recipientName: string, recipientPhoneNumber: string): Promise<Address>
    fetchNumberOfAddresses(): Promise<number>
    fetchAddresses(offset: number, limit: number) : Promise<Address[]>
}