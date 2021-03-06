import React, { useEffect, useState } from 'react'
import styles from './CartPage.module.scss'
import { useAppSelector, useAppDispatch } from '../../hooks/Hooks'
import myContainer from '../../container'
import { Symbols } from '../../config/Symbols'
import { CartController } from '../../controllers/CartController'
import { setCart } from '../../reducers/cartReducer'
import { Dialog } from '../components/Dialog'

import { Loading } from '../components/Loading'
import { HeaderBar } from '../components/HeaderBar'
import { PageTransition } from '../components/PageTransition'
import CheckoutPage from './CheckoutPage'
import { CheckoutPageZ } from '../../config/ZIndex'
import { EStatus } from '../../models/StatusModel'
import { withCart } from '../hocs/withCart'
import { calculatePriceAndMinQuantity } from '../../services/CalculatePriceAndMinQuantity'
import Decimal from 'decimal.js'

export interface CartPageProps {
    onBack?(): void
}

const CartPage = (props: CartPageProps) => {
    let cart = useAppSelector(state => state.cart.cart)
    let productDetails = useAppSelector(state => state.products.productDetails)
    let [isLoading, setIsLoading] = useState(true)
    let cartController = myContainer.get<CartController>(Symbols.CART_CONTROLLER)
    let dispatch = useAppDispatch()
    let [total, setTotal] = useState(new Decimal(0))
    let [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false)
    let [showCheckoutPage, setShowCheckoutPage] = useState(false)

    let cartOperationStatus = useAppSelector(state => state.cart.operationStatus)
    let productOperationStatus = useAppSelector(state => state.products.operationStatus)

    useEffect(() => {
        if (cartOperationStatus.status === EStatus.IN_PROGRESS ||
            productOperationStatus.status === EStatus.IN_PROGRESS ||
            productOperationStatus.status === EStatus.INIT
        ) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [cartOperationStatus, productOperationStatus])


    useEffect(() => {
        let total = new Decimal(0)
        for (let productId in cart) {
            if ((productId in productDetails)) {
                let productDetail = productDetails[productId]
                for (let unit in cart[productId]) {
                    if (cart[productId][unit].selected) {
                        let quantity = new Decimal(cart[productId][unit].quantity)
                        let [price, _] = calculatePriceAndMinQuantity(productDetail, unit, quantity)
                        total = total.add(quantity.mul(new Decimal(price)))
                    }
                }
            }
        }
        setTotal(total)
    }, [cart, productDetails])

    async function onCartItemSelectChanged(
        productId: number,
        unit: string,
        isSelected: boolean
    ) {
        await cartController.setCartItemSelect(productId, unit, isSelected)
        let cart = await cartController.getCart()
        dispatch(setCart(cart))
    }

    function buildCartItems() {
        let ret : React.ReactNode[] = []
        for (let productId in cart) {
            if (productId in productDetails) {
                let productDetail = productDetails[productId]
                for (let unit in cart[productId]) {
                    let [price, minQuantity] = calculatePriceAndMinQuantity(
                        productDetail,
                        unit,
                        new Decimal(cart[productId][unit].quantity)
                    )

                    let isSelected = cart[productId][unit].selected

                    ret.push(
                        <article className={ styles.cart_item } key={`${productId}_${unit}`}>
                            <aside className={ styles.cart_item_select }>
                                <input type="radio" checked={ isSelected } readOnly onClick={_ => onCartItemSelectChanged(parseInt(productId), unit, !isSelected)}></input>
                            </aside>
                            <figure>
                                <a className="cart-item-avatar-link">
                                    <img alt="???nh s???n ph???m" className={ styles.cart_item_avatar } src={ `${productDetail.avatar.path}` }/>
                                </a>
                            </figure>
                            <div>
                                <h6>
                                    <strong className="cart-item-product-name">
                                        { productDetail.name }
                                    </strong>
                                </h6>
                                <div className="cart-item-row cart-item-price-row">
                                    <h6 className="cart-item-price">{ price.toLocaleString('en') } ?? </h6>
                                    <p className="cart-item-min-quantity body-2"> / { minQuantity.greaterThan(0) ? minQuantity.toString() : "" } { unit }</p>
                                </div>
                                <input type="text" className="cart-item-quantity" value={ cart[productId][unit].quantity.toString() } onChange={(e) => onQuantityChanged(parseInt(productId), unit, new Decimal(e.target.value))}></input>
                            </div>
                        </article>
                    )

                }
            }
        }

        return ret
    }

    async function onQuantityChanged(
        productId: number,
        unit: string,
        quantity: Decimal,
    ) {
        if (!isNaN(productId) && !quantity.isNaN()) {
            await cartController.setItemQuantity(productId, unit, quantity)

            let cart = await cartController.getCart()
            dispatch(setCart(cart))
        }
    }

    function checkIfAllItemsSelected() {
        let isAllSelected = true
        for (let productId in cart) {
            for (let unit in cart[productId]) {
                if (!cart[productId][unit].selected) {
                    isAllSelected = false
                    break
                }
            }
            if (!isAllSelected) {
                break
            }
        }
        return isAllSelected
    }

    function checkIfAllItemsUnselected() {
        let isAllUnselected = true
        for (let productId in cart) {
            for (let unit in cart[productId]) {
                if (cart[productId][unit].selected) {
                    isAllUnselected = false
                    break
                }
            }
            if (!isAllUnselected) {
                break
            }
        }
        return isAllUnselected
    }

    async function onSelectAllClicked() {
        let isAllSelected = checkIfAllItemsSelected()
        if (isAllSelected) {
            // unselect all
            for (let productId in cart) {
                for (let unit in cart[productId]) {
                    await cartController.setCartItemSelect(
                        parseInt(productId),
                        unit,
                        false
                    )
                }
            }
        } else {
            // select all
            for (let productId in cart) {
                for (let unit in cart[productId]) {
                    await cartController.setCartItemSelect(
                        parseInt(productId),
                        unit,
                        true
                    )
                }
            }
        }

        let newCart = await cartController.getCart()
        dispatch(setCart(newCart))
    }

    function onRemoveItemButtonClicked() {
        setShowConfirmDeleteDialog(true)
    }

    function countNumberOfSelectedItems() {
        let count = 0
        for (let productId in cart) {
            for (let unit in cart[productId]) {
                if (cart[productId][unit].selected == true) {
                    count += 1
                }
            }
        }
        return count
    }

    async function removeItemsFromCart() {
        for (let productId in cart) {
            for (let unit in cart[productId]) {
                if (cart[productId][unit].selected) {
                    await cartController.removeItem(parseInt(productId), unit)
                }
            }
        }
        let newCart = await cartController.getCart()
        dispatch(setCart(newCart))
        setShowConfirmDeleteDialog(false)
    }

    let isAllSelected = checkIfAllItemsSelected()
    let isAllUnselected = checkIfAllItemsUnselected()
    let numberOfSelected = countNumberOfSelectedItems()

    function onOrderButtonClicked() {
        setShowCheckoutPage(true)
    }

    function buildMain() {
        let cartEmpty = Object.keys(cart).length == 0
        if (cartEmpty) {
            return <article className={ styles.empty_cart_main }>
                <p> Gi??? h??ng tr???ng </p>
            </article>
        } else {
            return <React.Fragment>
                <Dialog
                    onClose={() => setShowConfirmDeleteDialog(false)}
                    show={ showConfirmDeleteDialog }
                    title="X??c nh???n x??a h??ng kh???i gi???"
                    primaryButtonText="C??"
                    primaryButtonClassName={ styles.primary_delete_button }
                    secondaryButtonText="Kh??ng"
                    secondaryButtonClassName={ styles.secondary_delete_button }
                    onPrimaryButtonClicked={ removeItemsFromCart }
                    onSecondaryButtonClicked={() => setShowConfirmDeleteDialog(false) }
                >
                    <p className={ styles.cart_page_title_text }> B???n c?? mu???n x??a { numberOfSelected } m??n h??ng kh???i gi??? </p>
                </Dialog>
                <div id="cart-item-list">
                    <article className={ styles.select_all }>
                        <aside className={ styles.cart_item_select }>
                            <input checked={ isAllSelected } type="radio" onClick={ onSelectAllClicked } readOnly></input>
                        </aside>
                        <div className={ styles.select_all_text_and_trash_button }>
                            <p className={ styles.select_all_text }> Ch???n t???t c??? </p>
                            {(() => {
                                if (!isAllUnselected) {
                                    return <button className={ styles.remove_item_button } onClick={ onRemoveItemButtonClicked }>
                                        <h6>
                                            <i className="fas fa-trash"></i>
                                        </h6>
                                    </button>
                                }
                            })()}

                        </div>
                    </article>
                    { buildCartItems() }
                </div>

                <footer className="total-and-checkout">
                    <div className="total-text">
                        <p className="total">
                            T???ng c???ng&nbsp;
                        </p>
                        <strong className={ styles.total }>{ total.toNumber().toLocaleString('en') } ??</strong>
                    </div>
                    <button id="checkout-button" className="primary-button" onClick={ onOrderButtonClicked }>
                        <strong className="body-1">
                            ?????t h??ng
                        </strong>
                    </button>
                </footer>
            </React.Fragment>
        }
    }

    return <React.Fragment>
        <PageTransition show={ showCheckoutPage } zIndex={ CheckoutPageZ }>
            <CheckoutPage onOrderSent={ props.onBack } display={ showCheckoutPage } onBack={() => setShowCheckoutPage(false)}></CheckoutPage>
        </PageTransition>
        <section className={ styles.cart_page }>
            <HeaderBar title="Gi??? h??ng" onBack={ props.onBack }></HeaderBar>
            {(() => {
                if (isLoading) {
                    return <Loading/>
                } else {
                    return buildMain()
                }
            })()}
        </section>

    </React.Fragment>
}

export const CartPageWithCart = withCart(CartPage)
export default CartPageWithCart
