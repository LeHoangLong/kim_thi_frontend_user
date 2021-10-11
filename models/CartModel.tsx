export interface CartItemUnitModel {
    [index: string]: {
        quantity: number,
        selected: boolean,
    },
}

export interface CartModel {
    [index: number] : CartItemUnitModel,
}
