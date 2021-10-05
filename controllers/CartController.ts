import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import Symbols from '../config/Symbols'
import { ICartRepository } from '../repositories/ICartRepository'
import { CartModel } from '../models/CartModel'

@injectable()
export class CartController {
    private cart: CartModel

    @inject(Symbols.CART_REPOSITORY)
    private repository: ICartRepository

    constructor() {}

    async setItemQuantity(
        productId: number,
        unit: string,
        quantity: number,
    ) {
        if (this.cart == undefined) {
            this.cart = await this.repository.fetchCart()
        }

        if (!(productId in this.cart)) {
            this.cart[productId] = {}
        }

        if (!(unit in this.cart[productId])) {
            this.cart[productId][unit] = quantity
        }

        await this.repository.saveCart(this.cart)
    }

    async removeItem(
        productId: number,
        unit: string,
    ) {
        if (productId in this.cart) {
            delete this.cart[productId][unit]
        }
    }

    // Number of items (1 per unit)
    // So if a product has 2 kg and 2 bags
    // return 2
    async getTotalItemsCount() : Promise<number> {
        if (this.cart == undefined) {
            this.cart = await this.repository.fetchCart()
        }

        let count = 0
        for (let productId in this.cart) {
            count += Object.keys(this.cart[productId]).length;
        }
        return count
    }
}
