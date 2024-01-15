const axios = require('axios')
const cheerio = require('cheerio')
const async = require('async')
const fs = require('fs')
const { logger } = require('../utils')

const { writeJsonToFileForce, absolutePath } = require('../utils')

let totalSongs = 0

const q = async.queue(function (task, callback) {
  const { url, source, title, labels, artist, beginnerFriendly } = task
  logger.log('info', '📧 recieved', task)
  let originalSrc = `https://www.${source}${url}`
  if (url.includes('.pdf')) {
    originalSrc = `https://www.${source}/${url}`
  }
  if (url && title) {
    const d = {
      tabSrc: `https://amazingandyyy.com/ukulake/${source}/library/${title}.pdf`,
      source,
      originalSrc,
      title,
      labels,
      additionalData: {}
    }
    if (beginnerFriendly) {
      d.additionalData.beginnerFriendly = true
    }
    if (artist.includes('(') && artist.includes(')')) {
      d.additionalData.artist = artist.replace('(', '').replace(')', '')
    }
    totalSongs++
    writeJsonToFileForce(absolutePath(`docs/${source}/info/${title}.json`), d, { silent: true })
  } else {
    logger.log('warn', '📧 something is missing', task)
  }

  callback() // Call the callback to indicate the task completion
}, 1)
// q.drain(() => {
//   console.log('all items have been processed');
//   writeJsonToFileForce(absolutePath(`docs/${source}/stats.json`), {
//     site: source,
//     totalSongs: totalSongs
//   })
//   logger.info(`ADDED ${totalSongs} songs`)
// })

async function scrape (website) {
  const u = new URL(website)
  const source = u.host.replace('www.', '')
  const labels = ['marlowuke']
  const content = await axios.get(website)
  const $ = cheerio.load(content.data)

  $('li').each((index, el) => {
    if (index > 6) {
      const url = $(el).find('a').first().attr('href')
      const title = $(el).find('a').text().replace('BAR', '')
      const artist = $(el).contents().filter(function () {
        return this.nodeType === 3 // Filter only text nodes
      }).text().trim()
      const beginnerFriendly = $(el).find('.redText').length > 0

      const filePath = absolutePath(`docs/${source}/info/${title}.json`)
      if (!fs.existsSync(filePath)) {
        q.push({title, artist, labels, url, source, beginnerFriendly})
      } else {
        logger.info(`✅ ${title} already processed; skipped`)
      }
    }
  })
}

async function main () {
  try {
    await scrape('https://doctoruke.com/songs.html')
  } catch (e) {
    logger.error(`Scraping error: ${e.message}`)
  }
}

main()
