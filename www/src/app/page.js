'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
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

export default function Songs () {
  const [result, setResult] = useState(null)
  const [searchTerms, setSearchTerms] = useState('')
  const inputRef = useRef(null)

  const debounceSearch = debounce((q) => {
    if (q.length > 2) {
      setResult(null)
      fetch(`/api/search?q=${q}`)
        .then((res) => res.json())
        .then((data) => {
          setResult(data)
        })
    }
  }, 200)

  useEffect(() => {
    debounceSearch(searchTerms)
  }, [searchTerms])

  const searchOnClick = useCallback((v) => {
    setSearchTerms(v)
    inputRef.current.focus()
  })

  return (
    <div className='flex flex-col h-screen items-center'>
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
            className='text-lg text-center w-full max-w-md p-4 rounded-full bg-white shadow-2xl shadow-gray-400 focus:shadow-none m-1 focus:outline-none ring-2 focus:ring-teal-600 ring-gray-300'
            type='text'
            ref={inputRef}
            placeholder='Search Songs in the Ukulake'
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />
          {searchTerms && (
            <div onClick={() => searchOnClick('')} disabled={Boolean(!searchTerms)} className='inline-block p-1 px-[10px] hover:bg-teal-700 text-[10px] font-semibold rounded-full shadow-2xl bg-teal-600 active:bg-teal-600 m-1 focus:ring-2 text-white select-none active:outline-none cursor-pointer'>
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
