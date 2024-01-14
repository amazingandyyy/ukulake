'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchStore } from '@/stores'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Page ({ params }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const videoKey = searchParams.get('v')
  const source = searchParams.get('s')

  const title = useSearchStore(state => state.input)
  const videoOptions = useSearchStore(state => state.videoOptions)
  const setTitle = (value) => useSearchStore.getState().updateInput(value)
  const tabSrc = useSearchStore(state => state.tabSrc)
  const setTabSrc = (url) => useSearchStore.getState().setTabSrc(url)
  const videoSrc = useSearchStore(state => state.videoSrc)
  const setVideoSrc = (url) => useSearchStore.getState().setVideoSrc(url)

  const [settingActivated, setSettingActivated] = useState(false)

  const createQueryString = useCallback((name, value) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  },
  [searchParams]
  )

  useEffect(() => {
    setVideoSrc(`https://www.youtube.com/watch?v=${videoKey}`)
  }, [videoKey])

  useEffect(() => {
    setTitle(decodeURIComponent(params.songTitle))
  }, [params])

  function changeVideoSrc (youtubeId) {
    setVideoSrc(`https://www.youtube.com/watch?v=${youtubeId}`)
    router.push(`${pathname}?${createQueryString('v', youtubeId)}`)
    setSettingActivated(false)
  }

  function transformVideoSrc (url) {
    if (url.includes('youtube.com/embed/')) {
      return url
    }
    if (url.includes('youtube.com/watch') && url.includes('v=')) {
      const u = new URL(url)
      const token = u.searchParams.get('v')
      return `https://youtube.com/embed/${token}`
    }
    return 'https://youtube.com/embed/'
  }

  useEffect(() => {
    if (title) useSearchStore.getState().fetchIsland(source, title, videoKey)
  }, [title, videoKey])
  return (
    <div className='flex flex-col h-screen'>
      <div
        className={`fixed right-0 md:right-16 top-12 md:top-12 bg-white shadow-2xl border-2 border-gray-300 p-4 rounded-xl w-full md:w-[500px] ${settingActivated ? 'block' : 'hidden'}`}
      >
        <div className='w-full'>
          <div className='pl-1 font-semibold text-sm'>Song resources</div>
          <div className='rounded-xl mb-2 overflow-y-scroll block h-[600px]'>
            {videoOptions?.items?.map(videoOption => (
              <div
                key={videoOption.id} onClick={() => changeVideoSrc(videoOption.id)}
                className={`${(videoOption.id === videoKey) && 'border-teal-700 opacity-80'} w-full border-4 hover:border-teal-500 hover:opacity-80 cursor-pointer inline-block rounded-xl overflow-hidden mr-1 relative`}
              >
                <img src={videoOption.thumbnail.thumbnails[0].url} className='w-full h-full' />
                <span
                  className='bg-gray-100 bg-opacity-90 absolute left-1 top-1 p-0 text-black font-bold text-[12px] px-1 rounded-lg'
                >{videoOption.channelTitle}
                </span>
                <span
                  className='bg-gray-800 bg-opacity-80 absolute right-1 top-1 p-0 text-white text-[12px] px-1 rounded-2xl'
                >{videoOption.length.simpleText}
                </span>
                <span className='pl-1 text-sm font-semibold'>{videoOption.title}</span>
              </div>
            )
            )}
          </div>
          or search on <a className='font-bold text-red-600 hover:text-red-500' rel='noreferrer' target='_blank' href={`https://www.google.com/search?igu=1&q="${title.split(' ').join('+')}"+"ukulele"+tutorial+site:youtube.com`}>Youtube</a>
          <input
            onChange={(e) => setVideoSrc(e.target.value)} className='bg-gray-100 p-2 px-4 rounded-xl mt-1 w-full'
            value={videoSrc}
          />
        </div>
        <div className='w-full pt-2'>
          <div className='pl-1'><span className='font-bold'>Tab resources</span> or search PDF on <a className='text-blue-500 hover:text-blue-600 font-bold' rel='noreferrer' target='_blank' href={`https://www.google.com/search?igu=1&q=${title.split(' ').join('+')}+ukulele+chords+tabs+filetype:pdf`}>Google</a>
          </div>
          <input
            onChange={(e) => setTabSrc(e.target.value)} className='bg-gray-100 p-2 px-4 rounded-xl mt-1 w-full'
            value={tabSrc}
          />
        </div>
      </div>
      <div className='flex bg-white shadow-sm col-span-3 h-12 md:h-16 p-2 md:p-4 flex-row items-center justify-between'>
        <Link href='/'>
          <div className='hover:opacity-70 self-start font-semibold text-2xl'>
            <span className='bg-teal-600 text-white rounded-lg'>˙ᵕ˙</span>
            <span className='pl-1 text-gray-900 inline-block'>Ukulake</span>
            <span className='pl-1 hidden md:inline-block text-gray-900 font-light'>Island</span>
          </div>
        </Link>
        <div className='ml-2 flex-1 p-2 rounded-xl m-1 items-center font-bold hidden md:flex'>
          {/* music */}
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
            <path fillRule='evenodd' d='M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z' clipRule='evenodd' />
          </svg>
          <div
            // onChange={(e) => setTitle(e.target.value)}
            className='ml-1 px-2 rounded-md w-full'
          >{title}
          </div>
        </div>
        <div className='flex'>
          <div
            onClick={() => setSettingActivated(!settingActivated)}
            className={`rounded-xl p-2 bg-gray-100 m-1 hover:bg-teal-600 hover:text-white cursor-pointer ${settingActivated ? 'bg-teal-500 text-white' : ''}`}
          >
            {/* setting icon */}
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
              <path d='M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z' />
            </svg>
          </div>
          {/* <div */}
          {/*  className='rounded-xl p-2 bg-gray-100 m-1 hover:bg-teal-500 hover:text-white cursor-pointer flex items-center' */}
          {/* > */}
          {/*  /!* pdf icon *!/ */}
          {/*  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> */}
          {/*    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" /> */}
          {/*    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /> */}
          {/*  </svg> */}
          {/* </div> */}
        </div>
      </div>
      <div className='grid grid-cols-3 grid-container grow-rows-8 md:grid-rows-4 p-2 md:p-4'>
        <div className='col-span-3 md:col-span-1 row-span-2 md:row-span-4 rounded-xl'>
          <iframe
            src={`${transformVideoSrc(videoSrc)}?start=0`} width='100%' height='100%'
            className='rounded-xl shadow-xl' frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen
          />
        </div>
        <div className='col-span-3 md:col-span-2 row-span-6 md:row-span-4 pt-2 md:pt-0 md:pl-4'>
          {tabSrc && <iframe
            className='rounded-xl shadow-xl' width='100%' height='100%'
            src={`${tabSrc}#view=FitH&navpanes=0&toolbar=0&statusbar=0&messages=0`}
                     />}
        </div>
      </div>
    </div>
  )
}
