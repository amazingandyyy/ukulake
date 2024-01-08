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
    const tabsPromises = []

    $('li').each(async (index, element) => {
      let labels = ['doctoruke']
      if(index > 6 & index < 3000) {
        const link = $(element).find('a').first().attr('href')
        let originalSrc = `https://www.${source}${link}`
        if(link.includes('.pdf')) {
          originalSrc = `https://www.${source}/${link}`
        }
          const fileName = originalSrc.replace(`https://www.${source}`, '').replace('/_player/', '').replace('.html', '').replace('.pdf', '').trim()
          const title = $(element).find('a').text().replace('BAR', '')
          const artistName = $(element).contents().filter(function() {
            return this.nodeType === 3; // Filter only text nodes
          }).text().trim();
          // Pushing data to the array
          if (originalSrc && fileName && title) {
            const obj = {
              fileName: `${fileName}.pdf`,
              tabSrc: `https://amazingandyyy.com/ukulake/${source}/${fileName}.pdf`,
              source: source,
              originalSrc,
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
            try {
              if(originalSrc.includes('https://www.doctoruke.com/_player/')) {
                const fetchOriginalSrc= axios.get(originalSrc)
                tabsPromises.push(fetchOriginalSrc)
                try {
                  const response = await fetchOriginalSrc;
                  const c = cheerio.load(response.data)
                  const pdfName = c('script:contains("var pdfName")').text().match(/var pdfName = "(.*?)";/);
                  const extractedPDFName = pdfName ? pdfName[1] : null;
                  const pdfUrl = `https://www.${source}/${extractedPDFName}.pdf`
                  console.log(index, pdfUrl)
                  tabs += `${pdfUrl}\n`
                } catch (e) {
                  console.error('failed to get pdf', e.message)
                }
              }else if (originalSrc.includes('.pdf')){
                console.log(originalSrc)
                tabs += `${originalSrc}\n`
              }
            } catch (e) {
              console.error(e.message)
            }
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
    Promise.all(tabsPromises).then(()=>{
      console.log('goood')
      writeToFileForce(absolutePath(`docs/${source}/tabs`), tabs)
    }).catch(e=>{
      console.error(e.message)
    })
  })
}

async function main() {
  await scrape('https://doctoruke.com/songs.html')
}

main()
// ./scripts/links-downloader.sh docs/sanjoseukulakeclub.org/tabs docs/sanjoseukulakeclub.org
