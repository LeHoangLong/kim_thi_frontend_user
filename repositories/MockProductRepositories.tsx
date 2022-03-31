import 'reflect-metadata'
import { injectable } from 'inversify'
import { ProductSummary } from "../models/ProductSummary";
import { ProductDetailModel } from '../models/ProductDetailModel'
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { GetCategoriesArgs, GetProductCountArgs, GetProductSummariesArgs, IProductRepositories } from "./IProductRepositories";
import { NotFound } from '../exceptions/NotFound'
import Decimal from 'decimal.js';

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
                            minQuantity: (new Decimal(i * 10)).toString(),
                            price: i * 1000 + 100,
                        },
                        {
                            minQuantity: (new Decimal(i * 20)).toString(),
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
                                minQuantity: (new Decimal(i * 10)).toString(),
                                price: i * 100 + 10,
                            },
                            {
                                minQuantity: (new Decimal(i * 20)).toString(),
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
                wholesalePrices: [
                    '1xx,000 đ / kg > 100kg',
                    '9x,000 đ / kg > 200kg',
                ],
                description: 'description-1',
                images: [],
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
        for (let i = 0; i < this.products.length; i++) {
            if (args.categories.length === 0 || 
                args.categories[0] == '' || 
                this.products[i].categories.findIndex(e => args.categories.indexOf(e.category) !== -1) !== -1
            ) {
                summaries.push(this.productDetailToSummary(this.products[i]))
                count++
            }
        }

        summaries = summaries.filter(e => e.name.includes(args.productSearch))
        summaries = summaries.slice(args.offset, args.offset + args.limit)
        return summaries
    }

    async getNumberOfProducts(args: GetProductCountArgs): Promise<number> {
        let count = 0
        console.log('args.productSearch')
        console.log(args.productSearch)
        this.products.forEach((product) => {
            if (product.name.includes(args.productSearch)) {
                console.log('product.name 1')
                console.log(product.name)
                if (args.categories.length > 0 && args.categories[0] != '') {
                    for (let i = 0; i < args.categories.length; i++) {
                        let filterCategory = args.categories[i]
                        if (product.categories.findIndex(e => e.category == filterCategory) != -1) {
                            count = count + 1
                            break;
                        }
                    }
                } else {
                    console.log('product.name 2')
                    console.log(product.name)
                    count = count + 1;
                }
            }
        })

        console.log('count')
        console.log(count)
        console.log(this.products.length)
        return count
    }

    async getCategories(args: GetCategoriesArgs): Promise<ProductCategoryModel[]> {
        void(args)
        let ret: ProductCategoryModel[] = []
        for (let i = 0; i < 10; i++) {
            ret.push({
                category: 'cat ' + i,
            })
        }
        return ret
    }


    async fetchProductDetailById(id: number) : Promise<ProductDetailModel> {
        let productDetail = this.products.find(e => e.id == id)
        if (productDetail === undefined) {
            throw new NotFound("product", "id", id.toString());
        }
        return productDetail
    }
}
