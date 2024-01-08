import { NextResponse } from 'next/server'
import { getSongs, searchSong } from '@/data'
import youtubesearchapi from 'youtube-search-api'

// Request: /api/songs?name=andy
// Response: { message: 'Hello andy!' }
export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || ''
  const videoSearchLimit = searchParams.get('vlimit') || 25
  if (title) {
    // single song
    const data = searchSong(title)
    const videoSearchResult = await youtubesearchapi.GetListByKeyword(`${title} ukulele tutorial`, false, videoSearchLimit, [{ type: 'video' }])

    return NextResponse.json({
      island: data,
      videoSearch: videoSearchResult
    })
  } else {
    const data = getSongs()
    return NextResponse.json(data)
  }
}
