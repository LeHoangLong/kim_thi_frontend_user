import 'reflect-metadata'
import { ProductDetailModel } from "../models/ProductDetailModel";
import { ProductSummary } from "../models/ProductSummary";
import { GetCategoriesArgs, GetProductSummariesArgs, IProductRepositories } from "./IProductRepositories";
import axios, { AxiosError } from 'axios'
import { BACKEND_URL, FILESERVER_URL } from "../config/Url";
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { EPriceUnit, PriceLevel, ProductPrice } from "../models/ProductPrice";
import { ImageModel } from "../models/ImageModel";
import { injectable } from 'inversify';
import { NotFound } from '../exceptions/NotFound';

export function jsonToProductSummary(json: any) : ProductSummary {
    return {
        id: json['product']['id'],
        name: json['product']['name'],
        defaultPrice: {
            unit: EPriceUnit[json['defaultPrice']['unit']],
            isDefault: true,
            defaultPrice: json['defaultPrice']['defaultPrice'],
            priceLevels: json['defaultPrice']['priceLevels'],
        },
        avatar: jsonToImageModel(json['avatar']),
    }
}

export function jsonToProductCategory(json: any) : ProductCategoryModel {
    return {
        category: json['category']
    }
}

export function jsonToPriceLevel(json: any) : PriceLevel {
    return {
        minQuantity: parseInt(json['minQuantity']), 
        price: parseInt(json['price'])
    }
}

export function jsonToProductPrice(json: any) : ProductPrice {
    let ret: ProductPrice =   {
        unit: json['unit'],
        isDefault: json['isDefault'],
        defaultPrice: parseInt(json['defaultPrice']),
        priceLevels: [],
    }

    for (let i = 0; i < json['priceLevels'].length; i++) {
        ret.priceLevels.push(json['priceLevels'][i])
    }

    return ret
}

export function jsonToImageModel(json: any) : ImageModel {
    return {
        id: json['id'],
        path: FILESERVER_URL + '/' + json['path'],
    }
}


export function jsonToProductDetail(json: any) : ProductDetailModel {
    let ret : ProductDetailModel = {
        id: json.product.id,
        serialNumber: json.product.serialNumber,
        defaultPrice: jsonToProductPrice(json['defaultPrice']),
        alternativePrices: [],
        wholesalePrices: json.product.wholesalePrices,
        name: json.product.name,
        avatar: jsonToImageModel(json.avatar),
        rank: parseInt(json.product.rank),
        categories: [],
        isDeleted: json.product.isDeleted,
    }

    for (let i = 0; i < json['alternativePrices'].length; i++) {
        ret.alternativePrices.push(jsonToProductPrice(json['alternativePrices'][i]))
    }

    for (let i = 0; i < json['categories'].length; i++) {
        ret.categories.push(jsonToProductCategory(json['categories'][i]))
    }

    return ret
}

@injectable()
export class RemoteProductRepository implements IProductRepositories {
    async getProductSummaries(args: GetProductSummariesArgs): Promise<ProductSummary[]> {
        let response = await axios.get(`${BACKEND_URL}/products/summaries/`, {
            params: args
        })

        let ret : ProductSummary[] = []
        for (let i = 0; i < response.data.length; i++) {
            ret.push(jsonToProductSummary(response.data[i]))
        }
        return ret
    }

    async getNumberOfProducts(): Promise<number> {
        let response = await axios.get(`${BACKEND_URL}/products/summaries/count`)
        return parseInt(response.data)
    }

    async getCategories(args: GetCategoriesArgs): Promise<ProductCategoryModel[]> {
        let response = await axios.get(`${BACKEND_URL}/categories/`, {
            params: args
        })

        let ret: ProductCategoryModel[] = []
        for (let i = 0; i < response.data.length; i++) {
            ret.push(jsonToProductCategory(response.data[i]))
        }
        return ret
    }

    async fetchProductDetailById(id: number): Promise<ProductDetailModel> {
        try {
            let response = await axios.get(`${BACKEND_URL}/products/${id}`)
            return jsonToProductDetail(response.data)
        } catch (exception) {
            if (axios.isAxiosError(exception)) {
                let axiosError = exception as AxiosError
                if (axiosError.response.status === 404) {
                    throw new NotFound('Product', 'id', id.toString())
                } else {
                    throw exception
                }
            } else {
                throw exception
            }
        }
    }
}