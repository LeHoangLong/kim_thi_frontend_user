import { ProductState } from '../states/productState'
import { ProductDetailModel } from '../models/ProductDetailModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EStatus, StatusModel } from '../models/StatusModel'

let initialState : ProductState = {
    productDetails: {},
    operationStatus: {
        status: EStatus.INIT,
    }
}


const slice = createSlice({
    initialState,
    name: 'product',
    reducers: {
        setProductOperationStatus(state, action: PayloadAction<StatusModel>) {
            state.operationStatus = action.payload
        },
        addProduct(state, action: PayloadAction<ProductDetailModel>) {
            state.productDetails[action.payload.id] = action.payload
        }
    }
})

export const { addProduct, setProductOperationStatus } = slice.actions
export default slice.reducer
