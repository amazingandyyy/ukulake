import { NextResponse } from 'next/server'
import { getSongs, searchSong } from '@/data'

// Request: /api/songs?name=andy
// Response: { message: 'Hello andy!' }
export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || ''
  if (title) {
    // single song
    const data = searchSong(title)
    return NextResponse.json(data)
  } else {
    const data = getSongs()
    return NextResponse.json(data)
  }
}
