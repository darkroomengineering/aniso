import cn from 'clsx'
import { useMediaQuery } from 'hamo'
import { useMemo, useState } from 'react'
import s from './grid-debugger.module.scss'

export const GridDebugger = () => {
  const [visible, setVisible] = useState(false)
  const isMobile = useMediaQuery('(max-width: 800px)')

  const columns = useMemo(() => {
    return Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--layout-columns-count'
      )
    )
  }, [isMobile])

  return (
    <div className={s.grid}>
      <button
        type="button"
        onClick={() => {
          setVisible(!visible)
        }}
      >
        🌐
      </button>
      {visible && (
        <div className={cn('layout-grid', s.debugger)}>
          {new Array(columns).fill(0).map((_, index) => (
            <span key={`grid-column-${index}`} />
          ))}
        </div>
      )}
    </div>
  )
}
