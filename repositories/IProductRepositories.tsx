import { ProductSummary } from "../models/ProductSummary";
import { ProductDetailModel } from '../models/ProductDetailModel'
import { ProductCategoryModel } from "../models/ProductCategoryModel";

export interface GetProductSummariesArgs {
    categories: string[],
    limit: number,
    offset: number,
    productSearch: string,
}

export interface GetProductCountArgs {
    categories: string[],
    productSearch: string,
}

export interface GetCategoriesArgs {
    limit: number,
    offset: number
}

export interface IProductRepositories {
    getProductSummaries(args: GetProductSummariesArgs) : Promise<ProductSummary[]>;
    getNumberOfProducts(args: GetProductCountArgs) : Promise<number>;
    getCategories(args: GetCategoriesArgs) : Promise<ProductCategoryModel[]>;

    // Throw NotFound exception if id not found
    fetchProductDetailById(id: number) : Promise<ProductDetailModel>
}
