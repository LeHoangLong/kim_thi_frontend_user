import { PriceRequestContact } from "../models/PriceRequestContactModel";

export interface IPriceRequestContactRepository {
    setContact(arg: PriceRequestContact);
    // throw Not found if not set yet
    getContact(): Promise<PriceRequestContact>;
}