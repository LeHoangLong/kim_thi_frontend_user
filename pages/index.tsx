import React, { useState, useEffect } from 'react'
import { ProductSummary } from '../models/ProductSummary';
import Link from 'next/link'
import { SearchBar } from '../widgets/components/SearchBar';
import { ProductSummaries } from '../widgets/fragments/ProductSummaries';
import { ScrollingPageIndex } from '../widgets/components/ScrollingPageIndex'
import { useRouter } from 'next/router'
import { NavigationBar } from '../widgets/fragments/NavigationBar';
import { IProductRepositories } from '../repositories/IProductRepositories';
import Symbols from '../config/Symbols';
import { Pagination } from '../config/Pagination';
import styles from './index.module.scss';
import { GetServerSideProps } from 'next'
import container from '../container'
import { withMessage } from '../widgets/hocs/withMessage';
import { CartButton } from '../widgets/fragments/CartButton';
import { withCartPage } from '../widgets/hocs/withCartPage';
import { ProductCategoryModel } from '../models/ProductCategoryModel';

interface ProductSummaryPageProps {
    productSummaries: ProductSummary[],
    categories: ProductCategoryModel[],
    numberOfPages: number,
    showCartPage(): void,
}

const ProductSummaryPage = (props: ProductSummaryPageProps) => {
    let [searchPhrase, setSearhPhrase] = useState('')
    const router = useRouter()
    var { search, category } = router.query
    let pageStr = router.query.page

    let page : number
    if (typeof(pageStr) === 'string') {
        page = parseInt(pageStr)
        if (isNaN(page)) {
            page = 0
        }
    } else {
        page = 0
    }

    if (page === undefined) {
        page = 0
    }

    if (search === undefined) {
        search = ''
    }

    useEffect(() => {
        setSearhPhrase(search as string)
    }, [ search ])

    function displayCategories() {
        let ret: React.ReactNode[] = [];
        let selectedIndex = props.categories.findIndex(e => e.category == (category as string) )
        for (var i = 0; i < props.categories.length; i++) {
            let isSelected = selectedIndex === i

            if ( isSelected ) {
                ret.push(
                    <Link key={ props.categories[i].category } href={`/?search=${ search }&category=&page=${ page }`}>
                        <div className={ styles.selected_category }>
                            <strong>
                                { props.categories[i].category }
                            </strong>
                        </div>
                    </Link>
                )
            } else {
                ret.push(
                    <Link key={ props.categories[i].category } href={`/?search=${ search }&category=${ encodeURIComponent(props.categories[i].category) }&page=${ page }`}>
                        <div className={ styles.category }>
                            <p>
                                { props.categories[i].category }
                            </p>
                        </div>
                    </Link>
                )
            }
        }
        return ret
    }

    function onSelectPage(pageNumber: number) {
        window.location.href = `/?search=${ search }&category=${ encodeURIComponent((category?? '').toString()) }&page=${ pageNumber - 1 }`
    }

    function onSearchButtonClicked() {
        window.location.href = `/?search=${ searchPhrase }&category=${ encodeURIComponent((category?? '').toString()) }&page=${ page }`
    }

    return <React.Fragment>
        <header>
            <NavigationBar></NavigationBar>
        </header>
        <main>
            <CartButton onClick={ props.showCartPage }></CartButton>
            <section>
                <div className={ styles.search_bar }>
                    <SearchBar onSearchButtonClicked={ onSearchButtonClicked } phrase={ searchPhrase } onChange={ setSearhPhrase }></SearchBar>
                </div>
                <div className={ styles.banner }>
                    <nav className={ styles.categories }>
                        { displayCategories() }
                    </nav>

                    <div className={ styles.images }>
                        <div className={ styles.slide_show }>
                            <img src="/public/logos/shop.png"/>
                            <img src="/public/logos/shop_2.png"/>
                        </div>
                        <div className={ styles.side_images }>
                            <img src="/public/logos/shop.png" className={ styles.top_side_image }/>
                            <img src="/public/logos/shop.png" className={ styles.bottom_side_image }/>
                        </div>
                    </div>
                </div>

                <div className={ styles.main_area }>
                    <div>
                        <ProductSummaries products={ props.productSummaries }></ProductSummaries>
                    </div>

                    <footer className={`${styles.page_numbering}  h5`}>
                        <ScrollingPageIndex indexElementClassName={ styles.index } onSelect={ onSelectPage } currentIndex={ page + 1} min={ 1 } max={ props.numberOfPages + 1 }></ScrollingPageIndex>
                    </footer>
                </div>
            </section>

            <section>
            </section>
        </main>

    </React.Fragment>
}

const ProductSummaryPageWithMessage = withMessage(ProductSummaryPage)
const ProductSummaryPageWithMessageWithCartPage = withCartPage(ProductSummaryPageWithMessage)
export default ProductSummaryPageWithMessageWithCartPage

export const getServerSideProps : GetServerSideProps = async (context) => {
    let productRepositories = container.get<IProductRepositories>(Symbols.PRODUCT_REPOSITORY)
    let pageNumber: number
    if (typeof(context.query.page) === 'string') {
        pageNumber = parseInt(context.query.page)
    } else {
        pageNumber = 0
    }
    let queryCategories = context.query.category as string | string[] | undefined
    if (queryCategories === undefined) {
        queryCategories = []
    } else if (typeof(queryCategories) === 'string') {
        queryCategories = [queryCategories]
    }

    let productSummaries = await productRepositories.getProductSummaries({
        categories: queryCategories,
        limit: Pagination.DEFAULT_PAGE_SIZE,
        offset: pageNumber * Pagination.DEFAULT_PAGE_SIZE
    })

    let categories = await productRepositories.getCategories({
        limit: 10,
        offset: 0
    })

    let numberOfProducts = await productRepositories.getNumberOfProducts()

    let numberOfPages = Math.ceil(numberOfProducts / Pagination.DEFAULT_PAGE_SIZE)
    return {
        props: {
            productSummaries,
            categories,
            numberOfProducts,
            numberOfPages,
        }, // will be passed to the page component as props
    }
}
