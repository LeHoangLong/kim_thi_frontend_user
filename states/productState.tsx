import { ProductDetailModel } from '../models/ProductDetailModel'
import { StatusModel } from '../models/StatusModel';

export interface ProductDetailMap {
    [key: number] : ProductDetailModel
}

export interface ProductState {
    productDetails: ProductDetailMap, // key is product id
    operationStatus: StatusModel,
}
