import styles from './NavigationBar.module.scss'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const NavigationBar = () => {
    let [selectedMenu, setSelectedMenu] = useState('/')
    let [showExpandedMenu, setShowExpandedMenu] = useState(false)

    useEffect(() => {
        let hrefSplit = document.location.href.split('/')
        let href = '/' + hrefSplit[hrefSplit.length - 1]
        if (href != '/about' && href != '/contact') {
            href = '/'
        }
        setSelectedMenu(href)
    }, [])

    function menuButtonClicked() {
        setShowExpandedMenu(!showExpandedMenu)
    }

    return (
        <div className={ styles.navigation_bar_container }>
            <Link passHref={true} href="/">
                <a>
                    <img alt="logo" className={ styles.logo } src="/public/logos/logo.png"/>
                </a>
            </Link>

            <nav className={ styles.navigation_bar }>
                <div className={ `${selectedMenu == '/'? styles.selected : '' } ${styles.nav_link}` }>
                    <Link passHref={true} href="/">
                        <a>
                            <h4>
                                Trang chủ
                            </h4>
                        </a>
                    </Link>
                </div>
                <div className={ `${selectedMenu == '/about'? styles.selected : '' } ${styles.nav_link}` }>
                    <Link passHref={true} href="/about">
                        <a>
                            <h4>
                                Giới thiệu
                            </h4>
                        </a>
                    </Link>
                </div>
            </nav>

            <div className={  styles.hidden_menu_container }>
                <button className={ styles.show_menu_button } onClick={ menuButtonClicked }>
                    <h4>
                        <i className="fas fa-bars"></i>
                    </h4>
                </button>

                <nav className={ showExpandedMenu? styles.expanded_menu : styles.expanded_menu_hidden }>
                    <div className={ `${selectedMenu == '/'? styles.selected : '' } ${styles.nav_link}` }>
                        <Link passHref={true} href="/">
                            <h4>
                                Trang chủ
                            </h4>
                        </Link>
                    </div>
                    <div className={ `${selectedMenu == '/about'? styles.selected : '' } ${styles.nav_link}` }>
                        <Link passHref={true} href="/about">
                            <h4>
                                Giới thiệu
                            </h4>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    )
}
