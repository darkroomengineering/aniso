import cn from 'clsx'
import { Link } from 'components/link'
import { useStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import s from './navigation.module.scss'

export const Navigation = () => {
  const [navIsOpen, setNavIsOpen] = useStore((state) => [
    state.navIsOpen,
    state.setNavIsOpen,
  ])

  const router = useRouter()

  useLayoutEffect(() => {
    const onRouteChange = () => {
      setNavIsOpen(false)
    }

    router.events.on('routeChangeStart', onRouteChange)

    return () => {
      router.events.off('routeChangeStart', onRouteChange)
    }
  }, [])

  return (
    <div className={cn(s.navigation, !navIsOpen && s.closed)}>
      <Link href="/">home</Link>
      <Link href="/contact">contact</Link>
    </div>
  )
}
