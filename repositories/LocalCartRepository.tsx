import 'reflect-metadata'
import { injectable } from 'inversify'
import { ICartRepository } from './ICartRepository'
import { CartModel } from '../models/CartModel'

@injectable()
export class LocalCartRepository implements ICartRepository  {
    async fetchCart() : Promise<CartModel> {
        let cart : string | null = localStorage.getItem('cart')
        if (cart == null) {
            cart = "{}"
        }
        return JSON.parse(cart)
    }

    async saveCart(cart: CartModel) : Promise<void> {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}
