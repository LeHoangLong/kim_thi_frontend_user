import { Address } from "../models/Address";

export interface GeocodedAddress {
    address: string,
    latitude: string,
    longitude: string,
}

export interface IGeocodingService {
    geocode(address: string) : Promise<GeocodedAddress> // lat
}