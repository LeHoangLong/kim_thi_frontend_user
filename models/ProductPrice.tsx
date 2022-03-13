export const EPriceUnit : any = {
    0: "kg"
}

export interface PriceLevel {
    minQuantity: string, 
    price: number
}

export interface ProductPrice {
    unit: string,
    isDefault: boolean,
    defaultPrice: number,
    priceLevels: PriceLevel[],
}