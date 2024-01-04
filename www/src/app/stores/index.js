import { create } from 'zustand'

const useLakeStore = create((set, get) => ({
  lake: [],
  update: (data) => {
    set({ lake: data })
  }
}))

export { useLakeStore }
