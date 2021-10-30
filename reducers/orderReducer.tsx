import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderModel } from "../models/OrderModel";
import { EStatus, StatusModel } from "../models/StatusModel";
import { OrderState } from "../states/orderState";

const initialState : OrderState = {
    orders: [],
    operationStatus: {
        status: EStatus.INIT,
    }, 
}

const slice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderOperationStatus: (state, action: PayloadAction<StatusModel>)  =>{
            state.operationStatus = action.payload
        },
        setOrders: (state, action: PayloadAction<OrderModel[]>) => {
            state.orders = action.payload
        },
    }
})

export const { setOrderOperationStatus, setOrders } = slice.actions
export default slice.reducer