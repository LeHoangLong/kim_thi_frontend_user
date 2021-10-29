import { CartModel } from '../models/CartModel'
import { StatusModel } from '../models/StatusModel';

export interface CartState {
    cart : CartModel,
    operationStatus: StatusModel,
}
