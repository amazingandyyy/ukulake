'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { debounce } from 'lodash'

const suggestSongs = [
  {
    title: '',
    songs: [
      'Somewhere Over the Rainbow',
      'Riptide',
      "I'm Yours",
      'Hallelujah',
      "Can't Help Falling in Love",
      'Count on Me',
      'What a Wonderful World',
      'Stand by Me',
      'Hey Soul Sister',
      'You Are My Sunshine'
    ]
  },
  {
    title: '',
    songs: [
      'Love Me Do',
      'Three Little Birds',
      'Wagon Wheel',
      'I Shot the Sheriff',
      "I'm a Believer",
      'Perfect',
      'All Along the Watchtower',
      'Imagine',
      'Leaving on a Jet Plane',
      "Blowin' in the Wind"
    ]
  },
  {
    title: '',
    songs: [
      "What's Up",
      'Brown Eyed Girl',
      "Ain't No Sunshine",
      'I Will Survive',
      'Hey Jude',
      'Ho Hey',
      'Blue Suede Shoes',
      'No Woman, No Cry',
      'I Can See Clearly Now',
      'A Thousand Years'
    ]
  },
  {
    title: '',
    songs: [
      'Jambalaya',
      "Knockin' on Heaven's Door",
      'Sweet Caroline',
      'Achy Breaky Heart',
      'Country Roads',
      'Twist and Shout',
      'I Just Called to Say I Love You',
      "Can't Buy Me Love",
      'Every Breath You Take',
      'Twinkle, Twinkle, Little Star'
    ]
  }
]

function Login () {
  const [activeUser, setActiveUser] = useState({})
  const { loginWithPopup, isAuthenticated, user, isLoading, logout, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      setActiveUser(user)
    }
  }, [isAuthenticated, user])

  const login = useCallback(() => {
    loginWithPopup()
  //   {
  //     "given_name": "Andy",
  //     "family_name": "Chen",
  //     "nickname": "amazingandyyy",
  //     "name": "Andy Chen",
  //     "picture": "https://lh3.googleusercontent.com/a/ACg8ocLOoM3eltyDURQ7pTELTKH3WSoyWZR_IUzyhu5ACwRnfTtg=s96-c",
  //     "locale": "en",
  //     "updated_at": "2024-01-15T06:12:14.728Z",
  //     "email": "amazingandyyy@gmail.com",
  //     "email_verified": true,
  //     "sub": "google-oauth2|114293888354521281311"
  // }
    // axios.get('/api/auth')
    //   .then((res) => {
    //     console.log(res)
    //   })
  })

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: 'read:current_user'
        })
        if (accessToken && user?.sub) {
          const metadataResponse = await axios('/api/auth', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })

          const response = metadataResponse.data

          console.log(response)
        }
      } catch (e) {
        console.log('error getAccessTokenSilently', e.message)
      }
    }

    getUserMetadata()
  }, [getAccessTokenSilently, user?.sub])

  const renderLogin = useCallback(() => {
    if (isLoading) {
      return (
        <div onClick={login} className='p-2 hover:bg-gray-100 rounded-xl border-2 shadow-lg border-gray-300 active:text-teal-600 active:bg-teal-400 active:bg-opacity-10 active:border-teal-600'>
          <svg aria-hidden='true' className='w-5 h-5 animate-spin fill-gray-200' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
            <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
          </svg>
        </div>
      )
    }
    if (isAuthenticated) {
      return (
        <div onClick={() => logout({ logoutParams: { returnTo: process.env.NEXT_PUBLIC_BASE_URL } })} className='p-2 hover:bg-gray-100 rounded-xl border-2 shadow-lg border-gray-300 active:text-teal-600 active:bg-teal-400 active:bg-opacity-10 active:border-teal-600'>
          <div className='flex flex-row items-center'>
            <img className='w-6 h-6 rounded-full' src={activeUser?.picture} />
            <span className='pl-2 font-semibold text-gray-900'>{activeUser?.nickname}</span>
          </div>
        </div>
      )
    } else {
      return (
        <div onClick={login} className='p-2 hover:bg-gray-100 rounded-xl border-2 shadow-lg border-gray-300 active:text-teal-600 active:bg-teal-400 active:bg-opacity-10 active:border-teal-600'>
          <div className='flex flex-row items-center animate-pulse'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5'>
              <path d='M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z' />
            </svg>
          </div>
        </div>
      )
    }
  })

  return (
    <div>
      {renderLogin()}
    </div>
  )
}

export default function Songs () {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchTermUrl = searchParams.get('q')

  const [result, setResult] = useState(null)
  const [searchTerms, setSearchTerms] = useState('')
  const inputRef = useRef(null)

  const createQueryString = useCallback((name, value) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  },
  [searchParams]
  )

  const debounceSearch = debounce((q) => {
    if (q.length > 2) {
      setResult(null)
      fetch(`/api/search?q=${q}`)
        .then((res) => res.json())
        .then((data) => {
          setResult(data)
          router.push(`${pathname}?${createQueryString('q', q)}`)
        })
    }
  }, 200)

  useEffect(() => {
    if (searchTermUrl) {
      setSearchTerms(searchTermUrl)
    }
  }
  , [searchTermUrl])

  useEffect(() => {
    if (searchTerms !== searchTermUrl || !result) {
      debounceSearch(searchTerms)
    }
  }, [searchTerms])

  const searchOnClick = useCallback((v) => {
    setSearchTerms(v)
  })

  const resetSearch = useCallback(() => {
    setSearchTerms('')
    inputRef.current.focus()
    router.push('/')
  })

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_BASE_URL
      }}
    >
      <div className='flex flex-col w-screen h-screen items-center'>
        <div className='cursor-pointer flex bg-white shadow-none p-2 md:p-4 flex-row items-center justify-end w-full'>
          <Login />
        </div>
        <div className='flex flex-col items-center w-full pt-32'>
          <Link href='/'>
            <div className='font-semibold text-3xl'>
              <span className='bg-teal-600 text-white rounded-lg'>˙ᵕ˙</span>
              <span className='pl-1 text-gray-900'>Ukulake</span>
              <span className='pl-1 text-gray-900 font-light'>Harbor</span>
            </div>
          </Link>
          <div className='flex px-2 w-full flex-col items-center justify-stretch pt-6'>
            <input
              className={`text-lg text-center w-full max-w-md p-4 rounded-full bg-white shadow-2xl shadow-gray-400 focus:shadow-none m-1 focus:outline-none ring-2 focus:ring-teal-600 ring-gray-300 ${searchTerms ? 'ring-2 ring-teal-600 shadow-none' : ''}`}
              type='text'
              ref={inputRef}
              placeholder='Search Songs in the Ukulake'
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
            />
            {searchTerms && (
              <div onClick={() => resetSearch()} disabled={Boolean(!searchTerms)} className='inline-block p-1 px-[10px] hover:bg-teal-700 text-[10px] font-semibold rounded-full shadow-2xl bg-teal-600 active:bg-teal-600 m-1 focus:ring-2 text-white select-none active:outline-none cursor-pointer'>
                new search
              </div>
            )}
          </div>
        </div>

        {/* show top 20 beginner friendly songs */}
        {!searchTerms &&
          <div className='w-full max-w-4xl my-auto pt-16'>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-sm text-gray-400 pb-2'>Beginner friendly recommendations from ChatGPT</span>
            </div>
            <div className='flex flex-col md:flex-row w-full justify-center pb-12'>
              {suggestSongs.map((list, index) => {
                return (
                  <div className='p-2 w-full text-center md:text-left' key={index}>
                    <div className='font-medium'>
                      {list.title}
                    </div>
                    {list.songs.map(song => (
                      <div key={song} onClick={(e) => searchOnClick(e.target.innerText)} className='hover:text-teal-600 active:text-teal-700 text-gray-70 cursor-pointer'>
                        <span className='text-md opacity-80 block'>{song}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>}

        {searchTerms &&
    (result !== null
      ? (
        <div className='pt-12'>
          <div className='flex flex-col items-center justify-center'>
            <span className='text-sm text-gray-500'>{result.length} islands found</span>
          </div>
          <div className='grid grid-cols-3 grow-rows-8 md:grid-rows-4 p-2 md:p-4 gap-1'>
            {
            result.map(song => {
              return (
                <a href={`/island/${encodeURIComponent(song.title)}?s=${song.source}`} key={song.tabSrc} className='col-span-3 md:col-span-1 hover:opacity-70 rounded-md p-2 px-4 hover:text-teal-800 bg-gray-50'>
                  <span>{song.title}</span>
                  <span className='font-medium text-xs text-black opacity-30 block'>{song.source}</span>
                </a>
              )
            })
          }
          </div>
        </div>
        )
      : (
        <div className='text-center m-8'>
          <div className='animate-bounce hover:opacity-70 text-sm flex flex-row'>
            <img src='/icons/logo.svg' className='w-6 h-auto' />
            <span className='pl-1 text-gray-900'>searching</span>
          </div>
        </div>)
    )}
      </div>
    </Auth0Provider>
  )
}
