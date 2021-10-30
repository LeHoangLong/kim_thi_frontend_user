import { ComponentType, useEffect, useState } from "react";
import Symbols from "../../config/Symbols";
import myContainer from "../../container";
import { CartController } from "../../controllers/CartController";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks";
import { EStatus } from "../../models/StatusModel";
import { setCart, setCartOperationStatus } from "../../reducers/cartReducer";
import { addProduct, setProductOperationStatus } from "../../reducers/productReducer";
import { IProductRepositories } from "../../repositories/IProductRepositories";

export function withCart<T>(Component: ComponentType<T>) {
    return (hocProps: T) => {
        let cart = useAppSelector(state => state.cart.cart)
        let productDetails = useAppSelector(state => state.products.productDetails)
        let productOperationStatus = useAppSelector(state => state.products.operationStatus)
        let cartOperationStatus = useAppSelector(state => state.cart.operationStatus)
        let productRepository = myContainer.get<IProductRepositories>(Symbols.PRODUCT_REPOSITORY)
        let dispatch = useAppDispatch()
        let cartController = myContainer.get<CartController>(Symbols.CART_CONTROLLER)

        useEffect(() => {
            async function fetchProductDetails() {
                dispatch(setProductOperationStatus({
                    status: EStatus.IN_PROGRESS,
                }))
                try {
                    for (let productId in cart) {
                        if (!(productId in productDetails)) {
                            // fetch product id
                            let product = await productRepository.fetchProductDetailById(parseInt(productId))
                            dispatch(addProduct(product))
                        }
                    }

                    dispatch(setProductOperationStatus({
                        status: EStatus.SUCCESS,
                    }))
                } finally {
                    dispatch(setProductOperationStatus({
                        status: EStatus.IDLE,
                    }))
                }
            }

            if (productOperationStatus.status === EStatus.INIT ||
                (productOperationStatus.status === EStatus.IN_PROGRESS && !isAllCartItemDetailsFetched())
            ) {
                fetchProductDetails()
            }
        }, [cart, productOperationStatus])

        function isAllCartItemDetailsFetched() {
            for (let productId in cart) {
                if (!(productId in productDetails)) {
                    return false
                }
            }
            return true
        }

        useEffect(() => {
            async function fetchCart() {
                dispatch(setCartOperationStatus({
                    status: EStatus.IN_PROGRESS
                }))
                try {
                    let cart = await cartController.getCart()
                    dispatch(setCart(cart))
                    dispatch(setCartOperationStatus({
                        status: EStatus.SUCCESS
                    }))
                } finally {
                    dispatch(setCartOperationStatus({
                        status: EStatus.IDLE
                    }))
                }
            }

            if (cartOperationStatus.status === EStatus.INIT) {
                fetchCart()
            }
        }, [cartOperationStatus])

        return <Component
            {...hocProps as T}
        >
        </Component>
    }
}
