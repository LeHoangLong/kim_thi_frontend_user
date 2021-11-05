import axios from "axios";
import { injectable } from "inversify";
import { BACKEND_URL } from "../config/Url";
import { GeocodedAddress, IGeocodingService } from "./IGeocodingService";

@injectable()
export class RemoteGeocodingSerivce implements IGeocodingService {
    async geocode(address: string) : Promise<GeocodedAddress> {
        let response = await axios.post(`${BACKEND_URL}/geocoding/`, {
            address: address
        })

        return {
            address: address, 
            latitude: response.data.latitude,  
            longitude: response.data.longitude,
            city: response.data.city,
        }
    }
}