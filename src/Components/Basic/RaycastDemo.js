import React, { useRef, useState } from "react";
import { Circle } from "@react-three/drei";
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
import { PerspectiveCamera } from "@react-three/drei/PerspectiveCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

extend({ OrbitControls });

const Controls = (props) => {
  const {
    camera,
    gl: { domElement }
  } = useThree();
  const controls = useRef();
  useFrame(() => controls.current && controls.current.update());
  return (
    <orbitControls maxPolarAngle={Math.PI/2} ref={controls} args={[camera, domElement]} {...props} />
  );
};

function RaycastDemo() {
  const [spherePos, setSpherePos] = useState([0, -0.9, 0]);

  function rayCastPlane(event) {
    setSpherePos([event.point.x, event.point.y + 0.01, event.point.z]);
  }

  return (
    <Canvas>
      <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Circle
        args={[1, 8]}
        scale={[0.5, 0.5, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={spherePos}
      >
        <meshBasicMaterial attach="material" color="black" wireframe />
      </Circle>

      <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[1, 32, 32]} />
        <meshStandardMaterial
          attach="material"
          color="white"
        //  transparent
       //   opacity={0.6}
          roughness={0.2}
          metalness={0.8}
         // wireframe
        />
      </mesh>

      <mesh
        onPointerMove={rayCastPlane}
        position={[0, -1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <meshStandardMaterial attach="material" color="gray" />
      </mesh>

      <PerspectiveCamera
        makeDefault
        position={[0, 0, 10]}
        fov={50}
        aspect={1.7}
        near={1}
        far={1000}
      />
      {/* <EffectComposer> */}
        {/* <DepthOfField focusDistance={0} focalLength={0.45} bokehScale={2} height={480} /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} /> */}
        {/* <Noise opacity={0.02} /> */}
        {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
      {/* </EffectComposer> */}
    </Canvas>
  );
}

export default RaycastDemo;
