import { ImageModel } from './ImageModel';
import { ProductPrice } from './ProductPrice'

export interface ProductSummary {
    id: number,
    name: string,
    defaultPrice: ProductPrice | null,
    avatar: ImageModel,
}
