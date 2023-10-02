import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/config/config.js'
import { sendSettingPic } from '../components/createPic/sendSettingPic.js'
import Log from '../utils/logs.js'
import Init from '../model/init.js'

export class setPolicy extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'NSFWJS-策略',
      /** 功能描述 */
      dsc: 'NSFWJS 策略',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1009,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(nsfwjs|NSFWJS)(.*)策略.*$',
          /** 执行方法 */
          fnc: 'setPolicy',
          /** 主人权限 */
          permission: 'master'
        }
      ]
    })
  }

  async setPolicy(e) {
    // 初始化
    Init.initPolicy()

    // 获取策略
    const policy = Config.getPolicy()

    // 获取设置和策略之间的内容
    const [, , type_msg, msg] = e.msg.match(/#?(nsfwjs|NSFWJS)(.*)策略(.*)/)

    let type_path = ''

    let type = ''

    let isDefault = true


    // 如果type_msg为私聊，将yaml路径设置为private
    if (type_msg.match(/私聊/)) {
      type_path = 'private'
      type = '私聊'
    }

    // 如果type_msg为全局，将yaml路径设置为group.default
    if (type_msg.match(/全局/)) {
      type_path = 'group.default'
      type = '全局'
    }

    // 如果type_msg为群聊
    if (type_msg.match(/本群/)) {
      if (e.group_id) {
        type_path = `group.${e.group_id}`
        type = `群${e.group_id}`
        isDefault = false
        if (!policy.group[e.group_id]) {
          // 深拷贝全局策略
          policy.group[e.group_id] = JSON.parse(JSON.stringify(policy.group.default))
          Config.setPolicy(policy)
        } else {
          // 检查群策略键与全局策略键是否一致
          for (let key in policy.group.default) {
            if (!policy.group[e.group_id].hasOwnProperty(key)) {
              policy.group[e.group_id][key] = policy.group.default[key]
            }
          }
        }
      } else {
        e.reply("【NSFWKJS】请在群聊中使用该命令")
        return true
      }
    }

    // 如果type_path为空，说明未能识别策略类型
    if (!type_path) {
      e.reply("【NSFWJS】未能识别策略类型")
      return true
    }


    let keys = type_path.split('.')
    let value = policy
    for (let key of keys) {
      value = value[key]
    }


    // 如果是设置存本地
    if (msg.match(/存本地/)) {
      if (msg.indexOf('开启') != -1) {
        value.localsave = true
        Config.setPolicy(policy)
      }
      if (msg.indexOf('关闭') != -1) {
        value.localsave = false
        Config.setPolicy(policy)
      }
    }

    // 如果是设置撤回
    if (msg.match(/撤回/) && type !== '私聊') {
      if (msg.indexOf('开启') != -1) {
        value.recall = true
        Config.setPolicy(policy)
      }
      if (msg.indexOf('关闭') != -1) {
        value.recall = false
        Config.setPolicy(policy)
      }
    }

    // 如果是设置警告
    if (msg.match(/警告/)) {
      if (msg.indexOf('开启') != -1) {
        value.warn = true
        Config.setPolicy(policy)
      }
      if (msg.indexOf('关闭') != -1) {
        value.warn = false
        Config.setPolicy(policy)
      }
    }

    // 如果是设置通知
    if (msg.match(/通知/)) {
      if (msg.indexOf('开启') != -1) {
        value.notice = true
        Config.setPolicy(policy)
      }
      if (msg.indexOf('关闭') != -1) {
        value.notice = false
        Config.setPolicy(policy)
      }
    }

    // 如果是设置禁言
    if (msg.match(/禁言/) && type !== '私聊') {
      if (msg.indexOf('开启') != -1) {
        value.mute = true
        Config.setPolicy(policy)
      }
      if (msg.indexOf('关闭') != -1) {
        value.mute = false
        Config.setPolicy(policy)
      }
    }

    // 如果是设置禁言时间
    if (msg.match(/禁言时间/) && type !== '私聊') {
      const time = msg.match(/禁言时间(\d+)/)[1]
      if (time < 1) {
        e.reply(`禁言时间不能设置为${time}`, true)
        return true
      }
      value.mute_time = parseInt(time)
      Config.setPolicy(policy)
    }

    // 如果是设置违规禁言次数
    if (msg.match(/限制违规次数/) && type !== '私聊') {
      const time = msg.match(/限制违规次数(\d+)/)[1]
      if (time < 1) {
        e.reply(`限制违规次数不能设置为${time}`, true)
        return true
      }
      value.mutecount = parseInt(time)
      Config.setPolicy(policy)
    }
    
    return sendSettingPic(e, isDefault)
  }
}