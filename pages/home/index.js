import { ASCII } from 'components/ascii'
import { ClientOnly } from 'components/isomorphic'
import { Layout } from 'layouts/default'
import s from './home.module.scss'

export default function Home() {
  return (
    <Layout
      theme="light"
      seo={{
        title: 'Aniso',
        description:
          'Aniso is an open-source ASCII tool built by Studio Freight to generate and customize character-based imagery.',
      }}
    >
      <section className={s.hero}>
        <ClientOnly>
          <ASCII />
        </ClientOnly>
      </section>
    </Layout>
  )
}
