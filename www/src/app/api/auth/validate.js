// import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE

const client = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
})

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err)
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    }
  })
}

const validateAuthToken = (token) => {
  const options = {
    audience,
    issuer: `https://${auth0Domain}/`,
    algorithms: ['RS256']
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

export default validateAuthToken
