import fs from 'fs'
import lodash from 'lodash'

let packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const getLine = function (line) {
  line = line.replace(/(^\s*\*|\r)/g, '')
  line = line.replace(/\s*`([^`]+`)/g, '<span class="cmd">$1')
  line = line.replace(/`\s*/g, '</span>')
  line = line.replace(/\s*\*\*([^\*]+\*\*)/g, '<span class="strong">$1')
  line = line.replace(/\*\*\s*/g, '</span>')
  line = line.replace(/ⁿᵉʷ/g, '<span class="new"></span>')
  return line
}

const readLogFile = function (root, versionCount = 4) {
  let logPath = `${root}/CHANGELOG.md`
  let logs = {}
  let changelogs = []
  let currentVersion

  try {
    if (fs.existsSync(logPath)) {
      logs = fs.readFileSync(logPath, 'utf8') || ''
      logs = logs.split('\n')

      let temp = {}
      let lastLine = {}
      lodash.forEach(logs, (line) => {
        if (versionCount <= -1) {
          return false
        }
        let versionRet = /^#\s*([0-9a-zA-Z\\.~\s]+?)\s*$/.exec(line)
        if (versionRet && versionRet[1]) {
          let v = versionRet[1].trim()
          if (!currentVersion) {
            currentVersion = v
          } else {
            changelogs.push(temp)
            if (/0\s*$/.test(v) && versionCount > 0) {
              versionCount = 0
            } else {
              versionCount--
            }
          }

          temp = {
            version: v,
            logs: []
          }
        } else {
          if (!line.trim()) {
            return
          }
          if (/^\*/.test(line)) {
            lastLine = {
              title: getLine(line),
              logs: []
            }
            temp.logs.push(lastLine)
          } else if (/^\s{2,}\*/.test(line)) {
            lastLine.logs.push(getLine(line))
          }
        }
      })
    }
  } catch (e) {
    // do nth
  }
  return { changelogs, currentVersion }
}

const { changelogs, currentVersion } = readLogFile(`${process.cwd()}/plugins/nsfwjs-plugin/`)

const yunzaiVersion = packageJson.version
const isMiao = packageJson.name === 'miao-yunzai'
const isTrss = Array.isArray(Bot.uin) ? true : false

let Version = {
  isMiao,
  isTrss,
  get version() {
    return currentVersion
  },
  get yunzai() {
    return yunzaiVersion
  },
  get changelogs() {
    return changelogs
  },
  readLogFile
}

export default Version
