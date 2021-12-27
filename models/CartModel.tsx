
export interface CartItemUnitModel {
    [index: string]: {
        quantity: string,
        selected: boolean,
    },
}

export interface CartModel {
    [index: number] : CartItemUnitModel,
}
