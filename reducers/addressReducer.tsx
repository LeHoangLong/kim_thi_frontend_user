import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Address } from '../models/Address'
import { EStatus, StatusModel } from '../models/StatusModel'
import { AddressState } from '../states/addressState'

const initialState : AddressState = {
    addresses: [],
    numberOfAddresses: -1,
    operationStatus: {
        status: EStatus.INIT
    },
}

export interface CartItemQuantity {
    productId: number,
    unit: string,
    quantity: number,
}

const slice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {
        setAddressOperationStatus: (state, action: PayloadAction<StatusModel>) => {
            state.operationStatus = action.payload
        },
        setAddreses: (state, action: PayloadAction<Address[]>) => {
            state.addresses = action.payload
        },
        setNumberOfAddresses: (state, action: PayloadAction<number>) => {
            state.numberOfAddresses = action.payload
        }
    }
})

export const { setAddreses, setNumberOfAddresses, setAddressOperationStatus } = slice.actions
export default slice.reducer
