import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/config/config.js'
import nsfwService from '../components/nsfwjs/nsfwjs.js'
import { downloadImage } from '../utils/network.js'

export class Examine extends plugin {
  constructor() {
    super({
      name: 'NSFWJS-审核',
      dsc: 'NSFWJS 审核',
      event: 'message',
      priority: 1009,
      rule: [
        {
          reg: '#?审核$',
          fnc: 'Examine'
        }
      ]
    })
  }

  async Examine(e) {
    if (e.source) {
      let reply
      if (e.isGroup) {
        reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()?.message
      } else {
        reply = (await e.friend.getChatHistory(e.source.time, 1)).pop()?.message
      }
      if (reply) {
        for (const val of reply) {
          if (val.type === 'image') {
            e.img = [val.url]
            break
          }
        }
      }
    }

    if (!e.img || e.img.length === 0) {
      e.reply('未能获取到图片，请指令中携带图片或引用回复图片', true)
      return false
    }

    const config = Config.getConfig()
    if (!config.examine.enable) {
      e.reply('未开启审核功能，请联系机器人管理员开启', true)
      return false
    }

    // 遍历所有图片
    for (const imgUrl of e.img) {
      const pic = await downloadImage(imgUrl)
      if (!pic) {
        e.reply('图片下载失败', true)
        continue
      }
      
      if (pic.isGif) {
        e.reply('暂不支持审核 GIF 动图', true)
        continue
      }

      const result = await nsfwService.classify(pic.data)
      if (!result) {
        e.reply('图片审核时发生错误', true)
        continue
      }

      e.reply(
        "该图片的审核结果如下：\n" +
        `【变态程度】:  ${(result.Hentai * 100).toFixed(2)}%\n` +
        `【色情程度】:  ${(result.Porn * 100).toFixed(2)}%\n` +
        `【性感程度】:  ${(result.Sexy * 100).toFixed(2)}%`,
        true
      )
    }

    return false
  }
}
