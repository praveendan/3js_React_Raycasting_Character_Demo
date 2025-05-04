import {create} from 'zustand'
import * as THREE from 'three'

const soldierPositionStore = create(set => ({
  soldierInitPosition: [0,0,0],
  soldierDestPosition: new THREE.Vector3(0,0,0),
  soldierDestRot: new THREE.Vector3(0,0,0),
  soldierRotation: 0,
  setSoldierDestPosition: (newPosition) => set(state=>({ 
  //  soldierInitPosition: state.soldierDestPosition,
    soldierDestPosition: new THREE.Vector3(newPosition.x, 0, newPosition.z)
  })),
  setSoldierDestRot: (newPosition) => set(state=>({ 
    //  soldierInitPosition: state.soldierDestPosition,
    soldierDestRot: new THREE.Vector3(newPosition[0], newPosition[1], newPosition[2])
    })),
  setSoldierRotation: (newRotation) => set(state=>({
    soldierRotation: newRotation
  }))
}))

export default soldierPositionStore