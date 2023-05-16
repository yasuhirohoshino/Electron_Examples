import * as THREE from 'three'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
  Environment,
  OrbitControls,
  Stats,
  Svg,
  Text,
  Text3D,
  useFont,
  useTexture,
  useVideoTexture
} from '@react-three/drei'
import { useRef, useState } from 'react'
import { AnimationMixer, Mesh } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import testShader_vert from './shaders/test.vert'
import testShader_frag from './shaders/test.frag'

function Caption(props) {
  return (
    <Text
      fontSize={0.5}
      position={[0.0, 0.25, 0.75]}
      rotation={[-Math.PI / 4, 0.0, 0.0]}
      color={new THREE.Color(0.025, 0.025, 0.025)}
    >
      {props.children}
    </Text>
  )
}

function Img_jpg(props) {
  const colorMap = useTexture('./images/img_1.jpg')
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={colorMap} side={THREE.DoubleSide} />
      </mesh>
      <Caption>jpg</Caption>
    </group>
  )
}

function Img_png(props) {
  const colorMap = useTexture('./images/img_2.png')
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={colorMap} alphaTest={0.5} side={THREE.DoubleSide} />
      </mesh>
      <Caption>png</Caption>
    </group>
  )
}

function Img_svg(props) {
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]}>
        <Svg
          src={'./images/img_3.svg'}
          scale={[0.005, 0.005, 0.005]}
          position={[-0.67, 0.65, 0.0]}
        />
      </mesh>
      <Caption>svg</Caption>
    </group>
  )
}

function OBJModel(props) {
  const obj = useLoader(OBJLoader, './models/bunny.obj')

  obj.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      child.scale.set(10.0, 10.0, 10.0)
      child.position.set(0.0, -0.35, 0.0)
    }
  })

  return (
    <group {...props}>
      <mesh>
        <primitive object={obj} />
      </mesh>
      <Caption>obj</Caption>
    </group>
  )
}

function FBXModel(props) {
  const obj = useLoader(FBXLoader, './models/man_walking.fbx')
  const [mixer] = useState(() => new AnimationMixer(obj))
  const action = mixer.clipAction(obj.animations[0])
  action.play()

  obj.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  useFrame((_state, delta) => {
    mixer.update(delta)
  })

  return (
    <group {...props}>
      <mesh position={[0, 0, 0]}>
        <primitive object={obj} />
      </mesh>
      <Caption>fbx</Caption>
    </group>
  )
}

function GLTFModel(props) {
  const gltf = useLoader(GLTFLoader, './models/gltf/alarm_clock_01_1k.gltf')
  gltf.scene.traverse((child) => {
    child.castShadow = true
    child.receiveShadow = true
  })

  return (
    <group {...props}>
      <mesh position={[0.0, 0.0, 0.0]} scale={[10.0, 10.0, 10.0]}>
        <primitive object={gltf.scene} />
      </mesh>
      <Caption>glTF</Caption>
    </group>
  )
}

function GLBModel(props) {
  const gltf = useLoader(GLTFLoader, './models/Megaphone_01_1k.glb')
  gltf.scene.traverse((child) => {
    child.castShadow = true
    child.receiveShadow = true
  })

  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]} scale={[5.0, 5.0, 5.0]} rotation={[0.0, Math.PI / 8, 0.0]}>
        <primitive object={gltf.scene} />
      </mesh>
      <Caption>glb</Caption>
    </group>
  )
}

function TextMesh(props) {
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]}>
        <Text font={'./fonts/EBGaramond-Medium.woff'}>
          Text
          <meshPhysicalMaterial side={THREE.DoubleSide} />
        </Text>
      </mesh>
      <Caption>woff</Caption>
    </group>
  )
}

function Text3DMesh(props) {
  const font = useFont('./fonts/Oswald_Bold.json')
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]}>
        <Text3D size={0.8} font={font.data} castShadow receiveShadow position={[-1.5, -0.5, 0.0]}>
          Text3D
          <meshPhysicalMaterial />
        </Text3D>
      </mesh>
      <Caption>json(font)</Caption>
    </group>
  )
}

function ShaderMesh(props) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    const { clock } = state
    matRef.current.uniforms.time = { value: clock.getElapsedTime() * 0.1 }
  })

  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={testShader_vert}
          fragmentShader={testShader_frag}
          side={THREE.DoubleSide}
          alphaTest={0.5}
        />
      </mesh>
      <Caption>GLSL</Caption>
    </group>
  )
}

function MP4Mesh(props) {
  const texture = useVideoTexture('./movies/movie_1.mp4')
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]} scale={[2.0, (9.0 / 16.0) * 2.0, 1.0]}>
        <planeGeometry />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Caption>mp4</Caption>
    </group>
  )
}

function WEBMMesh(props) {
  const texture = useVideoTexture('./movies/movie_2.webm')
  return (
    <group {...props}>
      <mesh position={[0.0, 1.0, 0.0]} scale={[2.0, (9.0 / 16.0) * 2.0, 1.0]}>
        <planeGeometry />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Caption>webm</Caption>
    </group>
  )
}

function App(): JSX.Element {
  return (
    <div className="container">
      <Canvas shadows camera={{ position: [0.0, 10.0, 7.0], fov: 45 }}>
        <directionalLight
          position={[5.0, 5.0, 5.0]}
          castShadow
          shadow-camera-right={10.0}
          shadow-camera-left={-10.0}
          shadow-camera-top={10.0}
          shadow-camera-bottom={-10.0}
          shadow-normalBias={0.1}
        />
        <mesh
          castShadow
          receiveShadow
          position={[0.0, 0.0, 0.0]}
          rotation={[-Math.PI / 2, 0.0, 0.0]}
        >
          <planeGeometry args={[10, 10]} />
          <meshPhysicalMaterial color="gray" roughness={0.75} metalness={0.5} />
        </mesh>
        <OBJModel position={[-3.5, 0.0, 3.5]} />
        <FBXModel position={[-1.25, 0.0, 3.5]} />
        <GLTFModel position={[1.25, 0.0, 3.5]} />
        <GLBModel position={[3.5, 0.0, 3.5]} />
        <Img_jpg position={[-3.0, 0.0, 1.0]} />
        <Img_png position={[0.0, 0.0, 1.0]} />
        <Img_svg position={[3.0, 0.0, 1.0]} />
        <TextMesh position={[-2.0, 0.0, -1.0]} />
        <Text3DMesh position={[2.0, 0.0, -1.0]} />
        <MP4Mesh position={[-2.0, 0.0, -3.0]} />
        <WEBMMesh position={[2.0, 0.0, -3.0]} />
        <ShaderMesh position={[0.0, 0.0, -4.5]} />
        <gridHelper />
        <OrbitControls makeDefault />
        <Stats />
        <Environment preset="city" background blur={0.1} />
      </Canvas>
    </div>
  )
}

export default App
