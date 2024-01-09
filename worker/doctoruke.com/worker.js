const axios = require('axios')
const cheerio = require('cheerio')
const { writeJsonToFileForce, writeToFileForce, absolutePath } = require('../../utils')
const htmlKeyToPdfKey = require('./dict.json')

async function scrape (website) {
  const u = new URL(website)
  const source = u.host
  return new Promise(async (resolve, reject) => {
    const content = await axios.get(website)
    const $ = cheerio.load(content.data)
    const songs = []
    let tabs = ''

    $('li').each(async (index, element) => {
      const labels = ['doctoruke']
      if (index > 6) {
        const link = $(element).find('a').first().attr('href')
        let originalSrc = `https://www.${source}${link}`
        if (link.includes('.pdf')) {
          originalSrc = `https://www.${source}/${link}`
        }
        const fileName = originalSrc.replace(`https://www.${source}`, '').replace('/_player/', '').replace('.html', '').replace('.pdf', '').replace('_medleys', '').replace(/\//g, '').trim()
        const title = $(element).find('a').text().replace('BAR', '')
        const artistName = $(element).contents().filter(function () {
          return this.nodeType === 3 // Filter only text nodes
        }).text().trim()
        const pdfKey = htmlKeyToPdfKey[fileName] || fileName
        // if(pdfKey===) console.log(`${fileName} doesn't have pdfKey`)
        // Pushing data to the array
        if (originalSrc && fileName && title && !fileName.includes('http:') && !fileName.includes('https:')) {
          const obj = {
            tabSrc: `https://amazingandyyy.com/ukulake/${source}/library/${pdfKey}.pdf`,
            source,
            originalSrc,
            title,
            labels,
            additionalData: {}
          }
          const redTextExists = $(element).find('.redText').length > 0
          if (redTextExists) {
            obj.additionalData.beginnerFriendly = true
          }
          if (artistName.includes('(') && artistName.includes(')')) {
            obj.additionalData.artist = artistName.replace('(', '').replace(')', '')
          }
          songs.push(obj)

          tabs += `https://www.doctoruke.com/${pdfKey}.pdf\n`
        }
      }
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

async function main () {
  await scrape('https://doctoruke.com/songs.html')
}

main()
// ./scripts/tabs-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
