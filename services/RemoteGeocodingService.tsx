import axios, { AxiosError } from "axios";
import { injectable } from "inversify";
import { BACKEND_URL } from "../config/Url";
import { UnsupportedCity } from "../exceptions/UnsupportedCity";
import { GeocodedAddress, IGeocodingService } from "./IGeocodingService";

@injectable()
export class RemoteGeocodingSerivce implements IGeocodingService {
    async geocode(address: string) : Promise<GeocodedAddress> {
        try {
            let response = await axios.post(`${BACKEND_URL}/geocoding/`, {
                address: address
            })
            
            return {
                address: address, 
                latitude: response.data.latitude,  
                longitude: response.data.longitude,
                city: response.data.city,
            }
        } catch (exception) {
            if (axios.isAxiosError(exception)) {
                let axiosError = exception as AxiosError
                if (axiosError.response.status == 404) {
                    throw new UnsupportedCity('Unsupported city')
                } else {
                    throw exception
                }
            } else {
                throw exception
            }
        }
    }
}