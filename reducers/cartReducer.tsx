import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartState } from '../states/cartState'
import { CartModel } from '../models/CartModel'
import { EStatus, StatusModel } from '../models/StatusModel'

const initialState : CartState = {
    cart: {},
    operationStatus: {
        status: EStatus.INIT,
    },
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
        setCartOperationStatus: (state, action: PayloadAction<StatusModel>) => {
            state.operationStatus = action.payload
        },
        setCart: (state, action: PayloadAction<CartModel>) => {
            state.cart = action.payload
        }
    }
})

export const { setCart, setCartOperationStatus } = slice.actions
export default slice.reducer
