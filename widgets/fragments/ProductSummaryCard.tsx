import { ProductSummary } from "../../models/ProductSummary"
import React from 'react';
import styles from './ProductSummaryCard.module.scss'

export interface ProductSummaryCardProps {
    product: ProductSummary,
    children?: React.ReactNode[],
}

export const ProductSummaryCard = React.forwardRef<HTMLElement, ProductSummaryCardProps>((props, ref) => {
    return <article className={ styles.product_summary_card } ref={ref}>
        <figure>
            <img src={`/${props.product.avatar.path}`}/>
        </figure>
        <div className={ styles.content }>
            <div className={ styles.title }>
                <strong> { props.product.name } </strong>
            </div>
            <div>
                <p className={ styles.price }>
                    { props.product.defaultPrice.defaultPrice } đ / { props.product.defaultPrice.unit }
                </p>
            </div>
        </div>
    </article>
})
