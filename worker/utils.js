const fs = require('fs')
const path = require('path')
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.cli(),
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

const readFileWithDefaultValue = (path, defaultValue) => {
  // logger.info(`readFileWithDefaultValue: ${path}, default: ${defaultValue}`)
  const directory = path.split('/').slice(0, -1).join('/')
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) logger.error(err)
    fs.open(path, 'r', function (err, fd) {
      if (err) {
        fs.appendFile(path, `${defaultValue}`, function (err) {
          if (err) console.error(err)
          return JSON.parse(defaultValue)
        })
      } else {
        const d = fs.readFileSync(path, 'utf8')
        return JSON.parse(d)
      }
    })
  })
}

const writeToFileForce = (path, data, opts = {}) => {
  if (!opts.silent) logger.info(`writeToFile: ${path}`)
  const directory = path.split('/').slice(0, -1).join('/')
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      logger.error(err)
    };
    fs.open(path, 'r', function (err, fd) {
      if (err) {
        fs.appendFile(path, '', function (err) {
          if (err) console.error(err)
          fs.writeFileSync(path, data)
        })
      } else {
        fs.writeFileSync(path, data)
      }
    })
  })
}

const appendToFileForce = (path, data) => {
  logger.info(`appendToFileForce: ${path}`)
  const directory = path.split('/').slice(0, -1).join('/')
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      logger.error(err)
    };
    fs.open(path, 'r', function (err, fd) {
      if (err) {
        fs.appendFileSync(path, '', function (err) {
          if (err) console.error(err)
          fs.writeFileSync(path, data)
        })
      } else {
        fs.appendFileSync(path, `${data}\n`, function (err) {
          if (err) console.error(err.message)
        })
      }
    })
  })
}

const resetFile = (path) => {
  logger.info(`resetFile: ${path}`)
  fs.unlinkSync(path)
}
const appendToJsonArrayForce = (path, data) => {
  logger.info(`appendToJsonFileForce: ${path}`)
  const directory = path.split('/').slice(0, -1).join('/')
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      logger.error(err)
    };
    fs.open(path, 'r', function (err, fd) {
      if (err) {
        fs.appendFile(path, '', function (err) {
          if (err) console.error(err)
          fs.writeFileSync(path, data)
        })
      } else {
        const originalData = readFileWithDefaultValue(path, '[]')
        originalData.push(data)
        const newData = JSON.stringify(originalData, null, 2)
        fs.writeFileSync(path, newData)
      }
    })
  })
}

exports.writeToFileForce = writeToFileForce
exports.appendToJsonArrayForce = appendToJsonArrayForce
exports.appendToFileForce = appendToFileForce
exports.resetFile = resetFile
exports.readFileWithDefaultValue = readFileWithDefaultValue

exports.writeJsonToFileForce = (path, data, opts = {}) => {
  data = JSON.stringify(data, null, 2)
  writeToFileForce(path, data, opts)
}

exports.normalize = (str) => {
  return str.replace(/\s+/g, ' ').trim()
}

exports.mergeObject = (a, b) => {
  return Object.assign({}, a, b)
}

exports.absolutePath = (p) => {
  return path.join(__dirname, '..', p)
}

exports.logger = logger
