const axios = require('axios')
const cheerio = require('cheerio')
const async = require('async')
const fs = require('fs')
const { logger } = require('../utils')

const { writeJsonToFileForce, absolutePath } = require('../utils')

const songs = []

const q = async.queue(function (task, callback) {
  const { url, source, title, labels, artist } = task
  logger.log('info', '📧 recieved', task)
  const originalSrc = `https://www.marlowuke.co.uk/${url}`
  if (url && title) {
    const d = {
      tabSrc: `https://amazingandyyy.com/ukulake/${source}/library/${title}.pdf`,
      source,
      originalSrc,
      title,
      labels,
      additionalData: {}
    }
    if (artist) d.additionalData.artist = artist
    writeJsonToFileForce(absolutePath(`docs/${source}/info/${title}.json`), d, { silent: true })
  } else {
    logger.log('warn', '📧 something is missing', task)
  }

  callback() // Call the callback to indicate the task completion
}, 1)
async function scrape (website) {
  // resetFile(absolutePath(`docs/${source}/songs.json`))
  // resetFile(absolutePath(`docs/${source}/stats.json`))
  // resetFile(absolutePath(`docs/${source}/tabs`))

  const u = new URL(website)
  const source = u.host

  const content = await axios.get(website)
  const $ = cheerio.load(content.data)
  $('tr').each((index, el) => {
    // if(index > 10) return;
    const labels = ['marlowuke']
    const url = $(el).find('td:nth-child(1)>a').attr('href')
    const title = $(el).find('td:nth-child(1)>a').text()
    const artist = $(el).find('td:nth-child(2)').text()

    const filePath = absolutePath(`docs/${source}/info/${title}.json`)
    if (!fs.existsSync(filePath)) {
      q.push({ title, artist, labels, url, source })
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
    await scrape('https://www.marlowuke.co.uk/songindex.html')
  } catch (e) {
    logger.error(`Scraping error: ${e.message}`)
  }
}

main()

// ./scripts/tabs-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
// for (( i=0; i<=20; i++)); do sh -c './scripts/tabs-downloader.sh docs/scorpexuke.com/tabs docs/scorpexuke.com/library' $i ;sleep 120; done
