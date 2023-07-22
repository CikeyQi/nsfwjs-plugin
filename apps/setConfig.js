import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/config/config.js'
import Log from '../utils/logs.js'
import Init from '../model/init.js'

export class setConfig extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: 'NSFWJS-设置',
      /** 功能描述 */
      dsc: 'NSFWJS 设置',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1009,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(nsfwjs|NSFWJS)(设置|添加|删除).*$',
          /** 执行方法 */
          fnc: 'setConfig',
          /** 主人权限 */
          permission: 'master'
        }
      ]
    })
  }

  async setConfig (e) {
    // 初始化
    Init.initConfig()
    const config = await Config.getConfig()
    const set_msg = e.msg.replace(/#?(nsfwjs|NSFWJS)/, '').trim()
    if (set_msg === "设置监听开启") {
      config.listen.enable = true
      Config.setConfig(config)
      e.reply(`设置成功，当前监听已打开`)
    } else if (set_msg === "设置监听关闭") {
      config.listen.enable = false
      Config.setConfig(config)
      e.reply(`设置成功，当前监听已关闭`)
    } else if (set_msg === "设置审核开启") {
      config.examine.enable = true
      Config.setConfig(config)
      e.reply(`设置成功，当前审核已打开`)
    } else if (set_msg === "设置审核关闭") {
      config.examine.enable = false
      Config.setConfig(config)
      e.reply(`设置成功，当前审核已关闭`)
    } else if (set_msg.includes("色情阈值")) {
      const threshold = set_msg.replace(/设置色情阈值/, '').trim()
      if (threshold) {
        if (isNaN(threshold)) {
          e.reply(`设置失败，色情阈值必须为数字`)
          return false
        }
        config.threshold.porn = Number(threshold)
        Config.setConfig(config)
        e.reply(`设置成功，当前色情阈值已设置为${threshold}`)
      } else {
        e.reply(`设置失败，未能获取到色情阈值`)
      }
    } else if (set_msg.includes("性感阈值")) {
      const threshold = set_msg.replace(/设置性感阈值/, '').trim()
      if (threshold) {
        if (isNaN(threshold)) {
          e.reply(`设置失败，性感阈值必须为数字`)
          return false
        }
        config.threshold.sexy = Number(threshold)
        Config.setConfig(config)
        e.reply(`设置成功，当前性感阈值已设置为${threshold}`)
      } else {
        e.reply(`设置失败，未能获取到性感阈值`)
      }
    } else if (set_msg.includes("变态阈值")) {
      const threshold = set_msg.replace(/设置变态阈值/, '').trim()
      if (threshold) {
        if (isNaN(threshold)) {
          e.reply(`设置失败，变态阈值必须为数字`)
          return false
        }
        config.threshold.hentai = Number(threshold)
        Config.setConfig(config)
        e.reply(`设置成功，当前变态阈值已设置为${threshold}`)
      } else {
        e.reply(`设置失败，未能获取到变态阈值`)
      }
    } else if (set_msg.includes("通知账号")) {
      let account = set_msg.replace(/添加通知账号/, '').trim()
      if (account) {
        if (isNaN(account)) {
          e.reply(`添加失败，通知账号必须为数字`)
          return false
        }
        account = Number(account)
        if (config.notice_user.includes(account)) {
          e.reply(`添加失败，通知账号已存在`)
          return false
        }
        config.notice_user.push(account)
        Config.setConfig(config)
        e.reply(`添加成功，已将${account}添加到通知账号`)
      } else {
        e.reply(`添加失败，未能获取到通知账号`)
      }
    } else if (set_msg.includes("删除通知账号")) {
      let account = set_msg.replace(/删除通知账号/, '').trim()
      if (account) {
        if (isNaN(account)) {
          e.reply(`删除失败，通知账号必须为数字`)
          return false
        }
        account = Number(account)
        if (!config.notice_user.includes(account)) {
          e.reply(`删除失败，通知账号不存在`)
          return false
        }
        config.notice_user.splice(config.notice_user.indexOf(account), 1)
        Config.setConfig(config)
        e.reply(`删除成功，已将${account}从通知账号中删除`)
      } else {
        e.reply(`删除失败，未能获取到通知账号`)
      }
    } else if (set_msg.includes("警告文本")) {
      const text = set_msg.replace(/警告通知文本/, '').trim()
      if (text) {
        if (text.split('{').length > 2 || text.split('}').length > 2 || text.split('{')[1].split('}')[0].length === 0) {
          e.reply(`设置失败，警告文本格式错误`)
          return false
        }
        config.warn_text = text
        Config.setConfig(config)
        e.reply(`设置成功，当前警告文本已设置为${text}`)
      } else {
        e.reply(`设置失败，未能获取到警告文本`)
      }
    } else if (set_msg.includes("群白名单")) {
      let group = set_msg.replace(/添加群白名单/, '').trim()
      if (group) {
        if (isNaN(group)) {
          e.reply(`添加失败，群白名单必须为数字`)
          return false
        }
        group = Number(group)
        if (config.white_group_list.includes(group)) {
          e.reply(`添加失败，群白名单已存在`)
          return false
        }
        config.white_group_list.push(group)
        Config.setConfig(config)
        e.reply(`添加成功，已将${group}添加到群白名单`)
      } else {
        e.reply(`添加失败，未能获取到群白名单`)
      }
    } else if (set_msg.includes("删除群白名单")) {
      let group = set_msg.replace(/删除群白名单/, '').trim()
      if (group) {
        if (isNaN(group)) {
          e.reply(`删除失败，群白名单必须为数字`)
          return false
        }
        group = Number(group)
        if (!config.white_group_list.includes(group)) {
          e.reply(`删除失败，群白名单不存在`)
          return false
        }
        config.white_group_list.splice(config.white_group_list.indexOf(group), 1)
        Config.setConfig(config)
        e.reply(`删除成功，已将${group}从群白名单中删除`)
      } else {
        e.reply(`删除失败，未能获取到群白名单`)
      }
    } else if (set_msg.includes("群黑名单")) {
      let group = set_msg.replace(/添加群黑名单/, '').trim()
      if (group) {
        if (isNaN(group)) {
          e.reply(`添加失败，群黑名单必须为数字`)
          return false
        }
        group = Number(group)
        if (config.black_group_list.includes(group)) {
          e.reply(`添加失败，群黑名单已存在`)
          return false
        }
        config.black_group_list.push(group)
        Config.setConfig(config)
        e.reply(`添加成功，已将${group}添加到群黑名单`)
      } else {
        e.reply(`添加失败，未能获取到群黑名单`)
      }
    } else if (set_msg.includes("删除群黑名单")) {
      let group = set_msg.replace(/删除群黑名单/, '').trim()
      if (group) {
        if (isNaN(group)) {
          e.reply(`删除失败，群黑名单必须为数字`)
          return false
        }
        group = Number(group)
        if (!config.black_group_list.includes(group)) {
          e.reply(`删除失败，群黑名单不存在`)
          return false
        }
        config.black_group_list.splice(config.black_group_list.indexOf(group), 1)
        Config.setConfig(config)
        e.reply(`删除成功，已将${group}从群黑名单中删除`)
      } else {
        e.reply(`删除失败，未能获取到群黑名单`)
      }
    } else if (set_msg.includes("用户白名单")) {
      let user = set_msg.replace(/添加用户白名单/, '').trim()
      if (user) {
        if (isNaN(user)) {
          e.reply(`添加失败，用户白名单必须为数字`)
          return false
        }
        user = Number(user)
        if (config.white_user_list.includes(user)) {
          e.reply(`添加失败，用户白名单已存在`)
          return false
        }
        config.white_user_list.push(user)
        Config.setConfig(config)
        e.reply(`添加成功，已将${user}添加到用户白名单`)
      } else {
        e.reply(`添加失败，未能获取到用户白名单`)
      }
    } else if (set_msg.includes("删除用户白名单")) {
      let user = set_msg.replace(/删除用户白名单/, '').trim()
      if (user) {
        if (isNaN(user)) {
          e.reply(`删除失败，用户白名单必须为数字`)
          return false
        }
        user = Number(user)
        if (!config.white_user_list.includes(user)) {
          e.reply(`删除失败，用户白名单不存在`)
          return false
        }
        config.white_user_list.splice(config.white_user_list.indexOf(user), 1)
        Config.setConfig(config)
        e.reply(`删除成功，已将${user}从用户白名单中删除`)
      } else {
        e.reply(`删除失败，未能获取到用户白名单`)
      }
    } else if (set_msg.includes("用户黑名单")) {
      let user = set_msg.replace(/添加用户黑名单/, '').trim()
      if (user) {
        if (isNaN(user)) {
          e.reply(`添加失败，用户黑名单必须为数字`)
          return false
        }
        user = Number(user)
        if (config.black_user_list.includes(user)) {
          e.reply(`添加失败，用户黑名单已存在`)
          return false
        }
        config.black_user_list.push(user)
        Config.setConfig(config)
        e.reply(`添加成功，已将${user}添加到用户黑名单`)
      } else {
        e.reply(`添加失败，未能获取到用户黑名单`)
      }
    } else if (set_msg.includes("删除用户黑名单")) {
      let user = set_msg.replace(/删除用户黑名单/, '').trim()
      if (user) {
        if (isNaN(user)) {
          e.reply(`删除失败，用户黑名单必须为数字`)
          return false
        }
        user = Number(user)
        if (!config.black_user_list.includes(user)) {
          e.reply(`删除失败，用户黑名单不存在`)
          return false
        }
        config.black_user_list.splice(config.black_user_list.indexOf(user), 1)
        Config.setConfig(config)
        e.reply(`删除成功，已将${user}从用户黑名单中删除`)
      } else {
        e.reply(`删除失败，未能获取到用户黑名单`)
      }
    } else if (set_msg.includes("存储路径")) {
      const path = set_msg.replace(/设置存储路径/, '').trim()
      if (path) {
        if (!path.endsWith('.jpg') && !path.endsWith('.png')) {
          e.reply(`设置失败，存储路径必须以.jpg或.png结尾`)
          return false
        }
        config.save_path = path
        Config.setConfig(config)
        e.reply(`设置成功，当前存储路径已设置为${path}`)
      } else {
        e.reply(`设置失败，未能获取到存储路径`)
      }
    } else {
      e.reply(`设置失败，未知的设置项`)
    }
  }
}
