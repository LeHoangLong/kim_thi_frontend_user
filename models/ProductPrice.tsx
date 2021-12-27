import Decimal from "decimal.js";

export const EPriceUnit : any = {
    0: "kg"
}

export interface PriceLevel {
    minQuantity: Decimal, 
    price: number
}

export interface ProductPrice {
    unit: string,
    isDefault: boolean,
    defaultPrice: number,
    priceLevels: PriceLevel[],
}