import { EStatus, StatusModel } from "../models/StatusModel";
import { ShippingFeeState } from "../states/shippingFeeState";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddressTransportFee, BillBasedTransportFee } from "../models/TransportFee";

const initialState : ShippingFeeState = {
    billBasedFees: [],
    addressTransportFee: [],
    operationStatus: {
        status: EStatus.INIT
    }
}

const slice = createSlice({
    name: 'shipping_fee',
    initialState,
    reducers: {
        setBillBasedFees: (state, action: PayloadAction<BillBasedTransportFee[]>) => {
            state.billBasedFees = action.payload
        },
        setShippingFeeOperationStatus: (state, action: PayloadAction<StatusModel>) => {
            state.operationStatus = action.payload
        },
        addAddressTransportFees: (state, action: PayloadAction<AddressTransportFee>) => {
            let index = state.addressTransportFee.findIndex(e => e.addressId === action.payload.addressId)
            if (index === -1) {
                state.addressTransportFee = [...state.addressTransportFee, action.payload]
            } else {
                state.addressTransportFee[index] = action.payload
            }
        }
    }
})

export const { setBillBasedFees, setShippingFeeOperationStatus, addAddressTransportFees } = slice.actions
export default slice.reducer