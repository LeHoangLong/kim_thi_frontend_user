import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MessageState } from "../states/messageState"

const initialState : MessageState = {
    count: 0,
    message: '',
}

const slice = createSlice({
    initialState,
    name: 'message',
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
            state.count = state.count + 1
        }
    },
})

export const { setMessage } = slice.actions
export default slice.reducer