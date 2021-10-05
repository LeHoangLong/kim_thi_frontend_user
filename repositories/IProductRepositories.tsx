import { ProductSummary } from "../models/ProductSummary";
import { ProductDetailModel } from '../models/ProductDetailModel'

export interface GetProductSummariesArgs {
    categories: string[],
    limit: number,
    offset: number,
}

export interface GetCategoriesArgs {
    limit: number,
    offset: number
}

export interface IProductRepositories {
    getProductSummaries(args: GetProductSummariesArgs) : Promise<ProductSummary[]>;
    getNumberOfProducts() : Promise<number>;
    getCategories(args: GetCategoriesArgs) : Promise<string[]>;
    fetchProductDetailById(id: number) : Promise<ProductDetailModel>
}
