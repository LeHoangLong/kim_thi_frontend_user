import { Address } from "../models/Address";
import { StatusModel } from "../models/StatusModel";

export interface AddressState {
    addresses: Address[]
    numberOfAddresses: number,
    operationStatus: StatusModel,
}