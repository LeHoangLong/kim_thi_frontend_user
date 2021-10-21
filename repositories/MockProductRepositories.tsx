import 'reflect-metadata'
import { injectable } from 'inversify'
import { ProductSummary } from "../models/ProductSummary";
import { ProductDetailModel } from '../models/ProductDetailModel'
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { GetCategoriesArgs, GetProductSummariesArgs, IProductRepositories } from "./IProductRepositories";
import { NotFound } from '../exceptions/NotFound'

@injectable()
export class MockProductRepositories implements IProductRepositories {
    public products: ProductDetailModel[] = []
    constructor() {
        for (let i = 0; i < 100; i++) {
            let categories: ProductCategoryModel[] = [{
                category: 'cat 1'
            }]
            if (i > 50) {
                categories.push({
                    category: 'cat 2'
                })
            }
            this.products.push({
                id: i,
                serialNumber: i.toString(),
                defaultPrice: {
                    unit: 'kg',
                    isDefault: false,
                    defaultPrice: i * 1000,
                    priceLevels: [
                        {
                            minQuantity: i * 10,
                            price: i * 1000 + 100,
                        },
                        {
                            minQuantity: i * 20,
                            price: i * 1000 + 200,
                        }
                    ]
                },
                alternativePrices: [
                    {
                        unit: 'bịch',
                        isDefault: false,
                        defaultPrice: i * 100,
                        priceLevels: [
                            {
                                minQuantity: i * 10,
                                price: i * 100 + 10,
                            },
                            {
                                minQuantity: i * 20,
                                price: i * 100 + 20,
                            }
                        ]
                    },
                ],
                name: 'product_' + i.toString(),
                avatar: {
                    id: 'image_id',
                    path: '/public/products/images/product_images/07633c67-0145-43ee-aa04-f84048f23824'
                    // path: 'https://static.theprint.in/wp-content/uploads/2020/12/randomnumber.jpg'
                },
                rank: i / 50,
                categories: categories,
                isDeleted: false,
            })
        }
    }

    private productDetailToSummary(productDetail: ProductDetailModel) : ProductSummary {
        return {
            id: productDetail.id,
            name: productDetail.name,
            defaultPrice: productDetail.defaultPrice,
            avatar: productDetail.avatar,
        }
    }

    async getProductSummaries(args: GetProductSummariesArgs): Promise<ProductSummary[]> {
        let summaries: ProductSummary[] = []
        let count = 0
        for (let i = args.offset; i < this.products.length && count < args.limit; i++) {
            if (args.categories.length === 0 || args.categories[0] == '' || this.products[i].categories.findIndex(e => args.categories.indexOf(e.category) !== -1) !== -1) {
                summaries.push(this.productDetailToSummary(this.products[i]))
                count++
            }
        }
        return summaries
    }

    async getNumberOfProducts(): Promise<number> {
        return this.products.length
    }

    async getCategories(args: GetCategoriesArgs): Promise<string[]> {
        void(args)
        return ['cat 1', 'cat 2']
    }


    async fetchProductDetailById(id: number) : Promise<ProductDetailModel> {
        let productDetail = this.products.find(e => e.id == id)
        if (productDetail === undefined) {
            throw new NotFound("product", "id", id.toString());
        }
        return productDetail
    }
}
