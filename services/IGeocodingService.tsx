import { Address } from "../models/Address";

export interface GeocodedAddress {
    address: string,
    latitude: string,
    longitude: string,
    city: string,
}

export interface IGeocodingService {
    // throw UnsupportedCity if we dont deliver to this address
    geocode(address: string) : Promise<GeocodedAddress> // lat
}