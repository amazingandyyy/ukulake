import { NextResponse } from 'next/server'
import _ from 'lodash'
import songs from '../../_data/index.json'

// Request: /api/search?q=andy
export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (q) {
    const d = songs.sort((a, b) => (a.title.replace(/[^a-zA-Z]+/g, '') > b.title.replace(/[^a-zA-Z0-9]+/g, '')) ? 1 : ((b.title.replace(/[^a-zA-Z0-9]+/g, '') > a.title.replace(/[^a-zA-Z0-9]+/g, '')) ? -1 : 0))
    const result = _.uniqBy(d, 'title').filter(song => song.title.toLowerCase().includes(q.toLowerCase()))
    return NextResponse.json(result)
  }
  return NextResponse.json([])
}
