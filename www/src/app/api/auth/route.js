import { NextResponse } from 'next/server'
import validateAuthToken from './validate'

// Request: /api/auth {accessToken='xxx'}
export async function GET (req, res) {
  // parse request body in nextjs
  try {
    const token = req.headers.get('Authorization').replace('Bearer ', '')
    console.log(token)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Missing Access Token' })
    }

    const decodedToken = await validateAuthToken(token)
    console.log('Decoded Token:', decodedToken)

    // Your logic for handling the authenticated request goes here

    NextResponse.json({ message: 'Hello from the private API!' })
  } catch (error) {
    console.error('Token Validation Error:', error.message)
    NextResponse.json({ error: 'Unauthorized - Invalid Access Token' })
  }
  NextResponse.json({ error: 'Unauthorized - Invalid Access Token' })
}
