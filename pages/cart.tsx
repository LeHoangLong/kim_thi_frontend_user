import { CartPage } from '../widgets/fragments/CartPage'
import { useEffect } from 'react'
import myContainer from '../container'
import { Symbols } from '../config/Symbols'
import { CartController } from '../controllers/CartController'
import { useAppDispatch } from '../hooks/Hooks'
import { setCart } from '../reducers/cartReducer'

const Page = () => {
    let cartController = myContainer.get<CartController>(Symbols.CART_CONTROLLER)
    let dispatch = useAppDispatch()
    useEffect(() => {
        async function init() {
            let cart = await cartController.getCart()
            dispatch(setCart(cart))
        }
        init()
    }, [])

    function onBack() {
        window.history.back()
    }

    return <CartPage onBack={ onBack }></CartPage>
}

export default Page
