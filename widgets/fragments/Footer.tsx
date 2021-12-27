import styles from './Footer.module.scss'
import Link from 'next/link'

export const Footer = () => {
    return <footer className={ styles.footer }>
        <article>
            <header>
                <h3>Liên hệ</h3>
            </header>
            <div className={ styles.row }>
                <strong>Số điện thoại:&nbsp;</strong>
                <p>01234558876</p>
            </div>
            <div className={ styles.row }>
                <strong>Email:&nbsp;</strong>
                <p>lecong364@gmail.com</p>
            </div>
        </article>
        <div className={ styles.social_buttons }>
            <Link href="https://zalo.me/+6590551105">
                <img src="/public/images/zalo.png" className={ styles.social_button }/>
            </Link>
        </div>
    </footer>
}
