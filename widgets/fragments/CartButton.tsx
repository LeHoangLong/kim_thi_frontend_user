import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/Hooks'
import { FloatingActionButton } from  '../components/FloatingActionButton'
import styles from './CartButton.module.scss'
import { CartModel } from '../../models/CartModel'
import container from '../../container'
import { CartController } from '../../controllers/CartController'
import { Symbols } from '../../config/Symbols'
import { setCart } from '../../reducers/cartReducer'
import { useAppDispatch } from '../../hooks/Hooks'
import Link from 'next/link'

export interface CartButtonProps {
    onClick() : void
}

export const CartButton = (props: CartButtonProps) => {
    let cart : CartModel = useAppSelector(state => state.cart.cart)
    let cartController = container.get<CartController>(Symbols.CART_CONTROLLER)
    let [totalItemCount, setTotalItemCount] = useState(0)
    let dispatch = useAppDispatch()

    // Number of items (1 per unit)
    // So if a product has 2 kg and 2 bags
    // totalItemCount is 2
    useEffect(() => {
        async function init() {
            setTotalItemCount(await cartController.getTotalItemsCount())
            let cart = await cartController.getCart()
            dispatch(setCart(cart))
        }
        init()
    }, [])

    useEffect(() => {
        async function getCount() {
            setTotalItemCount(await cartController.getTotalItemsCount())
        }
        getCount()
    }, [cart])

    return (
        <Link href="/cart">
            <FloatingActionButton onClick={ props.onClick }>
                <div className={ styles.cart_icon_container }>
                    <p className={ styles.quantity_number }> { totalItemCount } </p>
                    <i className={`fas fa-shopping-cart ${styles.cart_icon}`}></i>
                </div>
            </FloatingActionButton>
        </Link>
    )
}
