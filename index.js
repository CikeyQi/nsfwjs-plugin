import fs from 'node:fs'

if (!global.segment) {
  global.segment = (await import('oicq')).segment
}

logger.info(logger.yellow('- 正在载入 NSFWJS-PLUGIN'))

const files = fs
  .readdirSync('./plugins/nsfwjs-plugin/apps')
  .filter((file) => file.endsWith('.js'))

const ret = await Promise.allSettled(
  files.map((file) => import(`./apps/${file}`))
)

const apps = {}
files.forEach((file, index) => {
  const name = file.replace('.js', '')

  if (ret[index].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[index].reason)
    return
  }
  apps[name] = ret[index].value[Object.keys(ret[index].value)[0]]
})

logger.info(logger.green('- NSFWJS-PLUGIN 载入成功'))
logger.info(logger.magenta('- 欢迎加入新组织【貓娘樂園🍥🏳️‍⚧️】（群号 707331865）'))

export { apps }