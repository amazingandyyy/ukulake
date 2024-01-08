const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const { writeJsonToFileForce, writeToFileForce, absolutePath } = require('../../utils')

async function scrape (website) {
  const u = new URL(website)
  const source = u.host
  return new Promise(async (resolve, reject)=>{
    const content = await axios.get(website)
    const $ = cheerio.load(content.data)
    const songs = []
    let tabs = ''

    $('center table').each((index, table) => {
      let labels = ['sjuc']
      if(index === 0) {
      }
      else if(index === 1) {
        labels.push('holiday')
      }
      $(table).find('p').each((index, p) => {
        const href = $(p).find('a').attr('href')
        const fileName = path.basename(decodeURIComponent(href))
        let concatenatedText = ''
        $(p).find('span').each((index, span) => {
          const text = $(span).text()
          if(!concatenatedText.includes(text)) {
            concatenatedText += text
          }
        })
        const cleanedDisplayText = concatenatedText.replace(/\s+/g, ' ').trim()

        // Pushing data to the array
        if (fileName !== 'undefined' && cleanedDisplayText && href) {
          const originalSrc = `https://sanjoseukeclub.org/${href}`
          songs.push({
            tabSrc: `https://amazingandyyy.com/ukulake/${source}/library/${fileName}`,
            source: source,
            originalSrc,
            title: cleanedDisplayText,
            labels,
            additionalData: {}
          })

          tabs += `${originalSrc}\n`
        }
      })
    })

    const stats = {
      site: source,
      totalSongs: songs.length
    }

    // Displaying the result as JSON
    writeJsonToFileForce(absolutePath(`docs/${source}/songs.json`), songs)
    writeJsonToFileForce(absolutePath(`docs/${source}/stats.json`), stats)
    writeToFileForce(absolutePath(`docs/${source}/tabs`), tabs)
  })
}

async function main() {
  await scrape('https://sanjoseukeclub.org/song_book.html')
}

main()
// ./scripts/links-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
