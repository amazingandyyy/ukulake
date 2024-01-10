const axios = require('axios')
const cheerio = require('cheerio')
const async = require('async')
const fs = require('fs')
const querystring = require('node:querystring'); 
const { logger } = require('../utils')

const { writeJsonToFileForce, absolutePath } = require('../utils')

const songs = []

const q = async.queue(function (task, callback) {
  const { url, source, title, labels, additionalData } = task
  logger.log('info', '📧 recieved', task)
  // https://drive.google.com/open?id=1VsOhqgA9DNsBRVVPItLb8e0fU-9AmNVu
  if (url && title) {
    let gDriveKey = querystring.parse(url.split('?')[1])?.id
    if(!gDriveKey) {
      gDriveKey = url.replace('https://drive.google.com/file/d/', '')
    }
    if(!gDriveKey) {
      console.log(url, title, 'not found google drive link')
    }
    const originalSrc = `https://drive.google.com/uc?export=download&id=${gDriveKey}`
    const d = {
      tabSrc: `https://amazingandyyy.com/ukulake/${source}/library/${title}.pdf`,
      source,
      originalSrc,
      title,
      labels,
      additionalData
    }
    if (additionalData.artist) d.additionalData.artist = additionalData.artist
    writeJsonToFileForce(absolutePath(`docs/${source}/info/${title}.json`), d, { silent: true })
  } else {
    logger.log('warn', '📧 something is missing', task)
  }

  callback() // Call the callback to indicate the task completion
}, 1)
async function scrape (website) {
  const u = new URL(website)
  const source = u.host.replace('www.', '')

  const content = await axios.get(website)
  const $ = cheerio.load(content.data)
  $('tr').each((index, el) => {
    // if(index > 10) return;
    const labels = ['ukejams']
    const url = $(el).find('.column-1 a').attr('href')
    let tstr = $(el).find('.column-1 a').text().split('/')
    const title = tstr[0].trim()
    const artist = tstr[1]?.trim() || ''
    const genre = $(el).find('.column-2').text().trim()
    const audioUrl = $(el).find('.column-4 a').attr('href')
    const videoUrl = $(el).find('.column-5 a').attr('href')
    const numberOfChords = $(el).find('.column-5').attr('href')

    const filePath = absolutePath(`docs/${source}/info/${title}.json`)
    if (!fs.existsSync(filePath)) {
      q.push({ title, labels, url, source, additionalData:{ genre, audioUrl, artist, videoUrl, numberOfChords} })
    } else {
      logger.info(`✅ ${title} already processed; skipped`)
    }
  })

  q.drain = function () {
    writeJsonToFileForce(absolutePath(`docs/${source}/stats.json`), {
      site: source,
      totalSongs: songs.length
    })
    logger.info(`ADDED ${songs.length} songs`)
  }
}

async function main () {
  try {
    await scrape('https://ukejams.com/songs')
  } catch (e) {
    logger.error(`Scraping error: ${e.message}`)
  }
}

main()

// ./scripts/tabs-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
// for (( i=0; i<=20; i++)); do sh -c './scripts/tabs-downloader.sh docs/scorpexuke.com/tabs docs/scorpexuke.com/library' $i ;sleep 120; done
