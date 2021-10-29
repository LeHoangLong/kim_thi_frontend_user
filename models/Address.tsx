export interface Address {
    id: number,
    address: string,
    latitude: string,
    longitude: string,
    recipientName: string,
    phoneNumber: string,
    isDefault: boolean, // default address cannot be deleted
    isSelected: boolean,
}