import { Address } from "../models/Address";

export interface GeocodedAddress {
    address: string,
    latitude: string,
    longitude: string,
    city: string,
}

export interface IGeocodingService {
    geocode(address: string) : Promise<GeocodedAddress> // lat
}