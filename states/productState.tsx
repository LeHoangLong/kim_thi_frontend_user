import { ProductDetailModel } from '../models/ProductDetailModel'

export interface ProductDetailMap {
    [key: number] : ProductDetailModel
}

export interface ProductState {
    productDetails: ProductDetailMap // key is product id
}
