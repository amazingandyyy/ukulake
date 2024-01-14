'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import _ from 'lodash'

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
  const [data, setData] = useState(null)
  const [searchTerms, setSearchTerms] = useState('')

  useEffect(() => {
    if (!data) {
      fetch('https://amazingandyyy.com/ukulake/index.json')
        .then((res) => res.json())
        .then((data) => {
          const d = data.sort((a, b) => (a.title.replace(/[^a-zA-Z]+/g, '') > b.title.replace(/[^a-zA-Z0-9]+/g, '')) ? 1 : ((b.title.replace(/[^a-zA-Z0-9]+/g, '') > a.title.replace(/[^a-zA-Z0-9]+/g, '')) ? -1 : 0))
          setData(_.uniqBy(d, 'title'))
        })
    }
  }, [])

  const search = useCallback((v) => {
    setSearchTerms(v)
  })

  useEffect(() => {
    if (!data) return
    if (!searchTerms) return
    const d = data.sort((a, b) => (a.title.replace(/[^a-zA-Z]+/g, '') > b.title.replace(/[^a-zA-Z0-9]+/g, '')) ? 1 : ((b.title.replace(/[^a-zA-Z0-9]+/g, '') > a.title.replace(/[^a-zA-Z0-9]+/g, '')) ? -1 : 0))
    setData(_.uniqBy(d, 'title'))
  }, [searchTerms])

  if (!data) {
    return (
      <div className='text-center m-8 py-60'>
        <div className='animate-bounce hover:opacity-70 font-semibold text-2xl'>
          <span className='bg-teal-600 text-white rounded-lg'>˙ᵕ˙</span>
          <span className='pl-1 text-gray-900'>Ukulake</span>
        </div>
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen items-center'>
      <div className='flex col-span-3 h-12 md:h-16 p-2 md:p-4 flex-row items-center justify-between'>
        <Link href='/'>
          <div className='hover:opacity-70 font-semibold text-2xl'>
            <span className='bg-teal-600 text-white rounded-lg'>˙ᵕ˙</span>
            <span className='pl-1 text-gray-900'>Ukulake</span>
            <span className='pl-1 text-gray-900 font-light'>Harbor</span>
          </div>
        </Link>
        {/* <div className='ml-2 flex-1 p-2 rounded-xl bg-gray-100 m-1 flex items-center'> */}
        {/*  /!* logo *!/ */}
        {/*  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'> */}
        {/*    <path d='M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z' /> */}
        {/*    <path */}
        {/*      fillRule='evenodd' */}
        {/*      d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z' */}
        {/*      clipRule='evenodd' */}
        {/*    /> */}
        {/*  </svg> */}
        {/* </div> */}
      </div>
      <div className='flex py-12 px-2 w-full flex-col items-center justify-stretch'>
        <input
          className='text-xl text-center w-full max-w-sm p-2 md:p-4 rounded-lg bg-gray-100 m-1 focus:outline-none focus:ring-2 focus:ring-teal-600'
          type='text'
          placeholder='Type song name to search for islands'
          value={searchTerms}
          onChange={(e) => search(e.target.value)}
        />
        {/* {searchTerms && ( */}
        <button onClick={() => search('')} disabled={Boolean(!searchTerms)} className='w-64 md:w-96 p-2 text-sm rounded-lg bg-gray-100 m-1 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-white disabled:text-white select-none'>
          Reset
        </button>
        {/* )} */}
      </div>

      {/* show top 20 beginner friendly songs */}
      <div className='flex flex-col items-center justify-center'>
        <span className='text-sm text-gray-500'>Recommendation from ChatGPT</span>
      </div>
      <div className='flex flex-row items-center justify-center pb-12'>
        {suggestSongs.map((list, index) => {
          return (
            <div className='p-2' key={index}>
              <div className='font-medium'>
                {list.title}
              </div>
              {list.songs.map(song => (
                <div key={song} onClick={(e) => search(e.target.innerText)} className='hover:text-teal-800 text-gray-70 cursor-pointer'>
                  <span className='text-md opacity-80 block'>{song}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* show result counts */}
      <div className='flex flex-col items-center justify-center'>
        <span className='text-sm text-gray-500'>{data.filter(song => song.title.toLowerCase().includes(searchTerms.toLowerCase())).length} islands</span>
      </div>

      <div className='grid grid-cols-3 grow-rows-8 md:grid-rows-4 p-2 md:p-4 gap-1'>
        {
          data.filter(song => song.title.toLowerCase().includes(searchTerms.toLowerCase())).map(song => {
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
}
