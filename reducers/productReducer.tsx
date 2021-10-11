import { ProductState } from '../states/productState'
import { ProductDetailModel } from '../models/ProductDetailModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

let initialState : ProductState = {
    productDetails: {}
}


const slice = createSlice({
    initialState,
    name: 'product',
    reducers: {
        addProduct(state, action: PayloadAction<ProductDetailModel>) {
            state.productDetails[action.payload.id] = action.payload
        }
    }
})

export const { addProduct } = slice.actions
export default slice.reducer
