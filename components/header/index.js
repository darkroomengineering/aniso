import cn from 'clsx'
import { Link } from 'components/link'
import { Navigation } from 'components/navigation'
import { useStore } from 'lib/store'
import s from './header.module.scss'

export const Header = () => {
  const [navIsOpen, setNavIsOpen] = useStore(
    (state) => [state.navIsOpen, state.setNavIsOpen]
  )

  return (
    <header className={s.header}>
      <Navigation />
      <div className={cn('layout-block', s.head)}>
        <button
          type="button"
          onClick={() => {
            setNavIsOpen(!navIsOpen)
          }}
        >
          menu
        </button>
        <div>
          <Link href="/">home</Link>/<Link href="/contact">contact</Link>
        </div>
      </div>
    </header>
  )
}
