import Decimal from "decimal.js"
import { ProductDetailModel } from "../models/ProductDetailModel"
import { ProductPrice } from "../models/ProductPrice"

export     function calculatePriceAndMinQuantity(
    productDetail: ProductDetailModel,
    unit: string,
    quantity: Decimal,
) : [number, Decimal] {

    let productPrice : ProductPrice
    if (productDetail.defaultPrice.unit == unit) {
        productPrice = productDetail.defaultPrice
    } else {
        for (let i = 0; i < productDetail.alternativePrices.length; i++) {
            if (productDetail.alternativePrices[i].unit == unit) {
                productPrice = productDetail.alternativePrices[i]
                break
            }
        }
    }
    console.assert(productPrice != undefined)

    let price = productPrice.defaultPrice
    let minQuantity = new Decimal(0)
    for (let i = 0; i < productPrice.priceLevels.length; i++) {
        if (quantity >= productPrice.priceLevels[i].minQuantity) {
            price = productPrice.priceLevels[i].price
            minQuantity = productPrice.priceLevels[i].minQuantity
        }
    }

    return [price, minQuantity]
}