import React, { Suspense, useRef, useState, useEffect } from "react";
import { useFrame, extend, useThree } from "react-three-fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Soldier from './Soldier'
import soldierPositionStore from '../../Stores/SoldierPositionStore'

import * as THREE from 'three'

extend({ OrbitControls });
//orbit controller
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

function PlayerCam() {
  const ref = useRef();

  const soldierStopPos = soldierPositionStore(state => state.soldierDestRot);
  
  //Handling the rotation of the soldier
  const [rotationMatrix] = useState(new THREE.Matrix4());
  const [targetQuaternion] = useState(new THREE.Quaternion());

  const clock = new THREE.Clock();
  useFrame(()=>{
    const delta = clock.getDelta();

    if ( !ref.current.quaternion.equals( targetQuaternion )) {
      const step = 5 * delta;
      ref.current.quaternion.rotateTowards( targetQuaternion, step );
    }
  });

  useEffect(() => {
    rotationMatrix.lookAt( soldierStopPos, ref.current.position, ref.current.up );
    targetQuaternion.setFromRotationMatrix( rotationMatrix );
  }, [soldierStopPos])
  //Handling the rotation of the soldier End

  return (
    <group ref={ref}>
        <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />

        <Suspense fallback={null}>
            <Soldier/>
        </Suspense>    

        <PerspectiveCamera
            makeDefault
            position={[0, 1, 10]}
            fov={50}
            aspect={1.7}
            near={1}
            far={1000}
        />
    </group>
  );
}

export default PlayerCam;
