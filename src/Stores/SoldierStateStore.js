import create from 'zustand'

const soldierStatesStore = create(set => ({
  soldierState: 0,
  stopSoldier: () => set(state => ({ soldierState: 0 })),
  walkSoldier: () => set(state => ({ soldierState: 3 })),
  runSoldier: () => set(state => ({ soldierState: 1 })),
  tPoseSoldier: () => set(state => ({ soldierState: 2 })),
}))

export default soldierStatesStore;