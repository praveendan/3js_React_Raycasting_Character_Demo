import React, { Suspense, useRef, useState, useEffect, useCallback } from "react";
import lerp from 'lerp'
import * as THREE from 'three'

import { useFrame, useThree } from "react-three-fiber";
import { PerspectiveCamera } from "@react-three/drei/PerspectiveCamera";

import Soldier from './Soldier'
import soldierStatesStore from '../../Stores/SoldierStateStore'
import soldierPositionStore from '../../Stores/SoldierPositionStore'

/* a Sphere surrounding the area. camera raycasts to this 
*sphere to determine the rotation and the destination position
*/
function Dome(props) {
  const ref = useRef();
  const raycaster = new THREE.Raycaster();
  const characterPoint = new THREE.Vector2(0, 0);

  const setSoldierDestPosition = soldierPositionStore(state => state.setSoldierDestPosition);

  const {
    camera,
    gl: { domElement }
  } = useThree();

  const dome = [];
  dome.push(ref.current)

  useFrame(() => {
    raycaster.setFromCamera(characterPoint, camera);
    const intersects = raycaster.intersectObjects(dome);
    setSoldierDestPosition(intersects[0].point);
  });

  return (
    <mesh ref={ref} visible position={[0, -1, 0]} >
      <boxBufferGeometry args={[-100, -100, -100]} />
      <meshPhongMaterial attach="material" color="#f3f3f3" doubleside />
    </mesh>
  )
}
/* a Sphere surrounding the area. camera raycasts to this 
*sphere to determine the rotation and the destination position
*/


function ThirdPersonSetting(props) {
  const ref = useRef();
  const [currentRotation, setCurrentRotation] = useState([0, 0, 0])

  const soldierStopPos = soldierPositionStore(state => state.soldierDestPosition);
  const walkSoldier = soldierStatesStore(state => state.walkSoldier);
  const runSoldier = soldierStatesStore(state => state.runSoldier);
  const stopSoldier = soldierStatesStore(state => state.stopSoldier);
  const tPoseSoldier = soldierStatesStore(state => state.tPoseSoldier);

  const soldierState = soldierStatesStore(state => state.soldierState);

  const [mouseLocation, setMouseLocation] = useState(0);

  useFrame(() => {
    if (0.01 < Math.abs(currentRotation[1] - mouseLocation))
      setCurrentRotation([0, mouseLocation, 0]);
    if (soldierState === 3) {
      ref.current.position.x = lerp(ref.current.position.x, soldierStopPos.x, 0.001);
      ref.current.position.z = lerp(ref.current.position.z, soldierStopPos.z, 0.001);
    } else if (soldierState === 1) {
      ref.current.position.x = lerp(ref.current.position.x, soldierStopPos.x, 0.005);
      ref.current.position.z = lerp(ref.current.position.z, soldierStopPos.z, 0.005);
    }
  });

  //Handling Key input
  const keyPressFunction = useCallback((event) => {
    switch (event.keyCode) {
      case 87:
        if (soldierState !== 3) {
          walkSoldier()
        }
        break;
      case 81:
        if (soldierState !== 1) {
          runSoldier();
        }
        break;
      case 84:
        if (soldierState !== 2) {
          tPoseSoldier();
        }
        break;
      default:
        break;
    }
  }, [runSoldier, soldierState, tPoseSoldier, walkSoldier]);

  const keyReleaseFunction = useCallback((event) => {
    stopSoldier();
  }, [stopSoldier]);

  useEffect(() => {
    document.addEventListener("keydown", keyPressFunction, false);
    document.addEventListener("keyup", keyReleaseFunction, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    return () => {
      document.removeEventListener("keydown", keyPressFunction, false);
      document.removeEventListener("keyup", keyReleaseFunction, false);
      document.removeEventListener('mousemove', onDocumentMouseMove, false);
    };
  }, [keyPressFunction, keyReleaseFunction]);
  //Handling Key input Ends

  function onDocumentMouseMove(event) {
    let widowSize = window.innerWidth / 2;
    var a = ((event.clientX - widowSize) / widowSize) * Math.PI;
    setMouseLocation(a);
  }

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <meshStandardMaterial attach="material" color="gray" />
      </mesh>
      <Dome />
      <group ref={ref} rotation={currentRotation}>
        <Suspense fallback={null}>
          <Soldier />
        </Suspense>

        <PerspectiveCamera
          makeDefault
          position={[0, 1, 5]}
          fov={50}
          aspect={1.7}
          near={1}
          far={1000}
        >
        </PerspectiveCamera>
      </group>

    </group>
  );
}

export default ThirdPersonSetting;
