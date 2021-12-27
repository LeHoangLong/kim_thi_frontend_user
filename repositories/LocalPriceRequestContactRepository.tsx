import { NotFound } from "../exceptions/NotFound";
import { PriceRequestContact } from "../models/PriceRequestContactModel";
import { IPriceRequestContactRepository } from "./IPriceRequestContactRepository";

export class LocalPriceRequestContactRepository implements IPriceRequestContactRepository {
    setContact(arg: PriceRequestContact) {
        localStorage.setItem('price_request_contact', JSON.stringify(arg));
    }

    async getContact(): Promise<PriceRequestContact> {
        let contactString = localStorage.getItem('price_request_contact');
        if (contactString !== null) {
            return JSON.parse(contactString)
        } else {
            throw new NotFound('price_request_contact', '', '')
        }
    }
}