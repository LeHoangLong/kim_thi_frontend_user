import React, { ComponentType, useEffect, useState } from "react";
import { ConditionalRendering } from "../components/ConditionalRendering";
import { PageTransition } from "../components/PageTransition";
import { CartPage } from "../fragments/CartPage";

export function withCartPage<T>(Component: ComponentType<T>) {
    return (hocProps: Omit<T, "showCartPage">) => {

        let [showCartPage, setShowCartPage] = useState(false)
        let [renderCartPage, setRenderCartPage] = useState(false)
        let [displayChild, setDisplayChild] = useState(true)

        function onShowCartPage() {
            setShowCartPage(true)
            setRenderCartPage(true)
        }

        function onCartPageBackClicked() {
            setShowCartPage(false)
        }

        useEffect(() => {
            if (showCartPage) {
                let timeout = setTimeout(() => {
                    setDisplayChild(false)
                }, 1000)
                return () => clearTimeout(timeout) 
            } else {
                setDisplayChild(true)
            }
        }, [showCartPage])

        return <React.Fragment>
            <PageTransition show={ showCartPage } zIndex={ 1000 }>
                <ConditionalRendering display={ renderCartPage }>
                    <CartPage onBack={ onCartPageBackClicked }></CartPage>
                </ConditionalRendering>
            </PageTransition>
            <div style={{ display: displayChild? 'block' : 'none' }}>
                <Component
                    {...hocProps as T}
                    showCartPage={ onShowCartPage }
                    >
                </Component>
            </div>
        </React.Fragment>
    }
}