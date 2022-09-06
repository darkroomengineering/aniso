import { useThree } from '@react-three/fiber'
import { button, useControls } from 'leva'
import { useStore } from 'lib/store'
import { BlendFunction, Effect } from 'postprocessing'
import { forwardRef, useEffect, useMemo } from 'react'
import { Color, NearestFilter, RepeatWrapping, Uniform } from 'three'
import fragmentShader from './fragment.glsl'

// https://github.com/pmndrs/postprocessing/wiki/Custom-Effects
// https://docs.pmnd.rs/react-postprocessing/effects/custom-effects

let uFont,
  uCharSize,
  uCharLength,
  uPixels,
  uOverwriteColor,
  uColor,
  uInvert,
  uGreyscale,
  uMatrix,
  uOverwriteTime,
  uTime

// Effect implementation
class ASCIIEffectImpl extends Effect {
  constructor({
    fontTexture,
    charSize,
    charLength,
    pixels,
    overwriteColor,
    color,
    invert,
    greyscale,
    matrix,
    overwriteTime,
    time,
  } = {}) {
    super('ASCIIEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uFont', new Uniform(fontTexture)],
        ['uCharSize', new Uniform(charSize)],
        ['uPixels', new Uniform(pixels)],
        ['uCharLength', new Uniform(charLength)],
        ['uOverwriteColor', new Uniform(overwriteColor)],
        ['uColor', new Uniform(color)],
        ['uInvert', new Uniform(invert)],
        ['uGreyscale', new Uniform(greyscale)],
        ['uMatrix', new Uniform(matrix)],
        ['uOverwriteTime', new Uniform(overwriteTime)],
        ['uTime', new Uniform(time)],
      ]),
    })

    uFont = fontTexture
    uCharSize = charSize
    uCharLength = charLength
    uPixels = pixels
    uOverwriteColor = overwriteColor
    uColor = color
    uInvert = invert
    uGreyscale = greyscale
    uMatrix = matrix
    uOverwriteTime = overwriteTime
    uTime = time
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('uFont').value = uFont
    this.uniforms.get('uCharSize').value = uCharSize
    this.uniforms.get('uCharLength').value = uCharLength
    this.uniforms.get('uPixels').value = uPixels
    this.uniforms.get('uOverwriteColor').value = uOverwriteColor
    this.uniforms.get('uColor').value = uColor
    this.uniforms.get('uInvert').value = uInvert
    this.uniforms.get('uGreyscale').value = uGreyscale
    this.uniforms.get('uMatrix').value = uMatrix
    this.uniforms.get('uOverwriteTime').value = uOverwriteTime
    this.uniforms.get('uTime').value = uTime
  }
}

// Effect component
export const ASCIIEffect = forwardRef(({ param }, ref) => {
  const fontTexture = useStore((state) => state.fontTexture)
  const setCharLength = useStore((state) => state.setCharLength)
  const setInvert = useStore((state) => state.setInvert)

  useEffect(() => {
    fontTexture.minFilter = fontTexture.magFilter = NearestFilter
    fontTexture.wrapS = fontTexture.wrapT = RepeatWrapping
    fontTexture.needsUpdate = true
  }, [fontTexture])

  const URLParams = useStore((state) => state.URLParams)

  const [
    {
      charSize,
      charLength,
      pixels,
      greyscale,
      matrix,
      color,
      invert,
      overwriteColor,
      overwriteTime,
      time,
    },
    set,
  ] = useControls(() => ({
    charSize: {
      min: 0,
      max: 32,
      step: 1,
      value: URLParams.get('charSize') || 8,
      label: 'char size',
    },
    charLength: {
      min: 0,
      max: 256,
      step: 1,
      value: URLParams.get('charLength') || 32,
      label: 'char length',
    },
    pixels: URLParams.has('pixels')
      ? URLParams.get('pixels') === 'true'
      : false,
    greyscale: URLParams.has('greyscale')
      ? URLParams.get('greyscale') === 'true'
      : false,
    overwriteColor: URLParams.has('overwriteColor')
      ? URLParams.get('overwriteColor') === 'true'
      : false,
    color: URLParams.get('color') || '#ffffff',
    invert: URLParams.has('invert')
      ? URLParams.get('invert') === 'true'
      : false,
    matrix: URLParams.has('matrix')
      ? URLParams.get('matrix') === 'true'
      : false,
    overwriteTime: URLParams.has('overwriteTime')
      ? URLParams.get('overwriteTime') === 'true'
      : false,
    time: {
      value: URLParams.get('charLength') || 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
  }))

  const setUrlParams = useStore((state) => state.setUrlParams)

  useEffect(() => {
    setUrlParams({
      charSize,
      charLength,
      pixels,
      greyscale,
      overwriteColor,
      color,
      invert,
      overwriteTime,
      matrix,
      time,
    })
  }, [
    charSize,
    charLength,
    pixels,
    greyscale,
    overwriteColor,
    invert,
    color,
    overwriteTime,
    matrix,
    time,
  ])

  useControls(() => ({
    reset: button(() => {
      set({
        charSize: 8,
        charLength: 32,
        pixels: false,
        greyscale: false,
        overwriteColor: false,
        color: '#ffffff',
        invert: false,
        matrix: false,
        overwriteTime: false,
        time: 0,
      })
    }),
  }))

  useEffect(() => {
    setCharLength(charLength)
  }, [charLength])

  useEffect(() => {
    setInvert(invert)
  }, [invert])

  const { viewport } = useThree()

  const effect = useMemo(
    () =>
      new ASCIIEffectImpl({
        fontTexture,
        charSize: charSize * viewport.dpr,
        charLength,
        pixels,
        overwriteColor,
        color: new Color(color),
        invert,
        greyscale,
        matrix,
        overwriteTime,
        time,
      }),
    [
      fontTexture,
      charSize,
      charLength,
      pixels,
      overwriteColor,
      color,
      greyscale,
      invert,
      matrix,
      overwriteTime,
      time,
    ]
  )

  return <primitive ref={ref} object={effect} dispose={null} />
})
ASCIIEffect.displayName = 'ASCIIEffect'
