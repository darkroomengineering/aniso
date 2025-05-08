/* eslint-disable @next/next/no-document-import-in-page */
import { isDev } from 'env'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className={isDev ? 'dev' : null}>
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
