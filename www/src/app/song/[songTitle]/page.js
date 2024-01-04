'use client'

import { useEffect, useState } from 'react'
export default function Page ({ params }) {
  const title = decodeURIComponent(params.songTitle)
  const [song, setSong] = useState(null)
  const [tabSrc, setTabSrc] = useState('')
  const [videoSrc, setVideoSrc] = useState('')

  useEffect(() => {
    fetch(`/api/songs?title=${title}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data)
        setTabSrc(`${data.tab.url}#view=FitH&navpanes=0&toolbar=0&statusbar=0&messages=0`)
        setVideoSrc(data.video.url)
      })
  }, [title])
  if (!song) return <p className='text-center m-8'></p>

  const handleVideoSearch = () => {
    setVideoSrc(`https://www.google.com/search?igu=1&q="${song.title.split(' ').join('+')}"+"ukulele"+tutorial`)
  }
  const handleTabSearch = () => {
    setTabSrc(`https://www.google.com/search?igu=1&q=${song.title.split(' ').join('+')}+"ukulele"+tabs+filetype:pdf`)
  }

  return <div>
    <div className='flex flex-col sm:flex-row h-screen'>
      <div className='w-dull sm:w-1/3 h-72 sm:h-full bg-black'>
        <div className='h-full flex flex-col'>
          <div className='flex-1 bg-black'>
            <iframe width='100%' height='100%'
                    frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen
                    src={`${videoSrc}?start=123`}
            />
        </div>
        </div>
      </div>
      <div className='w-full sm:w-2/3 h-screen sm:h-full bg-[#353535]'>
        <iframe width='100%' height='100%' src={tabSrc} />
      </div>
    </div>
    <div className='mx-auto flex justify-between px-4 text-xs'>
      <div className='flex-auto'>
        {song.tab.source} | <span className='cursor-pointer' onClick={() => handleVideoSearch()}>change tutorial</span>
      </div>
      <div className='flex-auto text-center'>
        <a href='/'>Ukulake:</a>
        <a className='pl-1 font-bold' target='_blank' href={`https://www.google.com/search?q=${song.title.split(' ').join('+')}+${song.original_author.split(' ').join('+')}+official+video`} rel="noreferrer">
          {title}
        </a>
        <span className='pl-1'>by {song.original_author}</span>
      </div>
      <div className='flex-auto text-right'>
        {song.tab.source} | <span className='cursor-pointer' onClick={() => handleTabSearch()}>change source</span>
      </div>
    </div>
  </div>
}
