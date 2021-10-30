import { configureStore } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import { AddressState } from '../states/addressState';
import { CartState } from '../states/cartState';
import { MessageState } from '../states/messageState';
import { OrderState } from '../states/orderState';
import { ProductState } from '../states/productState';
import { ShippingFeeState } from '../states/shippingFeeState';
import addressReducer from './addressReducer';
import cartReducer from './cartReducer'
import messageReducer from './messageReducer';
import orderReducer from './orderReducer';
import productReducer from './productReducer'
import shippingFeeReducer from './shippingFeeReducer';

export interface RootState {
    cart: CartState,
    products: ProductState,
    addresses: AddressState,
    shippingFee: ShippingFeeState,
    orders: OrderState,
    messages: MessageState,
}

const rootReducers = combineReducers({
    cart: cartReducer,
    products: productReducer,
    addresses: addressReducer,
    shippingFee: shippingFeeReducer,
    orders: orderReducer,
    messages: messageReducer,
});


export const store = configureStore<RootState>({
    reducer: (state, action) => {
        if (action.type === HYDRATE) {
            const nextState = {
                ...state,
                ...action.payload,
            }
            nextState.cart = state.cart
            nextState.products = state.products
            nextState.addresses = state.addresses
            nextState.shippingFee = state.shippingFee
            nextState.orders = state.orders
            nextState.messages = state.messages
            return nextState
        } else {
            return rootReducers(state, action)
        }
    }
})

export default store

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
