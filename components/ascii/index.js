import {
  Html,
  OrbitControls,
  useAspect,
  useContextBridge,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { ASCIIEffect } from 'components/ascii-effect/index'
import { FontEditor } from 'components/font-editor'
import { button, useControls } from 'leva'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
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
import s from './ascii.module.scss'
import { AsciiContext } from './context'

function Scene() {
  const ref = useRef()

  const [asset, setAsset] = useState('/flower.jpeg')

  const gltfLoader = useMemo(() => {
    const loader = new GLTFLoader()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
      'https://cdn.jsdelivr.net/npm/three@0.140.0/examples/js/libs/draco/'
    )
    loader.setDRACOLoader(dracoLoader)

    return loader
  }, [])

  const [mixer, setMixer] = useState()

  useFrame((_, t) => {
    mixer?.update(t)
  })

  const gltf = useMemo(() => {
    if (!asset) return
    let src = asset

    if (
      src.startsWith('data:application/octet-stream;base64') ||
      src.includes('.glb')
    ) {
      const group = new Group()

      gltfLoader.load(src, ({ scene, animations }) => {
        const mixer = new AnimationMixer(scene)
        setMixer(mixer)
        const clips = animations

        clips.forEach((clip) => {
          mixer.clipAction(clip).play()
        })

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
      })

      return group
    }
  }, [asset])

  const [texture, setTexture] = useState()

  useEffect(() => {
    let src = asset

    if (
      src.startsWith('data:video') ||
      src.includes('.mp4') ||
      src.includes('.webm') ||
      src.includes('.mov')
    ) {
      const video = document.createElement('video')

      video.src = src
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      video.loop = true
      video.autoplay = true
      video.play()

      setTexture(new VideoTexture(video))
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

  const initialCamera = useRef()

  useEffect(() => {
    initialCamera.current = camera.clone()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      camera.position.copy(initialCamera.current.position)
      camera.rotation.copy(initialCamera.current.rotation)
    }, 0)
  }, [texture, gltf, camera])

  const scale = useAspect(
    texture?.image?.naturalWidth || viewport.width, // Pixel-width
    texture?.image?.naturalHeight || viewport.height, // Pixel-height
    1 // Optional scaling factor
  )

  const { fit } = useContext(AsciiContext)

  return (
    <>
      <Html zIndexRange={[1, 1]} wrapperClass={s.dropzone}>
        <div
          onDrop={(e) => {
            e.preventDefault()

            const reader = new FileReader()
            reader.addEventListener(
              'load',
              function () {
                setAsset(reader.result)
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
      </Html>

      <group ref={ref}>
        {/* <mesh geometry={gltf.nodes.Cube.geometry}>
          <meshBasicMaterial color="#ff0000" />
        </mesh> */}

        {gltf && !texture && <OrbitControls />}

        {gltf && <primitive object={gltf} />}

        {texture && (
          <mesh scale={fit ? scale : [viewport.width, viewport.height, 1]}>
            <planeBufferGeometry />
            <meshBasicMaterial map={texture} />
          </mesh>
        )}

        {/* <mesh scale={2}>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshNormalMaterial attach="material" />
        </mesh> */}
      </group>
    </>
  )
}

function Postprocessing() {
  const { gl, viewport } = useThree()
  const { set } = useContext(AsciiContext)
  // const effectComposer = useRef()

  useEffect(() => {
    set({ canvas: gl.domElement })
  }, [gl])

  // useControls(() => ({
  //   export: button(() => {
  //     let a = document.createElement('a')
  //     a.download = 'ASCII'
  //     // effectComposer.current.render(scene, camera)
  //     requestAnimationFrame(() => {
  //       a.href = gl.domElement.toDataURL('image/png;base64')
  //       a.click()
  //     })
  //   }),
  // }))

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
  } = useContext(AsciiContext)

  return (
    <EffectComposer>
      <ASCIIEffect
        charactersTexture={charactersTexture}
        granularity={granularity * viewport.dpr}
        charactersLimit={charactersLimit}
        fillPixels={fillPixels}
        overwriteColor={overwriteColor}
        color={color}
        fit={fit}
        greyscale={greyscale}
        invert={invert}
        matrix={matrix}
        time={time}
      />
    </EffectComposer>
  )
}

function Inner() {
  const ContextBridge = useContextBridge(AsciiContext)

  return (
    <>
      <Canvas flat linear>
        <ContextBridge>
          <Scene />
          <Postprocessing />
        </ContextBridge>
      </Canvas>
      <FontEditor />
    </>
  )
}

const DEFAULT = {
  characters: '*,    ./O#FLY',
  granularity: 12,
  charactersLimit: 16,
  fontSize: 64,
  fillPixels: false,
  color: '#ffffff',
  greyscale: false,
  invert: false,
  matrix: false,
  time: 0,
  fit: true,
}

export function ASCII({ children }) {
  const initialUrlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  )

  const [charactersTexture, setCharactersTexture] = useState(null)
  // const [characters, setCharacters] = useState(
  //   initialUrlParams.get('characters') || DEFAULT.characters
  // )
  const [canvas, setCanvas] = useState()

  const [
    {
      characters,
      granularity,
      charactersLimit,
      fontSize,
      fillPixels,
      color,
      fit,
      greyscale,
      invert,
      matrix,
      time,
    },
    _set,
  ] = useControls(
    () => ({
      characters: {
        value: initialUrlParams.get('characters') || DEFAULT.characters,
      },
      granularity: {
        min: 4,
        max: 32,
        value: initialUrlParams.get('granularity') || DEFAULT.granularity,
        step: 1,
        label: 'granularity',
      },
      charactersLimit: {
        min: 1,
        max: 256,
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
      time: {
        min: 0,
        value: parseFloat(initialUrlParams.get('time')) || DEFAULT.time,
        max: 1,
        step: 0.01,
        optional: true,
        disabled: !initialUrlParams.get('time'),
      },
      // overwriteColor: {
      //   value: !!initialUrlParams.get('color') || DEFAULT.overwriteColor,
      //   label: 'overwrite color',
      // },

      color: {
        value: initialUrlParams.get('color')
          ? '#' + initialUrlParams.get('color')
          : DEFAULT.color,
        optional: true,
        label: 'color',
        disabled: !initialUrlParams.get('color'),
      },
    }),
    []
  )

  useControls(
    () => ({
      export: button(() => {
        let a = document.createElement('a')
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

  const UrlParams = useMemo(() => {
    // apply new url params
    const params = new URLSearchParams()
    params.set('characters', characters)
    params.set('granularity', granularity)
    params.set('charactersLimit', charactersLimit)
    params.set('fontSize', fontSize)
    params.set('matrix', matrix === true)
    params.set('invert', invert === true)
    params.set('greyscale', greyscale === true)
    params.set('fillPixels', fillPixels === true)
    // params.set('overwriteColor', overwriteColor === true)
    if (time) {
      params.set('time', time)
    } else {
      params.delete('time')
    }

    if (color) {
      params.set('color', color.replace('#', ''))
    } else {
      params.delete('color')
    }
    return params
  }, [
    characters,
    granularity,
    fontSize,
    fillPixels,
    color,
    invert,
    greyscale,
    matrix,
    time,
  ])

  useEffect(() => {
    // change history
    const url = window.origin + '?' + UrlParams.toString()
    window.history.replaceState({}, null, url)
  }, [UrlParams])

  function set({ charactersTexture, canvas, ...props }) {
    if (charactersTexture) setCharactersTexture(charactersTexture)
    // if (characters) setCharacters(characters)
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
          characters,
          granularity,
          charactersTexture,
          charactersLimit,
          fontSize,
          fillPixels,
          overwriteColor: !!color,
          color,
          fit,
          greyscale,
          invert,
          matrix,
          time,
          set,
        }}
      >
        <Inner />
      </AsciiContext.Provider>
    </>
  )
}
