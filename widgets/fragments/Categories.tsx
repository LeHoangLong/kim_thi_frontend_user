import { useEffect, useRef, useState } from 'react'
import styles from './Categories.module.scss'
import Link from 'next/link'
import { ProductCategoryModel } from '../../models/ProductCategoryModel'

export interface CategoriesProps {
    search: string,
    category: string,
    categories: ProductCategoryModel[],
    minCategoryWidth: number,
    numberOfCategoriesPerRow: number,
}

export const Categories = (props: CategoriesProps) => {
    let categoriesRef = useRef<HTMLDivElement>(null)
    function leftButtonClickedHandler() {
        categoriesRef.current.scrollBy({
            left: -100,
            behavior: 'smooth',
        })
    }

    function rightButtonClickedHandler() {
        categoriesRef.current.scrollBy({
            left: 100,
            behavior: 'smooth',
        })
    }

    function displayCategories() {
        let ret: React.ReactNode[] = [];
        let selectedIndex = props.categories.findIndex(e => e.category == (props.category as string) )
        for (var i = 0; i < props.categories.length; i++) {
            let isSelected = selectedIndex === i

            if ( isSelected ) {
                ret.push(
                    <Link passHref={true} key={ props.categories[i].category } href={`/?search=${ props.search }&category=&page=${ 0 }`}>
                        <div className={ styles.selected_category }>
                            <strong>
                                { props.categories[i].category }
                            </strong>
                        </div>
                    </Link>
                )
            } else {
                ret.push(
                    <Link passHref={true} key={ props.categories[i].category } href={`/?search=${ props.search }&category=${ encodeURIComponent(props.categories[i].category) }&page=${ 0 }`}>
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

    let containerRef = useRef<HTMLDivElement>(null)
    let [showButton, setShowButton] = useState(false)

    useEffect(() => {
        function onResizeHandler() {
            if (containerRef && containerRef.current) {
                let rect = containerRef.current.getBoundingClientRect()
                if (rect.width < props.minCategoryWidth * props.numberOfCategoriesPerRow) {
                    setShowButton(true)
                } else {
                    setShowButton(false)
                }
            }
        }

        if (containerRef.current) {
            window.addEventListener('resize', onResizeHandler)
            return () => window.removeEventListener('resize', onResizeHandler)
        }

    }, [containerRef, props.numberOfCategoriesPerRow, props.minCategoryWidth])

    if (props.categories.length > 0) {
        return (
            <article className={ styles.categories_container } ref={ containerRef }>
                <h2 className={ styles.categories_title }>Danh mục</h2>
                <div className={ styles.categories_list_container }>
                    {
                        /*
                        (() => {
                            if (props.categories.length > 4) {
                                <button onClick={ leftButtonClickedHandler } className={ styles.left_button } style={{ display: showButton? 'block' : 'none' }}>
                                    <i className="fas fa-angle-left"></i>
                                </button>
                            }
                        })()
                        */
                    }
                    <nav ref={ categoriesRef } className={ styles.categories } style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${props.minCategoryWidth}px, 1fr))` }}>
                        { displayCategories() }
                    </nav>
                    {
                        /*
                        (() => {
                            if (props.categories.length > 4) {
                                <button onClick={ rightButtonClickedHandler } className={ styles.right_button } style={{ display: showButton? 'block' : 'none' }}>
                                    <i className="fas fa-angle-right"></i>
                                </button>
                            }
                        })()
                        */
                    }
                </div>
            </article>
        )
    }
}