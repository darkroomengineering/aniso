import { RealViewport } from 'components/real-viewport'
import dynamic from 'next/dynamic'
import 'resize-observer-polyfill'
import 'styles/global.scss'

const Stats = dynamic(
  () => import('components/stats').then(({ Stats }) => Stats),
  { ssr: false }
)

function MyApp({ Component, pageProps }) {
  return (
    <>
      <RealViewport />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
