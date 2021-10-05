import { CartModel } from '../models/CartModel'

export interface ICartRepository {
    fetchCart() : Promise<CartModel>
    saveCart(cart: CartModel) : Promise<void>
}
