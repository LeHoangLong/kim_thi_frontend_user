import Decimal from "decimal.js"
import React, { useEffect, useRef, useState } from "react"
import Symbols from "../../config/Symbols"
import { AddressPageZ, CheckoutPageZ } from "../../config/ZIndex"
import myContainer from "../../container"
import { CartController } from "../../controllers/CartController"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { Address } from "../../models/Address"
import { EStatus } from "../../models/StatusModel"
import { BillBasedTransportFee } from "../../models/TransportFee"
import { setAddreses } from "../../reducers/addressReducer"
import { setMessage } from "../../reducers/messageReducer"
import { setOrderOperationStatus, setOrders } from "../../reducers/orderReducer"
import { RootState } from "../../reducers/rootReducer"
import { addAddressTransportFees, setBillBasedFees, setShippingFeeOperationStatus } from "../../reducers/shippingFeeReducer"
import { IAddressRepository } from "../../repositories/IAddressRepository"
import { IOrderRepository } from "../../repositories/IOrderRepository"
import { IShippingFeeRepository } from "../../repositories/IShippingFeeRepository"
import { calculatePriceAndMinQuantity } from "../../services/CalculatePriceAndMinQuantity"
import { HeaderBar } from "../components/HeaderBar"
import Loading from "../components/Loading"
import { PageTransition } from "../components/PageTransition"
import { withAddresses } from "../hocs/withAddresses"
import { withCart } from "../hocs/withCart"
import { AddressCard } from "./AddressCard"
import AddressPage from "./AddressPage"
import styles from './CheckoutPage.module.scss'
import router from 'next/router'

export interface CheckoutPageProps {
    display: boolean
    onBack(): void
}

const CheckoutPage = (props: CheckoutPageProps) => {
    let [isLoading, setIsLoading] = useState(true)
    let [showAddressPage, setShowAddressPage] = useState(false)
    
    let cartOperationStatus = useAppSelector(state => state.cart.operationStatus)
    let productOperationStatus = useAppSelector(state => state.products.operationStatus)
    let addresses = useAppSelector((state: RootState) => state.addresses.addresses)
    let cart = useAppSelector(state => state.cart.cart)
    let numberOfAddresses = useAppSelector((state: RootState) => state.addresses.numberOfAddresses)
    let addressRepository = myContainer.get<IAddressRepository>(Symbols.ADDRESS_REPOSITORY)
    let addressOperationStatus = useAppSelector(state => state.addresses.operationStatus)
    let orderOperationStatus = useAppSelector(state => state.orders.operationStatus)
    let productDetails = useAppSelector(state => state.products.productDetails)
    let dispatch = useAppDispatch()

    let addressTransportFee = useAppSelector(state => state.shippingFee.addressTransportFee)
    let billBasedTransportFees = useAppSelector(state => state.shippingFee.billBasedFees)
    let transportFeeOperationStatus = useAppSelector(state => state.shippingFee.operationStatus)
    let shippingFeeRepository = myContainer.get<IShippingFeeRepository>(Symbols.SHIPPING_FEE_REPOSITORY)
    let orderRepository = myContainer.get<IOrderRepository>(Symbols.ORDER_REPOSITORY)
    let cartController = myContainer.get<CartController>(Symbols.CART_CONTROLLER)

    async function fetchBillBasedTransportFees(address: Address) {
        try {
            dispatch(setShippingFeeOperationStatus({
                status: EStatus.IN_PROGRESS
            }))
            let newBillBasedTransportFees = await shippingFeeRepository.fetchBillBasedTransportFees(address.city, new Decimal(address.latitude), new Decimal(address.longitude))
            dispatch(setBillBasedFees(newBillBasedTransportFees))
            dispatch(setShippingFeeOperationStatus({
                status: EStatus.SUCCESS
            }))
        } finally {
            dispatch(setShippingFeeOperationStatus({
                status: EStatus.IDLE
            }))
        }
    }

    let [isFetchingAddressShippingFee, setIsFetchingAddressShippingFee] = useState(false)

    async function fetchAddressShippingFee(address: Address) {
        try {
            setIsFetchingAddressShippingFee(true)
            let transportFee = await shippingFeeRepository.fetchAreaTransportFee(address.city, new Decimal(address.latitude), new Decimal(address.longitude))
            dispatch(addAddressTransportFees({
                addressId: address.id,
                transportFee: transportFee.transportFee,
            }))
        } finally {
            setIsFetchingAddressShippingFee(false)
        }
    }

    useEffect(() => {
        async function init() {

        }

        // fetch all addresses
        if (addressOperationStatus.status === EStatus.INIT) {
            init()    
        }
    }, [addressOperationStatus])

    let [fetchedBillBasedTransportFeeAddressId, setFetchedBillBasedTransportFeeAddressId] = useState(-1)
    useEffect(() => {
        let selectedAddress = getSelectedAddress()
        if ((transportFeeOperationStatus.status === EStatus.INIT || transportFeeOperationStatus.status === EStatus.IDLE) && 
            selectedAddress &&
            selectedAddress.id !== fetchedBillBasedTransportFeeAddressId) {
            fetchBillBasedTransportFees(selectedAddress)
            setFetchedBillBasedTransportFeeAddressId(selectedAddress.id)
        }
    }, [transportFeeOperationStatus, addresses])

    function getSelectedAddress() {
        let selectedAddress = addresses.find(e => e.isSelected)
        if (!selectedAddress) {
            selectedAddress = addresses.find(e => e.isDefault)
        }
        return selectedAddress
    }
    function getSelectedAddressShippingFee() {
        let selectedAddress = getSelectedAddress()
        if (selectedAddress) {
            return addressTransportFee.find(e => e.addressId === selectedAddress.id)
        }
    }

    useEffect(() => {
        let selectedAddress = getSelectedAddress()

        if (selectedAddress) {
            let shippingFee = addressTransportFee.find(e => e.addressId === selectedAddress.id)
            if (!shippingFee && !isFetchingAddressShippingFee) {
                fetchAddressShippingFee(selectedAddress)
            }
        }
    }, [addresses])

    useEffect(() => {
        if (numberOfAddresses === 0 && props.display) {
            setShowAddressPage(true)
        }
    }, [numberOfAddresses, props.display])

    useEffect(() => {
        if (cartOperationStatus.status === EStatus.IN_PROGRESS ||
            productOperationStatus.status === EStatus.IN_PROGRESS ||
            productOperationStatus.status === EStatus.INIT ||
            cartOperationStatus.status === EStatus.INIT ||
            orderOperationStatus.status === EStatus.IN_PROGRESS
        ) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [cartOperationStatus, productOperationStatus])

    function onAddressPageBack() {
        setShowAddressPage(false)
        if (numberOfAddresses === 0) {
            props.onBack()
        } else {
            
        }
    }

    async function onAddressSelected(address: Address) {
        address = {
            ...address,
            isSelected: true
        }
        let newAddresses = [...addresses]
        let selectedAddressIndex = addresses.findIndex(e => e.isSelected)
        if (selectedAddressIndex !== -1) {
            let selectedAddress = addresses[selectedAddressIndex]
            selectedAddress = {
                ...selectedAddress,
                isSelected: false,
            }
            selectedAddress = await addressRepository.updateAddress(selectedAddress.id, selectedAddress)
            newAddresses[selectedAddressIndex] = selectedAddress
        }
        let newSelectedAddress = await addressRepository.updateAddress(address.id, address)
        let newSelectedAddressIndex = addresses.findIndex(e => e.id === newSelectedAddress.id)
        newAddresses[newSelectedAddressIndex] = newSelectedAddress
        dispatch(setAddreses([...addresses]))
        setShowAddressPage(false)
    }

    function displayAddressCard() {
        let selectedAddress = addresses.find(e => e.isSelected)
        if (!selectedAddress) {
            selectedAddress = addresses.find(e => e.isDefault)
        }

        if (selectedAddress) {
            return <div className={ styles.address_card }><AddressCard address={ selectedAddress } onSelected={() => setShowAddressPage(true)}></AddressCard></div>
        }
    }

    function calculateBillBasedTransportFee(billBasedTransportFee: BillBasedTransportFee, billValue: number, transportFee: number) : Decimal {
        let total = new Decimal(0)
        if (billBasedTransportFee.basicFee) {
            total = total.add(billBasedTransportFee.basicFee)
        }

        if (billBasedTransportFee.fractionOfBill) {
            total = total.add(new Decimal(billBasedTransportFee.fractionOfBill).mul(new Decimal(billValue)))
        }

        if (billBasedTransportFee.fractionOfTotalTransportFee) {
            total = total.add(new Decimal(billBasedTransportFee.fractionOfTotalTransportFee).mul(new Decimal(transportFee)))
        }

        return total
    }

    function displayTransportFees(billValue: number, transportFee: number) : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        for (let i = 0 ; i < billBasedTransportFees.length; i++) {
            let total = calculateBillBasedTransportFee(billBasedTransportFees[i], billValue, transportFee)
            let feeOrDiscountStr = 'Phí'
            if (total.lessThan(new Decimal(0))) {
                feeOrDiscountStr = 'Chiết khấu'
            }
            ret.push(
                <div className={ styles.transport_fee } key={ 'bill_based_' + i }>
                    {(() => {
                        if (billBasedTransportFees[i].minBillValue) {
                            return <p>{ feeOrDiscountStr } vận chuyển với hóa đơn&nbsp;&gt;&nbsp;{ parseInt(billBasedTransportFees[i].minBillValue).toLocaleString() } đ</p>
                        } else {
                            return <p>{ feeOrDiscountStr } vận chuyển theo hóa đơn</p>
                        }
                    })()}
                    <p>{ total.toNumber().toLocaleString() } đ</p>
                </div>
            )
        }
        return ret
    }

    function calculateItemsValue() {
        let total = 0
        for (let itemName in cart) {
            let item = cart[itemName]
            for (let unit in item) {
                if (item[unit].selected) {
                    let product = productDetails[itemName]
                    let quantity = item[unit].quantity
                    let [price, _] = calculatePriceAndMinQuantity(product, unit, quantity)
                    total += price * quantity
                }
            }
        }
        return total
    }
    function displayCheckedOutItems() {
        let ret : React.ReactNode[] = []
        for (let itemName in cart) {
            let item = cart[itemName]
            for (let unit in item) {
                if (item[unit].selected) {
                    let product = productDetails[itemName]
                    let quantity = item[unit].quantity
                    let [price, _] = calculatePriceAndMinQuantity(product, unit, quantity)
                    if (product) {
                        ret.push(
                            <article className={ styles.item_card } key={ product.id + '_' + item[unit] }>
                                <figure>
                                    <img className={ styles.cart_item_avatar } src={ product.avatar.path }></img>
                                </figure>
                                <div>
                                    <h6 className={ styles.item_name }>
                                        <strong>
                                            { product.name }
                                        </strong>
                                    </h6>
                                    <p className={ styles.item_total }>Tổng: { (price * quantity).toLocaleString() } đ </p>
                                    <p className={ styles.item_quantity }> S.lg: { quantity } { unit }</p>
                                </div>
                            </article>
                        )
                    }
                }
            }
        }
        return ret
    }

    function calculateTotalValue(transportFee: number) : Decimal {

        let total = new Decimal(0)
        for (let itemName in cart) {
            let item = cart[itemName]
            for (let unit in item) {
                if (item[unit].selected) {
                    let product = productDetails[itemName]
                    let quantity = item[unit].quantity
                    let [price, _] = calculatePriceAndMinQuantity(product, unit, quantity)
                    total = total.add(new Decimal(price * quantity))
                }
            }
        }

        let checkedOutItemsValue = total.toNumber()
        for (let i = 0 ; i < billBasedTransportFees.length; i++) {
            total = total.add(calculateBillBasedTransportFee(billBasedTransportFees[i], checkedOutItemsValue, transportFee))
        }


        total =  total.add(new Decimal(transportFee))
        return total
    }

    async function onSendOrderButtonClicked() {
        try {
            dispatch(setOrderOperationStatus({
                status: EStatus.IN_PROGRESS
            }))
            let selectedAddress = getSelectedAddress()
            let transportFee = getSelectedAddressShippingFee()
            let order = await orderRepository.createOrder(
                cart, 
                selectedAddress, 
            )
            // order created, then clear cart
            await cartController.clearCart()
            dispatch(setMessage('Đơn hàng đã được gửi đi và sớm sẽ được xử lí.\n Cảm ơn bạn đã ủng hộ chúng tôi'))
            dispatch(setOrders([order]))
            dispatch(setOrderOperationStatus({
                status: EStatus.SUCCESS
            }))
            router.replace('/')
        } finally {
            dispatch(setOrderOperationStatus({
                status: EStatus.IDLE
            }))
        }
    }

    let transportFee = getSelectedAddressShippingFee()

    return <React.Fragment>
        <PageTransition show={ showAddressPage } zIndex={ AddressPageZ }>
            <AddressPage onBack={ onAddressPageBack } onAddressSelected={ onAddressSelected }></AddressPage>
        </PageTransition>
        <HeaderBar onBack={ props.onBack } title="Thanh toán"></HeaderBar>
        {(() => {
            if (isLoading || !transportFee) {
                return <Loading></Loading>
            } else {
                return <React.Fragment>
                    { displayAddressCard() } 
                    { displayCheckedOutItems() }
                    { displayTransportFees(calculateItemsValue(), transportFee.transportFee) }
                    <div className={ styles.transport_fee }>
                        <p>Phí vận chuyển đến địa điểm:</p> 
                        <p>{ transportFee.transportFee.toLocaleString()} đ</p>
                    </div>
                    <div className={ styles.total_fee }>
                        <strong>Tổng cộng:</strong> 
                        <strong>{ calculateTotalValue(transportFee.transportFee).toNumber().toLocaleString() } đ</strong>
                    </div>
                    <button onClick={ onSendOrderButtonClicked } className={ styles.send_order_button }>Gửi đơn hàng</button>
                </React.Fragment>
            }
        })()}
    </React.Fragment>
}

const CheckoutPageWithCart = withAddresses(withCart(CheckoutPage))
export default CheckoutPageWithCart