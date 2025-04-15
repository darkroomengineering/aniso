import { ASCII } from 'components/ascii'
import { ClientOnly } from 'components/isomorphic'
import { useMediaQuery } from 'hamo'
import { Layout } from 'layouts/default'
// import dynamic from 'next/dynamic'
import s from './home.module.scss'

// const ASCII = dynamic(
//   () => import('components/ascii').then((mod) => mod.ASCII),
//   { ssr: false }
// )

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 800px)')
  return (
    <Layout theme="light">
      {isMobile === true ? (
        <section className={s.disclaimer}>
          <p className={s.text}>
            Please visit this page on a desktop computer, we promise we're
            working on a mobile version
          </p>
        </section>
      ) : (
        <section className={s.hero}>
          <ClientOnly>
            <ASCII />
          </ClientOnly>
        </section>
      )}
    </Layout>
  )
}
