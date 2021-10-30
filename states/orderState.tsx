import { OrderModel } from "../models/OrderModel";
import { StatusModel } from "../models/StatusModel";

export interface OrderState {
    orders: OrderModel[],
    operationStatus: StatusModel,
}