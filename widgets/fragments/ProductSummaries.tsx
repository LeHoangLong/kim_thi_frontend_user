import { ProductSummary } from "../../models/ProductSummary"
import React from 'react'
import Link from 'next/link'
import { ProductSummaryCard } from "./ProductSummaryCard"
import styles from './ProductSummaries.module.scss'

export interface ProductSummariesProps {
    products: ProductSummary[],
    singleRow?: boolean,
}

export const ProductSummaries = (props: ProductSummariesProps) => {
    let ret : React.ReactNode[] = []

    for (let i = 0; i < props.products.length; i++) {
        ret.push(
            <div key={ props.products[i].id } className={ styles.card_container }>
                <Link href={`/products/${ props.products[i].id }`} passHref>
                    <a  className={ styles.link }>
                        <ProductSummaryCard product={ props.products[i] }></ProductSummaryCard>
                    </a>
                </Link>
            </div>
        )
    }

    return <nav className={`product-summaries ${ props.singleRow === true ? styles.single_row : '' }`}>
        { ret }
    </nav>
}
