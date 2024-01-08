import { NextResponse } from 'next/server'
import youtubesearchapi from 'youtube-search-api'
import _ from 'lodash'
import songs from '../../_data/index.json'

async function searchSong (source, title) {
  return _.find(songs, {
    source,
    title
  })
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
