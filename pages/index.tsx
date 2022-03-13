import React, { useState, useEffect, useRef } from 'react'
import { ProductSummary } from '../models/ProductSummary';
import { SearchBar } from '../widgets/components/SearchBar';
import { ProductSummaries } from '../widgets/fragments/ProductSummaries';
import { ScrollingPageIndex } from '../widgets/components/ScrollingPageIndex'
import { useRouter } from 'next/router'
import { NavigationBar } from '../widgets/fragments/NavigationBar';
import { GetProductCountArgs, IProductRepositories } from '../repositories/IProductRepositories';
import Symbols from '../config/Symbols';
import { Pagination } from '../config/Pagination';
import styles from './index.module.scss';
import { GetServerSideProps } from 'next'
import container from '../container'
import { withMessage } from '../widgets/hocs/withMessage';
import { CartButton } from '../widgets/fragments/CartButton';
import { withCartPage } from '../widgets/hocs/withCartPage';
import { ProductCategoryModel } from '../models/ProductCategoryModel';
import { Carousell } from '../widgets/components/Carousell';
import { Categories } from '../widgets/fragments/Categories';
import Head from 'next/head'

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


    function onSelectPage(pageNumber: number) {
        window.location.href = `/?search=${ search }&category=${ encodeURIComponent((category?? '').toString()) }&page=${ pageNumber - 1 }`
    }

    function onSearchButtonClicked() {
        window.location.href = `/?search=${ searchPhrase }&category=${ encodeURIComponent((category?? '').toString()) }&page=${ page }`
    }

    let [carousellWidth, setCarousellWidth] = useState(500)

    useEffect(() => {
        function resizeHandler() {
            if (window.innerWidth < 500) {
                setCarousellWidth(window.screen.width)
            } else {
                setCarousellWidth(500)
            }
        }

        resizeHandler()
        window.addEventListener('resize', resizeHandler)

        return () => window.removeEventListener('resize', resizeHandler)
    }, [])

    return <React.Fragment>
        <Head>
            <title>Trang chú</title>
        </Head>
        <canvas style={{ display: 'none'}}/>
        <header>
            <NavigationBar></NavigationBar>
        </header>
        <main>
            <CartButton onClick={ props.showCartPage }></CartButton>
            <section className={ styles.main_page }>
                <div className={ styles.search_bar }>
                    <SearchBar onSearchButtonClicked={ onSearchButtonClicked } phrase={ searchPhrase } onChange={ setSearhPhrase }></SearchBar>
                </div>
                {
                // <div className={ styles.banner }>
                //     <div className={ styles.images }>
                //         <div className={ styles.carousell_container }>
                //             <Carousell 
                //                 images={[
                //                     "/public/logos/shop_orig.webp",
                //                     "/public/logos/shop_2.webp"
                //                 ]} 
                //                 width={ carousellWidth }
                //             />
                //         </div>
                //     </div>
                // </div>
                }

                <div className={ styles.categories_container }>
                    <Categories
                        search={search as string}
                        category={category as string}
                        categories={ props.categories }
                        minCategoryWidth={120}
                        numberOfCategoriesPerRow={5}
                    />
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

    let search: string = ''
    if (typeof(context.query.search) === 'string') {
        search = context.query.search
    }

    let productSummaries = await productRepositories.getProductSummaries({
        categories: queryCategories,
        limit: Pagination.DEFAULT_PAGE_SIZE,
        offset: pageNumber * Pagination.DEFAULT_PAGE_SIZE,
        productSearch: search,
    })

    let categories = await productRepositories.getCategories({
        limit: 10,
        offset: 0
    })

    let arg : GetProductCountArgs = {
        categories: queryCategories,
        productSearch: search,
    }
    let numberOfProducts = await productRepositories.getNumberOfProducts(arg)

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
