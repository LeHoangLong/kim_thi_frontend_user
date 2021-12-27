import React, { useEffect, useRef, useState } from "react"
import Symbols from "../../config/Symbols"
import myContainer from "../../container"
import { CartController } from "../../controllers/CartController"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { setMessage } from "../../reducers/messageReducer"
import { setOrderOperationStatus, setOrders } from "../../reducers/orderReducer"
import { HeaderBar } from "../components/HeaderBar"
import Loading from "../components/Loading"
import { withAddresses } from "../hocs/withAddresses"
import { withCart } from "../hocs/withCart"
import styles from './PriceRequestPage.module.scss'
import router from 'next/router'
import { setCart } from "../../reducers/cartReducer"
import { sendGoogleAnalyticsEvent } from "../../services/GoogleAnalytics"
import { CreatePriceRequestArgs, CreatePriceRequestItemArgs, IPriceRequestRepository } from "../../repositories/IPriceRequestRepository"
import Decimal from "decimal.js"

export interface PriceRequestPageProps {
    onBack(): void
    onPriceRequestSent(): void
}

const PriceRequestPage = (props: PriceRequestPageProps) => {
    let [isLoading, setIsLoading] = useState(true)
    
    let cartOperationStatus = useAppSelector(state => state.cart.operationStatus)
    let productOperationStatus = useAppSelector(state => state.products.operationStatus)
    let cart = useAppSelector(state => state.cart.cart)
    let orderOperationStatus = useAppSelector(state => state.orders.operationStatus)
    let productDetails = useAppSelector(state => state.products.productDetails)

    let [customerAddress, setCustomerAddress] = useState('')
    let [customerMessage, setCustomerMessage] = useState('')
    let [customerPhone, setCustomerPhone] = useState('')
    let [customerName, setCustomerName] = useState('')

    useEffect(() => {
        let storedCustomerAddress = localStorage.getItem('customerAddress')
        let storedCustomerMessage = localStorage.getItem('customerMessage')
        let storedCustomerPhone = localStorage.getItem('customerPhone')
        let storedCustomerName = localStorage.getItem('customerName')

        if (storedCustomerAddress !== null) {
            setCustomerAddress(storedCustomerAddress)
        }

        if (storedCustomerMessage !== null) {
            setCustomerMessage(storedCustomerMessage)
        }

        if (storedCustomerPhone !== null) {
            setCustomerPhone(storedCustomerPhone)
        }

        if (storedCustomerName !== null) {
            setCustomerName(storedCustomerName)
        }
    }, [])

    let dispatch = useAppDispatch()

    let priceRequestRepository = myContainer.get<IPriceRequestRepository>(Symbols.PRICE_REQUEST_REPOSITORY)
    let cartController = myContainer.get<CartController>(Symbols.CART_CONTROLLER)

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
    }, [cartOperationStatus, productOperationStatus, orderOperationStatus])

    function displayPriceRequestItems() {
        let ret : React.ReactNode[] = []
        for (let itemName in cart) {
            let item = cart[itemName]
            for (let unit in item) {
                if (item[unit].selected) {
                    let product = productDetails[itemName]
                    let quantity = item[unit].quantity
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


    let [showMissingNumberMessage, setShowMissingNumberMessage] = useState(false)
    let [showMissingAddressMessage, setShowMissingAddressMessage] = useState(false)
    let [showMissingNameMessage, setShowMissingNameMessage] = useState(false)

    async function onSendPriceRequestButtonClicked() {
        if (customerPhone.length == 0) {
            setShowMissingNumberMessage(true)
        } else {
            setShowMissingNumberMessage(false)
        }

        if (customerName.length == 0) {
            setShowMissingNameMessage(true)
        } else {
            setShowMissingNameMessage(false)
        }

        if (customerAddress.length == 0) {
            setShowMissingAddressMessage(true)
        } else {
            setShowMissingAddressMessage(false)
        }

        if (customerPhone.length == 0 || customerName.length == 0 || customerAddress.length == 0) {
            return
        }

        sendGoogleAnalyticsEvent({ eventName: 'request_price', action: 'click', category: 'button', label: 'send_order', value: 0})
        try {
            dispatch(setOrderOperationStatus({
                status: EStatus.IN_PROGRESS
            }))
            let items: CreatePriceRequestItemArgs[] = []
            for (let productId in cart) {
                for (let unit in cart[productId]) {
                    if (cart[productId][unit].selected) {
                        items.push({
                            productId: parseInt(productId),
                            quantity: new Decimal(cart[productId][unit].quantity),
                            unit: unit,
                        })
                    }
                }
            }

            let arg : CreatePriceRequestArgs = {
                items,
                customerAddress,
                customerMessage,
                customerPhone,
                customerName,
            }

            await priceRequestRepository.createPriceRequest(
                arg, 
            )
            // order created, then clear cart
            await cartController.clearCart()
            dispatch(setCart({}))
            dispatch(setMessage('Đơn hàng đã được gửi đi và sớm sẽ được xử lí.\n Cảm ơn bạn đã ủng hộ chúng tôi'))
            dispatch(setOrderOperationStatus({
                status: EStatus.SUCCESS
            }))
            router.replace('/')
            props.onPriceRequestSent()
        } catch (exception) {
            console.log('create order exception')
            console.log(exception)
        } finally {
            dispatch(setOrderOperationStatus({
                status: EStatus.IDLE
            }))
        }
    }

    function onCustomerNameChanged(value: string) {
        localStorage.setItem('customerName', value)
        setCustomerName(value)
    }

    function onCustomerAddressChanged(value: string) {
        localStorage.setItem('customerAddress', value)
        setCustomerAddress(value)
    }

    function onCustomerPhoneChanged(value: string) {
        if (value.match(/^\d*$/)) {
            localStorage.setItem('customerPhone', value)
            setCustomerPhone(value)
        }
    }
    
    function onCustomerMessageChanged(value: string) {
        localStorage.setItem('customerMessage', value)
        setCustomerMessage(value)
    }

    return <React.Fragment>
        <HeaderBar onBack={ props.onBack } title="Yêu cầu báo giá"></HeaderBar>
        {(() => {
            if (isLoading) {
                return <Loading></Loading>
            } else {
                return <form onSubmit={e => {
                    e.preventDefault()
                    onSendPriceRequestButtonClicked()
                }} className={ styles.form } autoComplete="off">
                    <label className={ styles.required } htmlFor='customer-name'>Tên</label>
                    <input className={ styles.input } id='customer-name' type="text" value={ customerName } onChange={e => onCustomerNameChanged(e.target.value)}></input>
                    <p className={ styles.error_message } style={{ height: showMissingNameMessage? '20px' : '0px' }}>Mục này không được để trống</p>
                    
                    <label className={ styles.required } htmlFor='customer-address'>Địa chỉ</label>
                    <input className={ styles.input } id='customer-address' type="text" value={ customerAddress } onChange={e => onCustomerAddressChanged(e.target.value)}></input>
                    <p className={ styles.error_message } style={{ height: showMissingAddressMessage? '20px' : '0px' }}>Mục này không được để trống</p>
                    
                    <label className={ styles.required } htmlFor='customer-phone'>SĐT</label>
                    <input className={ styles.input } id='customer-phone' type="text" value={ customerPhone }  onChange={e => onCustomerPhoneChanged(e.target.value)}></input>
                    <p className={ styles.error_message } style={{ height: showMissingNumberMessage? '20px' : '0px' }}>Mục này không được để trống</p>
                    
                    <label htmlFor='customer-message'>Lời nhắn</label>
                    <textarea className={ styles.input } id='customer-message' value={ customerMessage } onChange={e => onCustomerMessageChanged(e.target.value)}></textarea>
                    { displayPriceRequestItems() }
                    <div className={ styles.fake_footer }></div>
                    <div className={ styles.send_request_button_container }>
                        <button onClick={ onSendPriceRequestButtonClicked } className={ styles.send_request_button }>Gửi yêu cầu báo giá</button>
                    </div>
                </form>
            }
        })()}
    </React.Fragment>
}

const PriceRequestPageWithCart = withAddresses(withCart(PriceRequestPage))
export default PriceRequestPageWithCart