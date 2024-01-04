"use client";

import {searchSong} from '@/data'
import {useState} from "react";
export default function Page({ params }) {
  const [hiddenVideos, setHiddenVideos] = useState([])
  const title = decodeURIComponent(params.song_title);
  const song = searchSong(title)

  function renderSongVideoButtonsClassName(hiddenVideo) {
    if(hiddenVideo) {
      return 'p-1 bg-gray-100 rounded cursor-pointer'
    }else{
      return 'p-1 bg-gray-100 rounded cursor-pointer'
    }
  }
  return <div>
    <div className='flex flex-col sm:flex-row h-screen'>
      <div className='w-dull sm:w-1/3 h-72 sm:h-full bg-gray-200'>
        <div className='h-full flex flex-col'>
          {song.tutorial_videos.map(video=>(<div className='flex-1 bg-gray-300'>
          <iframe width='100%' height='100%'
                  frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen
                  src={`${video.url}?start=813`}
          />
        </div>))
        }</div>
      </div>
      <div className='w-full sm:w-2/3 h-screen sm:h-full bg-gray-200'>
        <iframe width='100%' height='100%'
                src={`${song.tab.url}#view=FitV&navpanes=0`}
        />
      </div>
    </div>
    <div className='mx-auto flex justify-between px-4 text-xs'>
      <div className='flex-auto'>
        video resource: {song.tutorial_videos[0].source}
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
