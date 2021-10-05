import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartState } from '../states/cartState'

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
        addItem: (state, action: PayloadAction<CartItemQuantity>) => {
            if (action.payload.quantity >= 0) {
                if (!(action.payload.productId in state.cart)) {
                    state.cart[action.payload.productId] = {}
                }

                if (action.payload.unit in state.cart[action.payload.productId]) {
                    state.cart[action.payload.productId][action.payload.unit] += action.payload.quantity
                } else {
                    state.cart[action.payload.productId][action.payload.unit] = action.payload.quantity
                }
            }

        }
    }
})

export const { addItem } = slice.actions
export default slice.reducer
