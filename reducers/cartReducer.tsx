import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartState } from '../states/cartState'
import { CartModel } from '../models/CartModel'

const initialState : CartState = {
    cart: {}
}

export interface CartItemQuantity {
    productId: number,
    unit: string,
    quantity: number,
}

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartModel>) => {
            state.cart = action.payload
        }
    }
})

export const { setCart } = slice.actions
export default slice.reducer
