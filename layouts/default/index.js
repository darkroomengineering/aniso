import { useIsTouchDevice } from '@studio-freight/hamo'
import { CustomHead } from 'components/custom-head'

export function Layout({
  seo = {
    title: 'ASCII Tool',
    description: 'ASCII Texture renderer',
    image: '',
    keywords: ['ascii', 'renderer', 'webgl', 'react-three-fiber'],
  },
  children,
  theme = 'light',
}) {
  const isTouchDevice = useIsTouchDevice()
  return (
    <>
      <CustomHead {...seo} />
      <div className={`theme-${theme}`}>{children}</div>
    </>
  )
}
