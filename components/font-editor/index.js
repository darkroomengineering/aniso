import { AsciiContext } from 'components/ascii/context'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { CanvasTexture, NearestFilter, RepeatWrapping } from 'three'
import s from './font-editor.module.scss'

export function FontEditor() {
  const el = useRef()

  const invert = false
  const { characters, fontSize, charactersLimit, set } =
    useContext(AsciiContext)

  const canvasDebug = useMemo(() => document.createElement('canvas'), [])
  const contextDebug = useMemo(
    () => canvasDebug.getContext('2d'),
    [canvasDebug]
  )

  const canvas = useMemo(() => document.createElement('canvas'), [])
  const context = useMemo(() => canvas.getContext('2d'), [canvas])
  const texture = useMemo(() => {
    const texture = new CanvasTexture(canvas)
    texture.minFilter = texture.magFilter = NearestFilter
    texture.wrapS = texture.wrapT = RepeatWrapping

    return texture
  }, [canvas])

  useEffect(() => {
    set({ charactersTexture: texture })
  }, [texture])

  useEffect(() => {
    el.current.appendChild(canvasDebug)
    el.current.appendChild(canvas)

    return () => {
      canvas.remove()
      canvasDebug.remove()
    }
  }, [])

  useEffect(() => {
    canvasDebug.width = 1024
    canvasDebug.height = 1024

    canvas.width = 1024
    canvas.height = 1024
  }, [])

  function render() {
    if (!context) return
    context.clearRect(0, 0, 1024, 1024)
    contextDebug.clearRect(0, 0, 1024, 1024)
    context.font = `${fontSize}px CustomFont, monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const charactersArray = characters.split('')
    const step = 256 / (charactersLimit - 1)

    for (let i = 0; i < charactersLimit; i++) {
      const x = i % 16
      const y = Math.floor(i / 16)
      let c = step * i

      if (invert) {
        c = 256 - c
      }

      contextDebug.fillStyle = `rgb(${c},${c},${c})`
      contextDebug.fillRect(x * 64, y * 64, 64, 64)
    }

    charactersArray.forEach((character, i) => {
      const x = i % 16
      const y = Math.floor(i / 16)

      context.fillStyle = 'white'
      context.fillText(character, x * 64 + 32, y * 64 + 32)
    })

    texture.needsUpdate = true
  }

  useEffect(() => {
    render()
  }, [characters, context, charactersLimit, invert, fontSize])

  return (
    <div ref={el} className={s.font}>
      <input
        value={characters}
        onKeyDown={({}) => {
          console.log('onKeydown')
        }}
        onChange={({ target }) => {
          set({ characters: target.value })
        }}
      />
    </div>
  )
}
