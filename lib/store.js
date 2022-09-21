import create from 'zustand'

export const useStore = create((set, get) => ({
  gui: true,
  setGui: (gui) => set({ gui }),
}))
