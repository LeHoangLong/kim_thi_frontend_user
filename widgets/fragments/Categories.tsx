import { useRef } from 'react'
import Link from 'next/link'
import { ProductCategoryModel } from '../../models/ProductCategoryModel'
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './Categories.module.scss'

export interface CategoriesProps {
    search: string,
    category: string,
    categories: ProductCategoryModel[],
    minCategoryWidth: number,
    numberOfCategoriesPerRow: number,
}

export const Categories = (props: CategoriesProps) => {
    let containerRef = useRef<HTMLDivElement>(null)

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

            let id=`cat-${props.categories[i].category}`
            if ( isSelected ) {
                ret.push(
                    <Link key={ props.categories[i].category } passHref={true} href={`/?search=${ props.search }&category=&page=${ 0 }`}>
                        <label className={ styles.selected_category } htmlFor={ id }>
                            <input 
                                id={ id }
                                type='checkbox'
                                className={ styles.category_checkbox }
                                checked={true}
                                readOnly={true}
                            />
                            <span>{ props.categories[i].category }</span>
                        </label>
                    </Link>
                )
            } else {
                ret.push(
                    <Link key={ props.categories[i].category } passHref={true} href={`/?search=${ props.search }&category=${ encodeURIComponent(props.categories[i].category) }&page=${ 0 }`}>
                        <label className={ styles.category } htmlFor={ id }>
                            <input 
                                id={ id }
                                type='checkbox'
                                className={styles.category_checkbox}
                                checked={false}
                                readOnly={true}
                            />
                            <span>{ props.categories[i].category }</span>
                        </label>
                    </Link>
                )
            }
        }
        return ret
    }

    if (props.categories.length > 0) {
        return (
            <TreeView
                aria-label="Danh mục"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                <TreeItem 
                    classes={{ 
                        label: styles.category_title,
                        iconContainer: styles.category_title_icon,
                    }} 
                    nodeId="1" label="Danh mục"
                >
                    { displayCategories() }
                </TreeItem>
            </TreeView>
        )
    }
}