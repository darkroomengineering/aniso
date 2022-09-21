/* eslint-disable @next/next/no-document-import-in-page */
import { GTM_ID } from 'lib/analytics'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className={process.env.NODE_ENV === 'development' && 'dev'}>
      <Head>
        <meta charSet="UTF-8" />
      </Head>
      <body>
        {process.env.NODE_ENV !== 'development' && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id='${GTM_ID}'`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
