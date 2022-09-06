import { useThree } from '@react-three/fiber'
import { BlendFunction, Effect } from 'postprocessing'
import { forwardRef, useEffect, useMemo } from 'react'
import { Color, Uniform } from 'three'
import fragmentShader from './fragment.glsl'

// https://github.com/pmndrs/postprocessing/wiki/Custom-Effects
// https://docs.pmnd.rs/react-postprocessing/effects/custom-effects

// Effect implementation
class ASCIIEffectImpl extends Effect {
  constructor({
    charactersTexture,
    granularity = 16,
    charactersLimit = 32,
    fillPixels = false,
    overwriteColor = false,
    color = '#ffffff',
    greyscale = false,
    invert = false,
    matrix = false,
  } = {}) {
    super('ASCIIEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uCharactersTexture', new Uniform(charactersTexture)],
        ['uGranularity', new Uniform(granularity)],
        ['uFillPixels', new Uniform(fillPixels)],
        ['uCharactersLimit', new Uniform(charactersLimit)],
        ['uOverwriteColor', new Uniform(overwriteColor)],
        ['uColor', new Uniform(new Color(color))],
        ['uGreyscale', new Uniform(greyscale)],
        ['uInvert', new Uniform(invert)],
        ['uMatrix', new Uniform(matrix)],
        ['uTime', new Uniform(0)],
      ]),
    })
  }

  update(render, target, deltaTime) {
    if (!this.overwriteTime) {
      this.uniforms.get('uTime').value += deltaTime * 0.2
    }
  }
}

// Effect component
export const ASCIIEffect = forwardRef((props = {}, ref) => {
  const { viewport } = useThree()

  const effect = useMemo(() => new ASCIIEffectImpl(props), [])

  useEffect(() => {
    const {
      charactersTexture,
      granularity,
      charactersLimit,
      fillPixels,
      overwriteColor,
      color,
      greyscale,
      invert,
      matrix,
      time,
    } = props

    effect.uniforms.get('uCharactersTexture').value = charactersTexture
    effect.uniforms.get('uGranularity').value = granularity
    effect.uniforms.get('uCharactersLimit').value = charactersLimit
    effect.uniforms.get('uFillPixels').value = fillPixels
    effect.uniforms.get('uOverwriteColor').value = overwriteColor
    effect.uniforms.get('uColor').value.set(color)
    effect.uniforms.get('uGreyscale').value = greyscale
    effect.uniforms.get('uInvert').value = invert
    effect.uniforms.get('uMatrix').value = matrix

    effect.overwriteTime = time !== undefined

    if (effect.overwriteTime) {
      effect.uniforms.get('uTime').value = time
    } else {
      effect.uniforms.get('uTime').value = 0
    }
  }, [props])

  return <primitive ref={ref} object={effect} />
})
ASCIIEffect.displayName = 'ASCIIEffect'
