import { create } from 'zustand'

const useSearchStore = create((set, get) => ({
  input: "",
  song: {},
  videoSrc: '',
  tabSrc: '',
  videoOptions: [],
  tabOptions: [],
  updateInput: (title) => {
    set({input: title})
    fetch(`/api/songs?title=${title}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        set({
          videoOptions: data.videoSearch,
          song: data.island,
          videoSrc: data.island.video.url,
          tabSrc: data.island.tab.url,
        })
      })
  },
  setSong: (song) => {
    set({ song })
  },
  setVideoSrc: (url) => {
    set({ songSrc: url })
  },
  setTabSrc: (song) => {
    set({ tabSrc: url })
  },
}))

export { useSearchStore }
