'use client'

import { useEffect, useState } from 'react'

export default function Songs () {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/songs')
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [])
  if (!data) return <p className='text-center m-8'>Loading...</p>

  return (
    <div>{
    data.map(song => {
      return (
        <div key={song.title}>
          <a href={`/song/${encodeURIComponent(song.title)}`}>{song.title}</a>
        </div>
      )
    })
}
    </div>
  )
}
