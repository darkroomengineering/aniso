import { CustomHead } from 'components/custom-head'

export function Layout({
  seo = {
    title: 'Aniso - ASCII Tool',
    description:
      'Aniso is an open-source ascii tool built by studio freight to generate and customize character-based imagery.',
    image: '',
    keywords: ['ascii', 'renderer', 'webgl', 'react-three-fiber'],
  },
  children,
  theme = 'light',
}) {
  return (
    <>
      <CustomHead {...seo} />
      <div className={`theme-${theme}`}>{children}</div>
    </>
  )
}
