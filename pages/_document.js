/* eslint-disable @next/next/no-document-import-in-page */
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className={process.env.NODE_ENV === 'development' && 'dev'}>
      <Head>
        <meta charSet="UTF-8" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
