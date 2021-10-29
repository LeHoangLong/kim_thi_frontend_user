import { injectable } from "inversify";
import { Address } from "../models/Address";
import { GeocodedAddress, IGeocodingService } from "./IGeocodingService";

@injectable()
export class MockGeocodingService implements IGeocodingService {
    async geocode(address: string) : Promise<GeocodedAddress> {
        return {
            address: address, 
            latitude: '120.000001',  
            longitude: '20.000001',
        }
    }
}