import axios from "axios";
import Decimal from "decimal.js";
import { injectable } from "inversify";
import { BACKEND_URL } from "../config/Url";
import { Address } from "../models/Address";
import { OrderModel } from "../models/OrderModel";
import { IOrderRepository, OrderItemsModel } from "./IOrderRepository";

@injectable()
export class RemoteOrderRepository implements IOrderRepository {
    async createOrder(
        orderItems: OrderItemsModel,
        address: Address,
        expectedPaymentAmount: Decimal,
        message: string,
    ) : Promise<OrderModel> {
        try {
            let items: any[] = []
            for (let productId in orderItems) {
                for (let unit in orderItems[productId]) {
                    items.push({
                        productId: parseInt(productId),
                        unit: unit,
                        quantity: orderItems[productId][unit].quantity,
                    })
                }
            }
            let response = await axios.post(`${BACKEND_URL}/orders/`, {
                items: items,
                address: {
                    latitude: address.latitude.toString(),
                    longitude: address.longitude.toString(),
                },
                customerContact: {
                    name: address.recipientName,
                    phoneNumber: address.phoneNumber,
                },
                expectedPrice: expectedPaymentAmount.toString(),
                customerMessage: message,
            })
            let data = response.data
            let receivedItems = {}
            for (let i = 0; i < data.items.length; i++) {
                let item = data.items[i]
                if (!(item.productId in receivedItems)) {
                    receivedItems[item.productId] = {}
                }

                let unit = item.unit.toLowerCase()
                if (!(unit in receivedItems[item.productId])) {
                    receivedItems[item.productId][unit] = {
                        quantity: 0,
                    }    
                }
                receivedItems[item.productId][unit].quantiy += parseInt(item.quantiy)
            }
            let receivedAddress = data.address
            let ret: OrderModel = {
                id: data.id,
                items: receivedItems,
                address: {
                    id: receivedAddress.id,
                    address: receivedAddress.address,
                    city: receivedAddress.city,
                    latitude: receivedAddress.latitude,
                    longitude: receivedAddress.longitude,
                    recipientName: data.customerContact.name,
                    phoneNumber: data.customerContact.phoneNumber,
                    isDefault: address.isDefault,
                    isSelected: address.isSelected,
                },
                message: data.message,
                paymentAmount: data.paymentAmount,
            }
            return ret
        } catch (exception) {
            throw exception
        }
    }
}