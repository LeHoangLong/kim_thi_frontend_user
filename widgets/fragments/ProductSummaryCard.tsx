import { ProductSummary } from "../../models/ProductSummary"
import React from 'react';
import styles from './ProductSummaryCard.module.scss'

export interface ProductSummaryCardProps {
    product: ProductSummary,
    children?: React.ReactNode[],
}

export const ProductSummaryCard = React.forwardRef<HTMLElement, ProductSummaryCardProps>((props, ref) => {
    return <article className="product-summary-card" ref={ref}>
        <figure>
            <img src={`/${props.product.avatar.path}`}/>
        </figure>
        <div className="content">
            <div className={ styles.title }>
                <strong> { props.product.name } </strong>
            </div>
            <div>
                <p>
                    { props.product.defaultPrice.defaultPrice } đ / { props.product.defaultPrice.unit }
                </p>
            </div>
        </div>
    </article>
})
