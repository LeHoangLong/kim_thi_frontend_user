import { injectable } from "inversify";
import { UnsupportedCity } from "../exceptions/UnsupportedCity";
import { Address } from "../models/Address";
import { GeocodedAddress, IGeocodingService } from "./IGeocodingService";

@injectable()
export class MockGeocodingService implements IGeocodingService {
    async geocode(address: string) : Promise<GeocodedAddress> {
        if (address.includes('Lào cai')) {
            throw new UnsupportedCity(`${address} is not supported`)
        }
        return {
            address: address, 
            latitude: '120.000001',  
            longitude: '20.000001',
            city: 'Thành phố Hồ Chí Minh'
        }
    }
}