import plugin from '../../../lib/plugins/plugin.js'
import { groupPolicy, privatePolicy } from '../components/policy/policy.js'
import { doPolicy } from '../model/policy.js'
import Config from '../components/config/config.js'
import Log from '../utils/logs.js'
import nsfwService from '../components/nsfwjs/nsfwjs.js'
import { downloadImage } from '../utils/network.js'

export class Listen extends plugin {
  constructor() {
    super({
      name: 'NSFWJS-监听',
      dsc: 'NSFWJS 监听',
      event: 'message',
      priority: 1009,
      rule: [
        {
          reg: '',
          log: false,
          fnc: 'Listen'
        }
      ]
    })
  }

  async Listen(e) {
    if (!e.img || e.img.length === 0) return false

    // 读取策略
    const policy = e.group_id ? await groupPolicy(e) : await privatePolicy()

    // 读取设置
    const config = Config.getConfig()
    if (!config.listen.enable) return false

    // 判断群白名单与群黑名单
    if (e.group_id) {
      if (config.white_group_list?.length > 0) {
        if (!config.white_group_list.includes(e.group_id)) return false
      } else if (config.black_group_list?.length > 0) {
        if (config.black_group_list.includes(e.group_id)) return false
      }
    }

    // 判断个人白名单与个人黑名单
    if (config.white_user_list?.length > 0) {
      if (!config.white_user_list.includes(e.user_id)) return false
    } else if (config.black_user_list?.length > 0) {
      if (config.black_user_list.includes(e.user_id)) return false
    }

    // 获取所有图片并进行鉴定
    for (const imgUrl of e.img) {
      const pic = await downloadImage(imgUrl)
      if (!pic || pic.isGif) continue

      const result = await nsfwService.classify(pic.data)
      if (!result) continue

      // 判断变态程度是否超过阈值
      if (result.Hentai > config.threshold.hentai) {
        Log.w('【NSFWJS】检测到变态图像')
        await doPolicy(e, config, policy, pic, 'Hentai', result.Hentai)
        return true
      }

      // 判断性感程度是否超过阈值
      if (result.Sexy > config.threshold.sexy) {
        Log.w('【NSFWJS】检测到性感图像')
        await doPolicy(e, config, policy, pic, 'Sexy', result.Sexy)
        return true
      }

      // 判断色情程度是否超过阈值
      if (result.Porn > config.threshold.porn) {
        Log.w('【NSFWJS】检测到色情图像')
        await doPolicy(e, config, policy, pic, 'Porn', result.Porn)
        return true
      }
    }

    return false
  }
}
