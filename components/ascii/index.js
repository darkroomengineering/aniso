import { OrbitControls, useAspect } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import cn from 'clsx'
import { ASCIIEffect } from 'components/ascii-effect/index'
import { FontEditor } from 'components/font-editor'
import { GUI } from 'components/gui'
import { button, useControls } from 'leva'
import { text } from 'lib/leva/text'
import { useStore } from 'lib/store'
import { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  AnimationMixer,
  Group,
  MeshBasicMaterial,
  MeshNormalMaterial,
  TextureLoader,
  VideoTexture,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import tunnel from 'tunnel-rat'
import s from './ascii.module.scss'
import { AsciiContext } from './context'

const ui = tunnel()

// Initialize DRACOLoader as a singleton
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(
  'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/libs/draco/'
)

// Initialize GLTFLoader as a singleton
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const Scene = () => {
  const ref = useRef()
  const [asset, setAsset] = useState('/darkroom-move.glb')
  const [mixer, setMixer] = useState()
  const [model, setModel] = useState()

  useFrame((state, delta) => {
    mixer?.update(delta)
  })

  useEffect(() => {
    if (!asset) return
    const src = asset

    if (
      src.startsWith('data:application/octet-stream;base64') ||
      src.includes('.glb')
    ) {
      const group = new Group()

      gltfLoader.load(
        src,
        ({ scene, animations }) => {
          const mixer = new AnimationMixer(scene)
          setMixer(mixer)
          const clips = animations

          for (const clip of clips) {
            const action = mixer.clipAction(clip)
            action.setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY)
            action.clampWhenFinished = true
            action.play()
          }

          group.add(scene)
          scene.traverse((mesh) => {
            if (
              Object.keys(mesh.userData)
                .map((v) => v.toLowerCase())
                .includes('occlude')
            ) {
              mesh.material = new MeshBasicMaterial({ color: '#000000' })
            } else {
              mesh.material = new MeshNormalMaterial()
            }
          })
          setModel(group)
        },
        undefined,
        (error) => {
          console.error('Error loading GLTF:', error)
        }
      )
    }
  }, [asset])

  const [texture, setTexture] = useState()

  useEffect(() => {
    if (model) setTexture(null)
  }, [model])

  useEffect(() => {
    const src = asset

    if (
      src.startsWith('data:video') ||
      src.includes('.mp4') ||
      src.includes('.webm') ||
      src.includes('.mov')
    ) {
      const video = document.createElement('video')

      function onLoad() {
        setTexture(new VideoTexture(video))
      }

      video.addEventListener('loadedmetadata', onLoad, { once: true })

      video.src = src
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      video.loop = true
      video.autoplay = true
      video.play()
    } else if (
      src.startsWith('data:image') ||
      src.includes('.jpg') ||
      src.includes('.png') ||
      src.includes('.jpeg')
    ) {
      new TextureLoader().load(src, (texture) => {
        setTexture(texture)
      })
    }
  }, [asset])

  const { viewport, camera } = useThree()

  const dimensions = (() => {
    if (!texture) return null
    try {
      if (texture.isVideoTexture && texture.image) {
        return [texture.image.videoWidth, texture.image.videoHeight]
      }
      if (texture.image) {
        return [texture.image.naturalWidth, texture.image.naturalHeight]
      }
    } catch (error) {
      console.warn('Could not get texture dimensions:', error)
    }
    return null
  })()

  const scale = useAspect(
    dimensions?.[0] || viewport.width, // Pixel-width
    dimensions?.[1] || viewport.height, // Pixel-height
    1 // Optional scaling factor
  )

  const { fit } = useContext(AsciiContext)

  const [drag, setDrag] = useState(false)
  const dropzone = useRef()

  useEffect(() => {
    function onDragEnter(e) {
      setDrag(true)
    }

    function onDragLeave(e) {
      if (e.srcElement !== dropzone.current) return
      setDrag(false)
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragleave', onDragLeave)

    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragleave', onDragLeave)
    }
  }, [])

  useEffect(() => {
    if (texture) {
      camera.position.set(0, 0, 5)
      camera.rotation.set(0, 0, 0)
      camera.zoom = 1
    } else {
      camera.position.set(500, 250, 500)
    }

    camera.updateProjectionMatrix()
  }, [camera, texture])

  return (
    <>
      <ui.In>
        {drag && (
          <div
            ref={dropzone}
            className={s.dropzone}
            onDrop={(e) => {
              e.preventDefault()
              setDrag(false)

              const filename = e.dataTransfer.files[0].name
              const isFont =
                filename.endsWith('.ttf') ||
                filename.endsWith('.otf') ||
                filename.endsWith('.woff') ||
                filename.endsWith('.woff2')

              const reader = new FileReader()
              reader.addEventListener(
                'load',
                (event) => {
                  if (isFont) {
                    const fontData = event.target.result
                    const fontName = 'CustomFont'

                    const fontFace = `
                    @font-face {
                      font-family: '${fontName}';
                      src: url(${fontData});
                    }
                  `

                    const styleElement = document.createElement('style')
                    styleElement.innerHTML = fontFace

                    document.head.appendChild(styleElement)
                  } else {
                    setAsset(reader.result)
                  }
                },
                false
              )

              if (e.dataTransfer.files[0]) {
                reader.readAsDataURL(e.dataTransfer.files[0])
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
            }}
          />
        )}
      </ui.In>

      <group ref={ref}>
        {model && (
          <>
            <OrbitControls makeDefault enableDamping />
            <group scale={200}>
              <primitive object={model} />
            </group>
          </>
        )}

        {texture && (
          <mesh scale={fit ? scale : [viewport.width, viewport.height, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} />
          </mesh>
        )}
      </group>
    </>
  )
}

function Postprocessing() {
  const { gl, viewport } = useThree()
  const { set } = useContext(AsciiContext)

  useEffect(() => {
    set({ canvas: gl.domElement })
  }, [gl])

  const {
    charactersTexture,
    granularity,
    charactersLimit,
    fillPixels,
    color,
    greyscale,
    invert,
    matrix,
    time,
    background,
  } = useContext(AsciiContext)
  console.log('background', background)

  return (
    <EffectComposer>
      <ASCIIEffect
        charactersTexture={charactersTexture}
        granularity={granularity * viewport.dpr}
        charactersLimit={charactersLimit}
        fillPixels={fillPixels}
        color={color}
        fit={fit}
        greyscale={greyscale}
        invert={invert}
        matrix={matrix}
        time={time}
        background={background}
      />
    </EffectComposer>
  )
}

function Inner() {
  const gui = useStore((state) => state.gui)

  return (
    <>
      <div className={s.ascii}>
        <GUI />
        <div className={cn(s.canvas, gui && s.open)}>
          <Canvas
            flat
            linear
            orthographic
            camera={{ position: [0, 0, 500], near: 0.1, far: 10000 }}
            resize={{ debounce: 100 }}
            gl={{
              antialias: false,
              alpha: true,
              depth: false,
              stencil: false,
              powerPreference: 'high-performance',
            }}
          >
            <Scene />
            <Postprocessing />
          </Canvas>
        </div>
      </div>
      <FontEditor />
      <ui.Out />
    </>
  )
}

const DEFAULT = {
  characters: ' *,    ./O#DE',
  granularity: 4,
  charactersLimit: 25,
  fontSize: 87,
  fillPixels: false,
  setColor: true,
  color: '#E30613',
  background: '#6a3a3a',
  greyscale: false,
  invert: false,
  matrix: false,
  setTime: false,
  time: 0,
  fit: true,
}

export function ASCII({ children }) {
  const initialUrlParams = new URLSearchParams(window.location.search)

  const [charactersTexture, setCharactersTexture] = useState(null)
  const [canvas, setCanvas] = useState()

  const [
    {
      characters,
      granularity,
      charactersLimit,
      fontSize,
      fillPixels,
      setColor,
      color,
      fit,
      greyscale,
      invert,
      matrix,
      setTime,
      time,
      background,
    },
    _set,
  ] = useControls(
    () => ({
      characters: text(
        initialUrlParams.get('characters') || DEFAULT.characters
      ),
      granularity: {
        min: 4,
        max: 32,
        value: initialUrlParams.get('granularity') || DEFAULT.granularity,
        step: 1,
        label: 'granularity',
      },
      charactersLimit: {
        min: 1,
        max: 48,
        value:
          initialUrlParams.get('charactersLimit') || DEFAULT.charactersLimit,
        step: 1,
        label: 'charLimit',
      },
      fontSize: {
        min: 1,
        max: 128,
        value: initialUrlParams.get('fontSize') || DEFAULT.fontSize,
        step: 1,
        label: 'font size',
      },
      greyscale: {
        value:
          initialUrlParams.get('greyscale') === 'true' || DEFAULT.greyscale,
      },
      invert: {
        value: initialUrlParams.get('invert') === 'true' || DEFAULT.invert,
      },
      fillPixels: {
        value:
          initialUrlParams.get('fillPixels') === 'true' || DEFAULT.fillPixels,
        label: 'fill pixels',
      },
      fit: {
        value: initialUrlParams.get('fit') || DEFAULT.fit,
      },
      matrix: {
        value: initialUrlParams.get('matrix') === 'true' || DEFAULT.matrix,
      },
      setTime: {
        value: !!initialUrlParams.get('time') || DEFAULT.setTime,
        label: 'set time',
        render: (get) => get('matrix') === true,
      },
      time: {
        min: 0,
        value: Number.parseFloat(initialUrlParams.get('time')) || DEFAULT.time,
        max: 1,
        step: 0.01,
        render: (get) => get('setTime') === true,
      },
      setColor: {
        value: !!initialUrlParams.get('color') || DEFAULT.setColor,
        label: 'set color',
      },
      color: {
        value: initialUrlParams.get('color')
          ? `#${initialUrlParams.get('color')}`
          : DEFAULT.color,
        label: 'color',
        render: (get) => get('setColor') === true,
      },
      background: {
        value: initialUrlParams.get('background')
          ? `#${initialUrlParams.get('background')}`
          : DEFAULT.background,
        label: 'background',
      },
    }),
    []
  )

  useControls(
    () => ({
      export: button(() => {
        const a = document.createElement('a')
        a.download = 'ASCII'

        requestAnimationFrame(() => {
          a.href = canvas.toDataURL('image/png;base64')
          a.click()
        })
      }),
      reset: button(() => {
        _set(DEFAULT)
      }),
    }),
    [canvas]
  )

  const UrlParams = (() => {
    const params = new URLSearchParams()
    params.set('characters', characters)
    params.set('granularity', granularity)
    params.set('charactersLimit', charactersLimit)
    params.set('fontSize', fontSize)
    params.set('matrix', matrix === true)
    params.set('invert', invert === true)
    params.set('greyscale', greyscale === true)
    params.set('fillPixels', fillPixels === true)
    if (setTime) {
      params.set('time', time)
    } else {
      params.delete('time')
    }

    if (setColor) {
      params.set('color', color.replace('#', ''))
    } else {
      params.delete('color')
    }

    params.set('background', background.replace('#', ''))
    return params
  })()

  useEffect(() => {
    const url = `${window.origin}?${UrlParams.toString()}`
    window.history.replaceState({}, null, url)
  }, [UrlParams])

  function set({ charactersTexture, canvas, ...props }) {
    if (charactersTexture) setCharactersTexture(charactersTexture)
    if (canvas) setCanvas(canvas)
    _set(props)
  }

  return (
    <>
      {/* <p className={s.instruction}>
      Drag and drop any file (.glb, .mp4, .mov, .webm, .png, .jpg, .webp,
      .avif)
    </p> */}
      <AsciiContext.Provider
        value={{
          characters: characters.toUpperCase(),
          granularity,
          charactersTexture,
          charactersLimit,
          fontSize,
          fillPixels,
          color: setColor ? color : undefined,
          fit,
          greyscale,
          invert,
          matrix,
          time: setTime ? time : undefined,
          background,
          set,
        }}
      >
        <Inner />
      </AsciiContext.Provider>
    </>
  )
}
