import { VidioSourceType, TabSourceType } from '@/data/types'

const songs = [
  {
    title: "Can't Help Falling in Love",
    original_author: 'Elvis Presley',
    chords: [],
    tab: {
      url: "https://sanjoseukeclub.org/Song%20Book/I%20Can't%20Help%20Falling%20in%20Love%20With%20You%20(Key%20of%20C)%20v2%20web.pdf",
      source: TabSourceType.sanjoseukeclub
    },
    videos: [
      {
        source: VidioSourceType.youtube,
        url: 'https://www.youtube.com/embed/lxWLCu2_pMk'
      },
    ]
  }
]

export default songs
