'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
// import axios from 'axios'
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
  const login = useCallback((e) => {
    console.log('hello', e)
  })

  return (
    <div className='p-2'>
      <svg onClick={login} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5'>
        <path d='M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z' />
      </svg>
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
    // inputRef.current.focus()
  })

  const resetSearch = useCallback(() => {
    setSearchTerms('')
    inputRef.current.focus()
    router.push('/')
  })

  return (
    <div className='flex flex-col w-screen h-screen items-center'>
      <div className='hidden cursor-pointer flex bg-white shadow-none h-12 md:h-16 p-2 md:p-4 flex-row items-center justify-end w-full'>
        <Login />
      </div>
      <div className='flex flex-col items-center w-full pt-48'>
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
        <div className='w-full max-w-4xl my-auto pt-12'>
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
  )
}
