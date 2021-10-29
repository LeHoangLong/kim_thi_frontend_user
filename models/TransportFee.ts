export interface BillBasedTransportFee {
    minBillValue?: string,
    basicFee?: string,
    fractionOfBill?: string,
    fractionOfTotalTransportFee?: string,
}

export interface AddressTransportFee {
    addressId: number,
    transportFee: number,
}