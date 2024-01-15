import { NextResponse } from 'next/server'
import axios from 'axios'

export const config = {
  api: {
    bodyParser: {
      enable: true,
      sizeLimit: '1mb'
    }
  }
}
// Request: /api/auth {accessToken='xxx'}
// Response: { message: 'Hello andy!' }
export async function POST (req) {
  // parse request body in nextjs
  const body = await req.json()
  console.log(body)
  const accessToken = body.accessToken || ''
  if (!accessToken) return NextResponse.json({ status: 500, body: { message: 'No access token' } })
  axios('https://www.googleapis.com/auth/userinfo.email', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((res) => {
    console.log(res)
    return NextResponse.json(res.data)
  })
    .catch(e => {
      console.log(e.message)
      console.log(e.message)
    })
}
