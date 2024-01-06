import { VidioSourceType, TabSourceType } from '@/data/types'

const songs = [
  {
    title: "Can't Help Falling in Love",
    chords: [],
    tab: {
      url: "https://sanjoseukeclub.org/Song%20Book/I%20Can't%20Help%20Falling%20in%20Love%20With%20You%20(Key%20of%20C)%20v2%20web.pdf",
      source: TabSourceType.sanjoseukeclub
    },
    video: {
      url: 'https://www.youtube.com/watch?v=lxWLCu2_pMk',
      source: VidioSourceType.youtube
    }
  }
]

export default songs
