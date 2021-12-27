import 'reflect-metadata'
import { injectable } from 'inversify'
import { ICartRepository } from './ICartRepository'
import { CartModel } from '../models/CartModel'
import Decimal from 'decimal.js'

@injectable()
export class LocalCartRepository implements ICartRepository  {
    async fetchCart() : Promise<CartModel> {
        let cartStr : string | null = localStorage.getItem('cart')
        let cart: CartModel
        if (cartStr == null) {
            cart = {}
        } else {
            cart = JSON.parse(cartStr)
            for (let productId in cart) {
                for (let unit in cart[productId]) {
                    cart[productId][unit].quantity = cart[productId][unit].quantity
                }
            }
        }
        return cart
    }

    async saveCart(cart: CartModel) : Promise<void> {
        let cartSerializable : any = {...cart}

        for (let productId in cart) {
            cartSerializable[productId] = {...cart[productId]}
            for (let unit in cart[productId]) {
                cartSerializable[productId][unit] = {...cart[productId][unit]}
                cartSerializable[productId][unit].quantity = cart[productId][unit].quantity.toString()
            }
        }
        localStorage.setItem('cart', JSON.stringify(cartSerializable))
    }
}
