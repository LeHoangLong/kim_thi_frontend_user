import { ProductDetailModel } from '../../models/ProductDetailModel'
import { IProductRepositories } from '../../repositories/IProductRepositories'
import Symbols from '../../config/Symbols';
import React from 'react'
import { NavigationBar } from '../../widgets/fragments/NavigationBar'
import { ProductPrice } from '../../models/ProductPrice'
import { useEffect, useState } from 'react'
import styles from './ProductDetailPage.module.scss'
import { GetServerSideProps } from 'next'
import { useAppDispatch } from '../../hooks/Hooks'
import { Message } from '../../widgets/components/Message'
import container from '../../container'
import { CartController } from '../../controllers/CartController'
import { CartButton } from '../../widgets/fragments/CartButton'
import { setCart } from '../../reducers/cartReducer'
import { addProduct } from '../../reducers/productReducer'
import { Pagination } from '../../config/Pagination'
import { SearchBar } from '../../widgets/components/SearchBar';
import { ProductSummaries } from '../../widgets/fragments/ProductSummaries';
import { ProductSummary } from '../../models/ProductSummary'
import { withCartPage } from '../../widgets/hocs/withCartPage';
import { Tooltip } from '../../widgets/components/Tooltip';
import Link from 'next/link'
import Head from 'next/head'
import { sendGoogleAnalyticsEvent } from '../../services/GoogleAnalytics';
import Decimal from 'decimal.js';
import { NotFound } from '../../exceptions/NotFound';
import { ImageModel } from '../../models/ImageModel';

export interface ProductDetailPageProps {
	product: ProductDetailModel,
    relatedProductSummaries: ProductSummary[]
    showCartPage(): void
}

export const ProductDetailPage = (props: ProductDetailPageProps) => {
    let [prices, setPrices] = useState<ProductPrice[]>([])
    let [displayQuantityAndUnitSelection, setDisplayQuantityAndUnitSelection] = useState(false)
    let [isBuyNowButtonClicked, setIsBuyNowButtonClicked] = useState(false)
    let [quantity, setQuantity] = useState('1')
    let [unit, setUnit] = useState("")
    let [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false)
    let dispatch = useAppDispatch();
    let cartController = container.get<CartController>(Symbols.CART_CONTROLLER)
    let [searchPhrase, setSearhPhrase] = useState('')
    let [images, setImages] = useState<ImageModel[]>([])
    let [selectedImageIndex, setSelectedImageIndex] = useState(0)

    useEffect(() => {
        dispatch(addProduct(props.product))
    }, [])

    useEffect(() => {
        if (props.product.defaultPrice != null) {
            let prices = [
                props.product.defaultPrice,
                ...props.product.alternativePrices,
            ]
            setPrices(prices)
            setUnit(props.product.defaultPrice.unit)
        } else {
            setPrices([...props.product.alternativePrices])
            setUnit('kg')
        }
        let images = [
            props.product.avatar,
            ...props.product.images,
        ]
        setImages(images)
        setSelectedImageIndex(0)
    }, [props.product])


	function displayUnits() {
        let ret : React.ReactNode[] = []
        if (prices.length > 0) {
            for (let i = 0; i < prices.length; i++) {
                ret.push(
                    <option className="body-text-1" key={ i } value={ prices[i].unit }> { prices[i].unit } </option>
                )
            }
        } else {
            ret.push(
                <option className="body-text-1" key={ 0 } value={ 'kg' }> { 'kg' } </option>
            )
        }
            

        return ret
	}

    function displayPriceLevels(price: ProductPrice) {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < price.priceLevels.length; i++) {
            ret.push(
                <React.Fragment key={ i } >
                    <p className={ styles.price }> { price.priceLevels[i].price.toLocaleString('en') }&nbsp;&#8363; /  { price.unit } </p>
                    <p> &ge; { price.priceLevels[i].minQuantity } { price.unit } </p>
                </React.Fragment>
            )
        }
        return ret
    }

    function displayPrices() {
        let ret: React.ReactNode[] = []
        for (let i = 0; i < prices.length; i++) {
            ret.push(
                <React.Fragment key={i}>
                    <p className={ styles.defaultPrice + ' ' + styles.price }> { prices[i].defaultPrice.toLocaleString('en') }&nbsp;&#8363; / { prices[i].unit }</p>
                    <p className={ styles.defaultPrice }>  Mặc định </p>
                    { displayPriceLevels( prices[i] ) }
                </React.Fragment>
            )
        }
        return ret
    }

    function displayRetailPrice() {
        if (prices.length > 0) {
            return (
                <div className={ styles.main }>
                    <strong>
                        <h5 className={ styles.priceTableTitle }>Giá</h5>
                    </strong>
                    <strong>
                        <h5 className={ styles.priceTableTitle }>
                            Số lượng tối thiểu
                        </h5>
                    </strong>
                    { displayPrices() }
                </div>
            )
        }
    }

    function displayWholesalePrice() {
        if (props.product.wholesalePrices.length > 0) {
            let icon = <div className={ styles.help_icon }>
                <i className="fas fa-question-circle"></i>
            </div>
            let priceValues : React.ReactNode[] = []
            for (let i = 0; i < props.product.wholesalePrices.length; i++) {
                priceValues.push(
                    <p key={props.product.wholesalePrices[i]} className={ styles.wholesalePriceValue }>{ props.product.wholesalePrices[i] }</p>
                )
            }
            return (
                <article className={ styles.wholesalePrice }>
                    <div className={ styles.wholesalePriceTitleRow }>
                        <strong>
                            <h5 className={ styles.wholesalePriceTitle }>Giá bán sỉ</h5>
                        </strong>
                        <Tooltip icon={icon}>
                            <div className={ styles.tooltip }>
                                <p>Vui lòng</p> 
                                <Link href='/about'><p className={ styles.link }>liên hệ</p></Link> 
                                <p>với chúng tôi để được hưởng giá ưu đãi nhất</p>
                            </div>
                        </Tooltip>
                    </div>
                    
                    { priceValues }
                </article>
            )
        }
    }

    function displayDescription() {
        if (props.product.description.length > 0) {
            return (
                <section className={ styles.product_description_section }>
                    <strong>
                        <h4 className={ styles.description_title }>Miêu tả sản phẩm</h4>
                    </strong>
                    <p>
                        { props.product.description }
                    </p>
                </section>
            )
        }
    }

    function onQuantityChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setQuantity(event.target.value)
    }

    function changeQuantity(value: string, step: number) {
        try {
            let valueDec = new Decimal(value)
            if (!valueDec.isNaN()) {
                valueDec = valueDec.add(step)
                if (valueDec.lessThan(0)) {
                    valueDec = new Decimal(0)
                }
                setQuantity(valueDec.toString())
            }
        } catch (exception) {

        }
    }

    async function addToCartButtonClicked() {
        sendGoogleAnalyticsEvent({ eventName: 'add_to_cart', action: 'click', category: 'button', label: 'add_to_cart', value: 0})
        setIsBuyNowButtonClicked(false)
        setDisplayQuantityAndUnitSelection(true)
    }

    function buyNowButtonClicked() {
        sendGoogleAnalyticsEvent({ eventName: 'add_to_cart', action: 'click', category: 'button', label: 'buy_now', value: 0})
        setIsBuyNowButtonClicked(true)
        setDisplayQuantityAndUnitSelection(true)
    }

    async function confirmButtonClicked() {
        let quantityDec = new Decimal(quantity)
        if (!quantityDec.isNaN()) {
            await cartController.addItemQuantity(
                props.product.id,
                unit,
                quantityDec
            )
            let cart = await cartController.getCart()
            dispatch(setCart(cart))

            setDisplayQuantityAndUnitSelection(false)
            setShowAddedToCartMessage(true)
            setTimeout(() => {
                setShowAddedToCartMessage(false)
            }, 1500)

            if (isBuyNowButtonClicked) {
                props.showCartPage()
            }
        }
    }

    function onSearchButtonClicked() {
        window.location.href = `/?search=${ searchPhrase }&page=${ 0 }`
    }

    let quantityAndUnitSelection = 'quantity-and-unit-selection '
    if (!displayQuantityAndUnitSelection) {
        quantityAndUnitSelection += 'quantity-and-unit-selection-hidden '
    }

    function displaySideImages() : React.ReactNode[] {
        let ret: React.ReactNode[] = []
        if (images.length > 1) {
            for (let i = 0; i < images.length; i++) {
                let className = styles.side_image_container
                if (i === selectedImageIndex) {
                    className = styles.selected_side_image_container
                }

                ret.push(
                    <li key={ images[i].id } className={ className } onClick={() => setSelectedImageIndex(i)}>
                        <img className={ styles.side_image } src={ `${ images[i].path }` }/>
                    </li>
                )
            }

        }
        return ret
    }

	return (
		<React.Fragment>
            <Head>
                <title>{ props.product.name }</title>
            </Head>
            <Message message="Đã thêm vào giỏ" show={ showAddedToCartMessage } className={ styles.mesage }></Message>
	        <header>
	            <NavigationBar></NavigationBar>
	        </header>
		    <main>
                <CartButton onClick={ props.showCartPage }></CartButton>
		        <section id="product-detail-page">
		            <section id="quantity-and-unit-selection" className={ quantityAndUnitSelection }>
		                <div className="background" onClick={() => setDisplayQuantityAndUnitSelection(false)}></div>
		                <form onSubmit={e => {
                           e.preventDefault()
                           confirmButtonClicked()
                        }}>
		                    <div className="input-container">
		                        <label htmlFor="unit">Đơn vị</label>
		                        <div className={ styles.select_unit }>
		                            <select value={unit} onChange={e => setUnit(e.target.value)} id="unit-select" className="input body-text-1">
		                            	{ displayUnits() }
		                            </select>
		                        </div>
		                        <label htmlFor="quantity-input">Số lượng</label>
		                        <div className={ styles.quantity_input }>
                                    <button type="button" className={ styles.change_quantity_button } onClick={() => changeQuantity(quantity, -1)}>
                                        <i id="remove-quantity-button" className="fas fa-minus"></i>
                                    </button>
		                            <input id="quantity-input" type="text" value={ quantity } onChange={ onQuantityChanged }></input>
		                            <button type="button" className={ styles.change_quantity_button } onClick={() => changeQuantity(quantity, 1)}>
		                                <i id="add-quantity-button" className="fas fa-plus"></i>
		                            </button>
		                        </div>
		                    </div>
		                    <button onClick={ confirmButtonClicked } type="button" className="primary-button confirm-button" id="confirm-buy-button">
		                        <strong>
		                            Xác nhận
		                        </strong>
		                    </button>
		                </form>
		            </section>

		            <section className="product-detail">
                        <div className={ styles.images }>
                            <figure>
                                <img className="main-img" src={ `${images[selectedImageIndex]?.path ?? ""}` }/>
                            </figure>

                            <aside>
                                <ol className={ styles.side_images }>
                                    { displaySideImages() }
                                </ol>
                            </aside>
                        </div>
		                <article>
		                    <header>
		                        <h3 className={ styles.product_name }>
		                            { props.product.name }
		                        </h3>
		                    </header>
                            { displayRetailPrice() }
                            { displayWholesalePrice() }
		                </article>
		            </section>

                    { displayDescription() }

		            <section className={ styles.search_related_products_section }>
                        <h4>
                            Sản phẩm khác
                        </h4>

                        <div>
                            <SearchBar className={ styles.search_bar} onSearchButtonClicked={ onSearchButtonClicked } phrase={ searchPhrase } onChange={ setSearhPhrase }></SearchBar>
                            <ProductSummaries products={ props.relatedProductSummaries } singleRow={ true }></ProductSummaries>
                        </div>
		            </section>

		            <section>
		                <div className="add-to-cart-buttons fake">
		                    <button className="primary-button">
		                        <strong>
		                            Thêm vào giỏ
		                        </strong>
		                    </button>
		                </div>
		                <div className="add-to-cart-buttons">
		                    <button className="primary-button" id="add-to-cart-button"  onClick={ addToCartButtonClicked }>
		                        <strong>
		                            Thêm vào giỏ
		                        </strong>
		                    </button>
		                    <button className="secondary-button" id="buy-now-button" onClick={ buyNowButtonClicked }>
		                        <strong>
		                            Yêu cầu báo giá
		                        </strong>
		                    </button>
		                </div>
		            </section>
		        </section>
		    </main>
	    </React.Fragment>
	)
}

const ProductDetailPageWithCartPage = withCartPage(ProductDetailPage)
export default ProductDetailPageWithCartPage

export const getServerSideProps : GetServerSideProps =  async (context) => {
    let productRepositories = container.get<IProductRepositories>(Symbols.PRODUCT_REPOSITORY)

	let idStr = context.query.id
    let id: number = 0
    if (typeof(idStr) === 'string') {
        id = parseInt(idStr)
        if (isNaN(id)) {
            id = 0
        }
    }

    let search: string = ''
    if (typeof(context.query.search) === 'string') {
        search = context.query.search
    }

    let productDetail: ProductDetailModel
    try {
        productDetail = await productRepositories.fetchProductDetailById(id)
    } catch (exception) {
        if (exception instanceof NotFound) {
            // if product is deleted, redirect to home page
            return {
                redirect: {
                  permanent: false,
                  destination: "/"
                }
            }
        } else {
            throw exception
        }
    }

    let categories: string[] = []
    for (let i = 0; i < productDetail.categories.length; i++) {
        categories.push(productDetail.categories[i].category)
    }
    let relatedProductSummaries = await productRepositories.getProductSummaries({
        categories: categories,
        limit: Pagination.DEFAULT_PAGE_SIZE,
        offset: 0,
        productSearch: search,
    })

    let relatedProductSummariesExceptThis = []
    for (let i = 0; i < relatedProductSummaries.length; i++) {
        if (relatedProductSummaries[i].id != id) {
            relatedProductSummariesExceptThis.push(relatedProductSummaries[i])
        }
    }

	return {
		props: {
			product: productDetail,
            relatedProductSummaries: relatedProductSummariesExceptThis,
		}
	}
}
