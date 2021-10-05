import { ImageModel } from "./ImageModel";
import { ProductCategoryModel } from "./ProductCategoryModel";
import { ProductPrice } from "./ProductPrice";

export interface ProductDetailModel {
    id: number,
    serialNumber: string,
    defaultPrice: ProductPrice,
    alternativePrices: ProductPrice[],
    name: string,
    avatar: ImageModel,
    rank: number,
    categories: ProductCategoryModel[]
}
