import { NextResponse } from 'next/server'

// Request: /api?name=andy
// Response: { message: 'Hello andy!' }
export async function GET (request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'world'
  const data = { message: `Hello ${name}!` }

  return NextResponse.json(data)
}
