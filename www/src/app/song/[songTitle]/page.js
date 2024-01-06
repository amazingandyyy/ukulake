'use client'

import { useEffect, useState } from 'react'
import {useSearchStore} from "@/stores";

export default function Page ({ params }) {
  const title = useSearchStore(state => state.input)
  const setTitle = (value) => useSearchStore.getState().updateInput(value)
  const song = useSearchStore(state => state.song)
  const tabSrc = useSearchStore(state => state.tabSrc)
  const setTabSrc = (url) => useSearchStore.getState().setTabSrc(url)
  const videoSrc = useSearchStore(state => state.videoSrc)
  const setVideoSrc = (url) => useSearchStore.getState().setVideoSrc(url)

  const [settingActivated, setSettingActivated] = useState(false)

  useEffect(() => {
    setTitle(decodeURIComponent(params.songTitle))
  }, [params])

  function transformVideoSrc (url) {
    if (url.includes('www.youtube.com/embed/')) {
      return url
    }
    if (url.includes('www.youtube.com/watch') && url.includes('v=')) {
      const u = new URL(url)
      const token = u.searchParams.get('v')
      return `https://www.youtube.com/embed/${token}`
    }
    return 'https://www.youtube.com/embed/'
  }
  useEffect(() => {
    if (title) useSearchStore.getState().updateInput(title)
  }, [title])
  if (!song) return <p className='text-center m-8' />
  return (
    <div className='flex flex-col h-screen'>
      <div className={`fixed right-0 md:right-2 top-12 md:top-16 bg-white shadow-2xl border-2 border-gray-300 p-4 rounded-xl w-full md:w-96 ${settingActivated ? 'block' : 'hidden'}`}>
        <div className='w-full'>
          <div className='pl-1 font-semibold text-sm'>Song resources (<a className='text-teal-800 hover:text-teal-600' rel='noreferrer' target='_blank' href={`https://www.google.com/search?igu=1&q="${title.split(' ').join('+')}"+"ukulele"+tutorial+site:youtube.com`}>Youtube</a> URL)</div>
          <input onChange={(e) => setVideoSrc(e.target.value)} className='bg-gray-100 p-2 px-4 rounded-xl mt-1 w-full' value={videoSrc} />
        </div>
        <div className='w-full pt-2'>
          <div className='pl-1 font-semibold text-sm'>Tab resources (<a className='text-teal-800 hover:text-teal-600' rel='noreferrer' target='_blank' href={`https://www.google.com/search?igu=1&q=${title.split(' ').join('+')}+ukulele+chords+tabs+filetype:pdf`}>PDF</a> URL)</div>
          <input onChange={(e) => setTabSrc(e.target.value)} className='bg-gray-100 p-2 px-4 rounded-xl mt-1 w-full' value={tabSrc} />
        </div>
      </div>
      <div className='flex bg-white shadow-sm col-span-3 h-12 md:h-16 p-2 md:p-4 flex-row items-center justify-between'>
        <a href='/'>
          <div className='hover:opacity-70 self-start font-semibold text-2xl'>
            <span className='bg-teal-600 text-white rounded-lg'>˙ᵕ˙</span>
            <span className='pl-1 text-gray-900'>Ukulake</span>
          </div>
        </a>
        <div className='ml-2 flex-1 p-2 rounded-xl bg-gray-100 m-1 flex items-center cursor-pointer'>
          {/* logo */}
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
            <path d='M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z' />
            <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z' clipRule='evenodd' />
          </svg>
          <input onChange={(e) => setTitle(e.target.value)} className='ml-1 px-2 rounded-md w-full bg-gray-100 hover:bg-gray-200 border-none outline-0' value={title} />
        </div>
        <div className='flex'>
          <div onClick={() => setSettingActivated(!settingActivated)} className={`rounded-xl p-2 bg-gray-100 m-1 hover:bg-teal-600 hover:text-white cursor-pointer ${settingActivated ? 'bg-teal-500 text-white' : ''}`}>
            {/* setting icon */}
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
              <path fillRule='evenodd' d='M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z' clipRule='evenodd' />
            </svg>
          </div>
          <div className='rounded-xl p-2 bg-gray-100 m-1 hover:bg-teal-500 hover:text-white cursor-pointer flex items-center'>
            {/* sharing icon */}
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5'>
              <path d='M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.475l6.733-3.366A2.52 2.52 0 0 1 13 4.5Z' />
            </svg>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 grid-container grow-rows-8 md:grid-rows-4 p-2 md:p-4'>
        <div className='col-span-3 md:col-span-1 row-span-2 md:row-span-4 rounded-xl'>
          <iframe src={`${transformVideoSrc(videoSrc)}?start=0`} width='100%' height='100%' className='rounded-xl shadow-xl' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        </div>
        <div className='col-span-3 md:col-span-2 row-span-6 md:row-span-4 pt-2 md:pt-0 md:pl-4'>
          {tabSrc && <iframe className='rounded-xl shadow-xl' width='100%' height='100%'
                   src={`${tabSrc}#view=FitH&navpanes=0&toolbar=0&statusbar=0&messages=0`}/>}
        </div>
      </div>
    </div>
  )
}
