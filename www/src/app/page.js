'use client'

import { useEffect, useState } from 'react'

export default function Songs () {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('https://amazingandyyy.com/ukulake/sanjoseukeclub.org/songs.json')
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [])
  if (!data) return <p className='text-center m-8'>Loading...</p>

  return (
    <div className='flex flex-col h-screen items-center'>
      <div className='flex bg-white shadow-sm col-span-3 h-12 md:h-16 p-2 md:p-4 flex-row items-center justify-between'>
        <a href='/'>
          <div className='hover:opacity-70 font-semibold text-2xl'>
            <span className='bg-teal-600 text-white rounded-lg'>˙ᵕ˙</span>
            <span className='pl-1 text-gray-900'>Ukulake</span>
          </div>
        </a>
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
      <div className='grid grid-cols-3 grow-rows-8 md:grid-rows-4 p-2 md:p-4 gap-1'>
        {
          data.map(song => {
            return (
              <a href={`/island/${encodeURIComponent(song.title)}?s=${song.source}`} key={song.title} className='col-span-3 md:col-span-1 hover:opacity-70 bg-gray-50 rounded-md p-2 px-4 hover:text-teal-800'>
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
