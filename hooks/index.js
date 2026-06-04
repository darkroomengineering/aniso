import {
  useEffect,
  useLayoutEffect as useReactLayoutEffect,
  useState,
} from 'react'

// SSR-safe layout effect: use the real one in the browser, fall back to
// useEffect on the server to avoid React's useLayoutEffect warning.
// (replaces useLayoutEffect from the deprecated @studio-freight/hamo)
export const useLayoutEffect =
  typeof window !== 'undefined' ? useReactLayoutEffect : useEffect

// Detects coarse-pointer / touch devices, updating on resize.
// (replaces useIsTouchDevice from the deprecated @studio-freight/hamo)
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(undefined)

  useLayoutEffect(() => {
    const onResize = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          window.matchMedia('(pointer: coarse)').matches,
      )
    }

    onResize()
    window.addEventListener('resize', onResize, false)

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return isTouchDevice
}
