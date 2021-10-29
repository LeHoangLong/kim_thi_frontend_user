import Decimal from "decimal.js"
import { useEffect, useState } from "react"
import Symbols from "../../config/Symbols"
import myContainer from "../../container"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { Address } from "../../models/Address"
import { addAddressTransportFees } from "../../reducers/shippingFeeReducer"
import { IShippingFeeRepository } from "../../repositories/IShippingFeeRepository"
import Loading from "../components/Loading"
import styles from './AddressCard.module.scss'

export interface AddressCardProps {
    address: Address,
    onSelected(): void,
}

export const AddressCard = (props: AddressCardProps) => {
    let shippingFees = useAppSelector(state => state.shippingFee.addressTransportFee)
    let [isLoading, setIsLoading] = useState(false)
    let dispatch = useAppDispatch()
    let shippingFeeRepository = myContainer.get<IShippingFeeRepository>(Symbols.SHIPPING_FEE_REPOSITORY)

    async function fetchShippingFee() {
        try {
            setIsLoading(true)
            let shippingFee = await shippingFeeRepository.fetchAreaTransportFee(new Decimal(props.address.latitude), new Decimal(props.address.longitude))
            dispatch(addAddressTransportFees({
                transportFee: shippingFee,
                addressId: props.address.id,
            }))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let shippingFee = shippingFees.find(e => e.addressId == props.address.id)
        if (!shippingFee && !isLoading) {
            fetchShippingFee()
        }
    }, [props.address, shippingFees, isLoading])

    function displayTransportFee() {
        let shippingFee = shippingFees.find(e => e.addressId == props.address.id)
        if (isLoading || !shippingFee) {
            return <Loading></Loading>
        } else {
            return <p>Phí vận chuyển: <strong>{ shippingFee.transportFee.toLocaleString() } đ</strong></p>
        }
    }

    return <article className={ styles.address_card } onClick={ props.onSelected }>
        <div className={ styles.main }>
            <h6>
                <strong>{ props.address.address }</strong>
            </h6>
            <p>Tên người nhận: <strong>{ props.address.recipientName }</strong> </p>
            <p>SĐT: <strong>{ props.address.phoneNumber }</strong> </p>
            { displayTransportFee() }
        </div>
    </article>
}