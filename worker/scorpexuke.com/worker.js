const axios = require('axios')
const cheerio = require('cheerio')
const async = require('async')
const fs = require('fs')
const { logger } = require('../utils')

const { writeJsonToFileForce, absolutePath } = require('../utils')

const songs = []

const q = async.queue(function (task, callback) {
  const { url, source, title, labels, artist, musicalKey } = task
  logger.log('info', '📧 recieved', task)

  axios.get(url)
    .then(content => {
      const i = cheerio.load(content.data)
      const originalSrc = i('#su-stats a').attr('href')
      if (!originalSrc) {
        logger.info(`😮 originalSrc not found for ${url}`, originalSrc)

        return callback()
      }
      const fileName = originalSrc.replace('/https://scorpexuke.com/allpdfs/', '').replace('.pdf', '').trim()
      logger.info(`✅ found target ${originalSrc}`)
      if (url && title) {
        const d = {
          tabSrc: `https://amazingandyyy.com/ukulake/${source}/info/${fileName}.pdf`,
          source,
          originalSrc,
          title,
          labels,
          additionalData: {
            artist,
            musicalKey
            // numberOfChords
          }
        }
        if (artist) d.additionalData.artist = artist
        if (musicalKey) d.additionalData.musicalKey = musicalKey
        writeJsonToFileForce(absolutePath(`docs/${source}/info/${title}.json`), d, { silent: true })
      } else {
        logger.warn(`something is missing, url:${url} , title:${title}, artist:${artist}, musicalKey:${musicalKey}`)
      }

      callback() // Call the callback to indicate the task completion
    })
    .catch(e => {
      q.push(task)
      logger.error(`Error processing task: ${e.message}, will re-try`)
    })
}, 1)
async function scrape (website) {
  // resetFile(absolutePath(`docs/${source}/songs.json`))
  // resetFile(absolutePath(`docs/${source}/stats.json`))
  // resetFile(absolutePath(`docs/${source}/tabs`))

  const u = new URL(website)
  const source = u.host

  const content = await axios.get(website)
  const $ = cheerio.load(content.data)
  $('[itemtype="http://schema.org/MusicComposition"]').each((index, el) => {
    // if(index > 10) return;
    const labels = ['scorpexuke']
    const url = $(el).find('a').attr('href')
    const title = $(el).find('span[itemprop="name"]').text()
    const artist = $(el).find('span[itemprop="creator"]').text()
    const musicalKey = $(el).find('span[itemprop="musicalKey"]').text()

    const filePath = absolutePath(`docs/${source}/info/${title}.json`)
    if (!fs.existsSync(filePath)) {
      q.push({ title, artist, musicalKey, labels, url, source })
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
    await scrape('https://scorpexuke.com/songs')
  } catch (e) {
    logger.error(`Scraping error: ${e.message}`)
  }
}

main()

// ./scripts/tabs-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
// for (( i=0; i<=20; i++)); do sh -c './scripts/tabs-downloader.sh docs/scorpexuke.com/tabs docs/scorpexuke.com/library' $i ;sleep 120; done
