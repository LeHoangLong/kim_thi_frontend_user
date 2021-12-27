import Decimal from "decimal.js";

export interface CreatePriceRequestItemArgs {
    productId: number,
    quantity: Decimal,
    unit: string,
}

export interface CreatePriceRequestArgs {
    items: CreatePriceRequestItemArgs[],
    customerAddress: string,
    customerMessage: string,
    customerPhone: string,
    customerName: string,
}

export interface IPriceRequestRepository {
    createPriceRequest(arg: CreatePriceRequestArgs) : Promise<boolean>
}