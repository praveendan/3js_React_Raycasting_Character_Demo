import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
//import { extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing'

//import Soldier from './Components/Soldier'
import PlayerCam from './PlayerCam'
import StrategySetting from './StrategyGameSetting'
import ThirdPersonSetting from './ThirdPersonSetting'

const options = {
  PLAYER_CAM: '1',
  STRATERGY: '2',
  THIRD_PERSON: '3'
}

function BoxObjects(props) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.z += 0.01;
  });

  return (
    <mesh ref={ref} {...props} >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function Arena() {
  const [selectedValue, setSelectedValue] = useState(options.PLAYER_CAM);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div className="main-switcher-game">
        <label>
          <input
            type="radio"
            value={options.PLAYER_CAM}
            name="camSwitcher"
            checked={selectedValue === options.PLAYER_CAM}
            onChange={handleChange}
          />
          Player Cam
        </label>
        <label>
          <input
            type="radio"
            value={options.STRATERGY}
            name="camSwitcher"
            checked={selectedValue === options.STRATERGY}
            onChange={handleChange}
          />
          Strategy setting
        </label>
        <label>
          <input
            type="radio"
            value={options.THIRD_PERSON}
            name="camSwitcher"
            checked={selectedValue === options.THIRD_PERSON}
            onChange={handleChange}
          />
          Third person setting
        </label>
      </div>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {selectedValue === options.PLAYER_CAM && <PlayerCam />}
        {selectedValue === options.STRATERGY && <StrategySetting />}
        {selectedValue === options.THIRD_PERSON && <ThirdPersonSetting />}
        <BoxObjects position={[10, 2, 10]} />
        <mesh visible position={[0, 1, -10]} rotation={[0, 0, 0]}>
          <sphereGeometry attach="geometry" args={[1, 32, 32]} />
          <meshStandardMaterial
            attach="material"
            color="white"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default Arena;
