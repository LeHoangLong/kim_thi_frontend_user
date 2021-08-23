import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link rel="stylesheet" href="/public/stylesheets/normalize.css"/>
        <link rel="stylesheet" href="/public/stylesheets/main.css"/>      
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/> 
      </Head>

      <header>
      </header>
      <main>
          <section>
              <article>
                  <div class="slide-show">
                      <img src="/public/logos/shop.png"/>
                      <img src="/public/logos/shop_2.png"/>
                  </div>
                  
                      <h4 class="category-title">Danh mục</h4>
                  <nav class="categories">
                  </nav>

                  <div>
                  </div>

                  <footer class="page-numbering">
                  </footer>
              </article>
          </section>

          <section>
          </section>
      </main>
    </React.Fragment>
  )
}
