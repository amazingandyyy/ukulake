import { NextResponse } from 'next/server'
import youtubesearchapi from 'youtube-search-api'
import axios from 'axios'
import _ from 'lodash'

async function searchSong (source, title) {
  try {
    const res = await axios.get(`https://amazingandyyy.com/ukulake/${source}/songs.json`)
    const songs = res.data
    return _.find(songs, {
      source,
      title
    })
  } catch (e) {
    console.error(e.message)
  }
}
// Request: /api/songs?name=andy
// Response: { message: 'Hello andy!' }
export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || ''
  const title = searchParams.get('title') || ''
  const videoSearchLimit = searchParams.get('vlimit') || 25
  if (title) {
    // single song
    const song = await searchSong(source, title)
    const videoSearchResult = await youtubesearchapi.GetListByKeyword(`${title} ukulele tutorial`, false, videoSearchLimit, [{ type: 'video' }])

    return NextResponse.json({
      song,
      videoSearch: videoSearchResult
    })
  }
}
