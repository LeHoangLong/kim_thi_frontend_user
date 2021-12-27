import axios, { AxiosError } from "axios";
import { injectable } from "inversify";
import { BACKEND_URL } from "../config/Url";
import { CreatePriceRequestArgs, IPriceRequestRepository } from "./IPriceRequestRepository";

@injectable()
export class RemotePriceRequestRepository implements IPriceRequestRepository {
    async createPriceRequest(arg: CreatePriceRequestArgs) : Promise<boolean> {
        try {
            let response = await axios.post(`${BACKEND_URL}/price_requests/`, arg)
            return true
        } catch (exception) {
            if (axios.isAxiosError(exception)) {
                let axiosError = exception as AxiosError
                throw axiosError.message
            } else {
                throw exception
            }
        }
    }
}