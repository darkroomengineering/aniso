import { CustomHead } from 'components/custom-head'

export function Layout({
  seo = {
    title: 'Aniso - ASCII Tool',
    description:
      'An open-source ASCII tool built by Studio Freight to generate and customize character-based imagery.',
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
