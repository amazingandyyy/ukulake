import { create } from 'zustand'

const useSearchStore = create((set, get) => ({
  input: '',
  videoSrc: '',
  tabSrc: '',
  videoOptions: [],
  tabOptions: [],
  updateInput: (title) => {
    set({ input: title })
  },
  fetchIsland: (title, videoId) => {
    fetch(`/api/songs?title=${title}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`response from /api/songs?title=${title}`, data)
        set((state) => {
          return ({
            videoOptions: data.videoSearch,
            song: data.island,
            videoSrc: videoId ? state.videoSrc : data.island.video.url,
            tabSrc: data.island.tab.url
          })
        })
      })
  },
  setVideoSrc: (url) => {
    set({ videoSrc: url })
  },
  setTabSrc: (url) => {
    set({ tabSrc: url })
  }
}))

export { useSearchStore }
