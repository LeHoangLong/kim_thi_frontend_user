import { configureStore } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import cartReducer from './cartReducer'
import productReducer from './productReducer'

const rootReducers = combineReducers({
    cart: cartReducer,
    products: productReducer,
});


export const store = configureStore({
    reducer: (state, action) => {
        if (action.type === HYDRATE) {
            const nextState = {
                ...state,
                ...action.payload,
            }
            nextState.cart = state.cart
            nextState.products = state.products
            return nextState
        } else {
            return rootReducers(state, action)
        }
    }
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
