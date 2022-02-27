import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../config/GoogleAnalytics'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ GOOGLE_ANALYTICS_TRACKING_ID }`}></script>
            <script
                dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${ GOOGLE_ANALYTICS_TRACKING_ID }', { page_path: window.location.pathname });
                `,
                }}
            />
            <link rel="icon" href="/public/logos/logo.png"></link>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossOrigin="anonymous"/>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument