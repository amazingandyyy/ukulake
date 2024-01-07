const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const { writeJsonToFileForce, writeToFileForce, absolutePath } = require('../../../utils')

const website = 'https://sanjoseukeclub.org/song_book.html'

async function main () {
  const content = await axios.get(website)
  const $ = cheerio.load(content.data)
  // writeToFileForce(absolutePath(`worker/source/raw/sanjoseukulakeclub.org/song_book.html`), content.data)
  const linksData = []

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
        concatenatedText += $(span).text()
      })
      const cleanedDisplayText = concatenatedText.replace(/\s+/g, ' ').trim()

      // Pushing data to the array
      if (fileName !== 'undefined' && cleanedDisplayText && href) {
        const originalSrc = `https://sanjoseukeclub.org/${href}`
        linksData.push({
          fileName,
          source: 'sanjoseukeclub.org',
          originalSrc,
          title: cleanedDisplayText,
          labels
        })

        axios({
          method: "get",
          url: originalSrc,
          responseType: "stream"
        }).then((res) => {
          res.data.pipe(fs.createWriteStream(absolutePath(`worker/docs/sanjoseukulakeclub.org/${fileName}`)));
        });
      }
    })
  })

  // Displaying the result as JSON
  writeJsonToFileForce(absolutePath(`worker/source/raw/sanjoseukulakeclub.org/data.json`), linksData)
}

main()
