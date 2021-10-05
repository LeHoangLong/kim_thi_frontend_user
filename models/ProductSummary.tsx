import { ImageModel } from './ImageModel';
import { ProductPrice } from './ProductPrice'

export interface ProductSummary {
    id: number,
    name: string,
    defaultPrice: ProductPrice,
    avatar: ImageModel,
}
