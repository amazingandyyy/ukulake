import _ from 'lodash'
import songs from '@/data/songs'

function getSongs() {
	return songs;
}
function searchSong(song_title) {
	return _.find(songs, {
		title: song_title
	});
}

export {
	getSongs,
	searchSong
}