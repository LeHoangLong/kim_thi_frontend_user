import { ProductSummary } from "../models/ProductSummary";
import { ProductDetailModel } from '../models/ProductDetailModel'
import { ProductCategoryModel } from "../models/ProductCategoryModel";

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
    getCategories(args: GetCategoriesArgs) : Promise<ProductCategoryModel[]>;

    // Throw NotFound exception if id not found
    fetchProductDetailById(id: number) : Promise<ProductDetailModel>
}
