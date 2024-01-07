const pdf2html = require('pdf2html')
const { absolutePath, writeToFileForce } = require('./utils')

async function main () {
  const html = await pdf2html.html(absolutePath('docs/test_songs/Hey Soul Sister - v3.pdf'))
  console.log(html)
  // const text = await pdf2html.text(absolutePath('docs/songs/sample.pdf'));
  // console.log(text)
}

main()
