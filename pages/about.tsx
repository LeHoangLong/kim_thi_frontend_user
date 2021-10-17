import { NavigationBar } from '../widgets/fragments/NavigationBar'
import { Footer } from '../widgets/fragments/Footer'
import styles from './about.module.scss'

const Page = () => {
    return <section>
        <header>
            <NavigationBar></NavigationBar>
        </header>
        <article className={ styles.banner }>
            <div className={ styles.overlay } ></div>
            <h1>Đại lí phân phối bánh kẹo chuyên nghiệp, uy tín</h1>
        </article>

        <section className={ styles.main_section }>
            <article className={ styles.delivery }>
                <img src="/public/images/delivery.jpg"/>
                <p className={ styles.text }>Giao hàng đúng lúc, kịp thời</p>
            </article>

            <article className={ styles.food_certificate }>
                <p className={ styles.text }>Bảo đảm an toàn vệ sinh thực phẩm</p>
                <img src="/public/images/certificate.jpg"/>
            </article>

            <article className={ styles.map }>
                <iframe
                    height="500px"
                    style={{border:0}}
                    loading="lazy"
                    allowFullScreen
                    src="https://www.google.com/maps/embed/v1/place?q=86%20gia%20ph%C3%BA&key=AIzaSyCHXhGcaNM71NNmc8x3cu8wPj32F_haPKk"
                />
                <p className={ styles.text }>
                    Địa chỉ: 86 Gia Phú phường 1 quận 6
                </p>
            </article>
            <Footer/>
        </section>
    </section>
}

export default Page
