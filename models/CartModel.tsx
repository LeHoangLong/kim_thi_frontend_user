export interface CartItemUnitModel {
    [index: string]: number,
}

export interface CartModel {
    [index: number] : CartItemUnitModel,
}
