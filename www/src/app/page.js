'use client'

import {getSongs} from './data'
export default function Home () {
  return (<div>{
    getSongs().map(song=>(<div>
      <a href={`/song/${encodeURIComponent(song.title)}`}>{song.title}</a>
    </div>))
  }</div>)
}
