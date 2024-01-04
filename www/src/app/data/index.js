import _ from 'lodash'
import songs from '@/data/songs'

function getSongs () {
  return songs
}
function searchSong (songTitle) {
  return _.find(songs, {
    title: songTitle
  })
}

export {
  getSongs,
  searchSong
}
