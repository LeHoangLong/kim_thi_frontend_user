import 'reflect-metadata'
import { ProductDetailModel } from "../models/ProductDetailModel";
import { ProductSummary } from "../models/ProductSummary";
import { GetCategoriesArgs, GetProductCountArgs, GetProductSummariesArgs, IProductRepositories } from "./IProductRepositories";
import axios, { AxiosError } from 'axios'
import { BACKEND_URL, FILESERVER_URL } from "../config/Url";
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { EPriceUnit, PriceLevel, ProductPrice } from "../models/ProductPrice";
import { ImageModel } from "../models/ImageModel";
import { injectable } from 'inversify';
import { NotFound } from '../exceptions/NotFound';
import Decimal from 'decimal.js';

export function jsonToProductSummary(json: any) : ProductSummary {
    return {
        id: json['product']['id'],
        name: json['product']['name'],
        defaultPrice: json['defaultPrice'] !== undefined? jsonToProductPrice(json['defaultPrice']) : null,
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
        minQuantity: (new Decimal(json['minQuantity'])).toString(), 
        price: parseInt(json['price'])
    }
}

export function jsonToProductPrice(json: any) : ProductPrice {
    let ret: ProductPrice =  {
        unit: (json['unit'] as string).toLowerCase(),
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
    let path = json['path']
    if (!path.includes('http')) {
        path = FILESERVER_URL + '/' + path 
    }
    return {
        id: json['id'],
        path: path,
    }
}


export function jsonToProductDetail(json: any) : ProductDetailModel {
    let ret : ProductDetailModel = {
        id: json.product.id,
        serialNumber: json.product.serialNumber,
        defaultPrice: json['defaultPrice'] !== undefined? jsonToProductPrice(json['defaultPrice']) : null,
        alternativePrices: [],
        wholesalePrices: json.product.wholesalePrices,
        name: json.product.name,
        avatar: jsonToImageModel(json.avatar),
        rank: parseInt(json.product.rank),
        categories: [],
        isDeleted: json.product.isDeleted,
        description: json.product.description,
        images: [],
    }

    for (let i = 0; i < json['alternativePrices'].length; i++) {
        ret.alternativePrices.push(jsonToProductPrice(json['alternativePrices'][i]))
    }

    for (let i = 0; i < json['categories'].length; i++) {
        ret.categories.push(jsonToProductCategory(json['categories'][i]))
    }

    for (let i = 0; i < json['images'].length; i++) {
        ret.images.push(jsonToImageModel(json['images'][i]))
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

    async getNumberOfProducts(args: GetProductCountArgs): Promise<number> {
        let response = await axios.get(`${BACKEND_URL}/products/summaries/count`, {
            params: args,
        })
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