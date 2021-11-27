export const EPriceUnit : any = {
    0: "kg"
}

export interface PriceLevel {
    minQuantity: number, 
    price: number
}

export interface ProductPrice {
    unit: string,
    isDefault: boolean,
    defaultPrice: number,
    priceLevels: PriceLevel[],
}