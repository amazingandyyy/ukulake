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

    $('li').each((index, element) => {
      let labels = ['doctoruke']
      if(index > 5) {
          const fileName = $(element).find('a').attr('href').replace('/_player/', '').replace('.html', '').replace('.pdf', '').trim()
          const title = $(element).find('a').text().replace('BAR', '')
          const artistName = $(element).contents().filter(function() {
            return this.nodeType === 3; // Filter only text nodes
          }).text().trim();
          // Pushing data to the array
          if (fileName && title) {
            const originalTab = `https://${source}/${fileName}.pdf`
            const obj = {
              fileName: `${fileName}.pdf`,
              tabSrc: `https://amazingandyyy.com/ukulake/${source}/${fileName}.pdf`,
              source: source,
              originalSrc: `https://${source}/_player/${fileName}.html`,
              title,
              labels,
              additionalData: {}
            }
            const redTextExists = $(element).find('.redText').length > 0;
            if (redTextExists) {
              obj.additionalData.beginnerFriendly = true
            }
            if(artistName.includes('(') && artistName.includes(')')) {
              obj.additionalData.artist = artistName.replace('(', '').replace(')', '')
            }
            songs.push(obj)
            tabs += `${originalTab}\n`
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

async function main() {
  await scrape('https://doctoruke.com/songs.html')
}

main()
// ./scripts/links-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
