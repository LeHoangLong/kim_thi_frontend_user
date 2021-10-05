import { ProductSummary } from "../../models/ProductSummary"
import React from 'react'
import Link from 'next/link'
import { ProductSummaryCard } from "./ProductSummaryCard"

export interface ProductSummariesProps {
    products: ProductSummary[]
}

export const ProductSummaries = (props: ProductSummariesProps) => {
    let ret : React.ReactNode[] = []

    for (let i = 0; i < props.products.length; i++) {
        ret.push(
            <Link key={ props.products[i].id } href={`/products/${ props.products[i].id }`} passHref>
                <a>
                    <ProductSummaryCard product={ props.products[i] }></ProductSummaryCard>
                </a>
            </Link>
        )
    }

    return <nav className="product-summaries">
        { ret }
    </nav>
}
