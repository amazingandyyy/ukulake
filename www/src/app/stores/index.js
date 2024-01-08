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
  fetchIsland: (source, title, videoKey) => {
    const url = `/api/songs?title=${title}&source=${source}`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(`response from ${url}`, data)
        set((state) => {
          return ({
            videoOptions: data.videoSearch,
            song: data.song,
            videoSrc: videoKey ? `https://www.youtube.com/watch?v=${videoKey}` : `https://www.youtube.com/watch?v=${data.videoSearch.items[0].id}`,
            tabSrc: data.song.tabSrc
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
