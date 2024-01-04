'use client'

import { useEffect, useState } from 'react'
export default function Page ({ params }) {
  const title = decodeURIComponent(params.songTitle)
  const [song, setSong] = useState(null)

  useEffect(() => {
    fetch(`/api/songs?title=${title}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data)
      })
  }, [title])
  if (!song) return <p className='text-center m-8'>Loading...</p>

  return <div>
    <div className='flex flex-col sm:flex-row h-screen'>
      <div className='w-dull sm:w-1/3 h-72 sm:h-full bg-gray-200'>
        <div className='h-full flex flex-col'>
          {song.videos.map(video => (<div className='flex-1 bg-gray-300' key={video.url}>
          <iframe width='100%' height='100%'
                  frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen
                  src={`${video.url}?start=813`}
          />
        </div>))
        }</div>
      </div>
      <div className='w-full sm:w-2/3 h-screen sm:h-full bg-gray-200'>
        <iframe width='100%' height='100%'
                src={`${song.tab.url}#view=FitH&navpanes=0&toolbar=0&statusbar=0&messages=0&`}
        />
      </div>
    </div>
    <div className='mx-auto flex justify-between px-4 text-xs'>
      <div className='flex-auto'>
        video resource: {song.videos[0].source} |
        <a className='pl-1' target='_blank' href={`https://www.youtube.com/search?q=${song.title.split(' ').join('+')}+official+video`}>
          official
        </a>
      </div>
      <div className='flex-auto text-center'>
        <a href='/'>Ukulake:</a>
        <span className='pl-1 font-bold'>{title}</span>
        <span className='pl-1'>by {song.original_author}</span>
      </div>
      <div className='flex-auto text-right'>
        tab resource: {song.tab.source}
      </div>
    </div>
  </div>
}
