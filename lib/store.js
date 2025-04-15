import { create } from 'zustand'

export const useStore = create((set, get) => ({
  gui: true,
  setGui: (gui) => set({ gui }),
  navIsOpen: false,
  setNavIsOpen: (navIsOpen) => set({ navIsOpen }),
}))
