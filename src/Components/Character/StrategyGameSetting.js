import React, { Suspense, useRef, useState, useEffect } from "react";
//import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { Circle } from "@react-three/drei";
import { useFrame } from "react-three-fiber";
import { MapControls } from '@react-three/drei/MapControls'
import { PerspectiveCamera } from "@react-three/drei/PerspectiveCamera";


import Soldier from './Soldier'
import soldierStatesStore from '../../Stores/SoldierStateStore'

import * as THREE from 'three'

function LocationPointer(props){
  const ref = useRef();

  useFrame(()=>{
    ref.current.position.x = props.pointerPosition.x;
    ref.current.position.y = props.pointerPosition.y;
    ref.current.position.z = props.pointerPosition.z;
  });

  return (
    <Circle ref={ref} args={[1,8]} position={ [0, 0.01, 0]} scale={[0.5, 0.5]} rotation={[-Math.PI/2, 0, 0]}>
      <meshBasicMaterial attach="material" color="black" />
    </Circle>
  )
}

function PlayerSolder(props){
  const ref = useRef();

  //Handling the rotation of the soldier
  const [rotationMatrix] = useState(new THREE.Matrix4());
  const [targetQuaternion] = useState(new THREE.Quaternion());

  const soldierState = soldierStatesStore(state => state.soldierState);
  const stopSoldier = soldierStatesStore(state => state.stopSoldier);
  const [xStep, setXstep] = useState(0.03);
  const [zStep, setZstep] = useState(0.03);
  const [walkStep] = useState(0.03);
  const [runStep] = useState(0.06);
  const clock = new THREE.Clock();

  useFrame(()=>{
    const delta = clock.getDelta();

    if ( !ref.current.quaternion.equals( targetQuaternion )) {
      const step = 5 * delta;
      ref.current.quaternion.rotateTowards( targetQuaternion, step );
    } else if(!ref.current.position.equals(props.soldierPosition) && soldierState !== 0){
      ref.current.position.x += xStep;
      ref.current.position.z += zStep;

      if(ref.current.position.distanceTo(props.soldierPosition) < 0.1)
        stopSoldier();

    }
  });

  useEffect(() => {
    rotationMatrix.lookAt( props.soldierPosition, ref.current.position, ref.current.up );
    targetQuaternion.setFromRotationMatrix( rotationMatrix );

    let hypotenuse = ref.current.position.distanceTo(props.soldierPosition);
    let xDiff = props.soldierPosition.x - ref.current.position.x;
    let zDiff = props.soldierPosition.z - ref.current.position.z;
    console.log(soldierState)
    if(soldierState === 3){
      setXstep(walkStep * xDiff/hypotenuse);
      setZstep(walkStep * zDiff/hypotenuse);
    } else if(soldierState === 1) {
      setXstep(runStep * xDiff/hypotenuse);
      setZstep(runStep * zDiff/hypotenuse);
    }
    
  }, [props.soldierPosition])

  return(
    <Suspense fallback={null}>
      <group ref={ref} >
        <Soldier rotation={[0, Math.PI,0]}/>
      </group>
    </Suspense>  

  )
}

function StrategyGameSetting(props) {
  const ref = useRef();

  const [pointerPosition, setPointerPosition] = useState(new THREE.Vector3(0, 0.01, 0));
  const [soldierPosition, setSoldierPosition] = useState(new THREE.Vector3(0, 0, 0));

  const walkSoldier = soldierStatesStore(state => state.walkSoldier);
  const runSoldier = soldierStatesStore(state => state.runSoldier);

  const raycastPlane = (event) => {
    setPointerPosition(new THREE.Vector3(event.point.x, pointerPosition.y, event.point.z));
  }

  const setSoldierDestination = (event) => {
    let e = window.event;
    if (e.shiftKey) {
      runSoldier();
    } else {
      walkSoldier();
    }
    setSoldierPosition(new THREE.Vector3(event.point.x, soldierPosition.y, event.point.z));
  }

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={raycastPlane}
        onClick={setSoldierDestination}
      >
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <meshStandardMaterial attach="material" color="gray" />
      </mesh>
      <LocationPointer pointerPosition={pointerPosition}/>
      <group ref={ref}>
        <PlayerSolder soldierPosition={soldierPosition}/>

        <PerspectiveCamera
          makeDefault
          position={[0, 5, 20]}
          fov={50}
          aspect={1.7}
          near={1}
          far={1000}
        />
        <MapControls/>
      </group>
    </group>
  );
}

export default StrategyGameSetting;
