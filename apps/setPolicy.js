import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/config/config.js'
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
    const type_msg = e.msg.match(/#?(nsfwjs|NSFWJS)(.*)策略(.*)/)[2]

    let type_path = ''

    let type = ''

    // 如果type_msg为群号，将json路径设置为group.群号
    if (type_msg.match(/^\d+$/)) {
      type_path = `group.${type_msg}`
      type = `群${type_msg}`
      // 判断群号是否存在
      if (!policy.group[type_msg]) {
        // 从默认策略中复制策略
        policy.group[type_msg] = JSON.parse(JSON.stringify(policy.group.default))
        Config.setPolicy(policy)
      }
    }

    // 如果type_msg为私聊，将json路径设置为private
    if (type_msg.match(/私聊/)) {
      type_path = 'private'
      type = '私聊'
    }

    // 如果type_msg为全局，将json路径设置为group.default
    if (type_msg.match(/全局/)) {
      type_path = 'group.default'
      type = '全局'
    }

    // 如果type_msg为群聊
    if (type_msg.match(/本群/)) {
      if (e.group_id) {
        type_path = `group.${e.group_id}`
        type = `群${e.group_id}`
      } else {
        e.reply("【NSFWKJS】请在群聊中使用该命令")
        return true
      }
    }

    // 如果有e.group_id，说明是群聊
    if (!type_path) {
      if (e.group_id) {
        type_path = `group.${e.group_id}`
        type = `群${e.group_id}`
        // 判断群号是否存在
        if (!policy.group[e.group_id]) {
          // 从默认策略中复制策略
          policy.group[e.group_id] = JSON.parse(JSON.stringify(policy.group.default))
          Config.setPolicy(policy)
        }
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

    const msg = e.msg.match(/#?(nsfwjs|NSFWJS)(.*)策略(.*)/)[3]

    console.log(type, msg)

    // 如果是设置存本地
    if (msg.match(/存本地/)) {
      if (msg.indexOf('开启') != -1) {
        console.log(value)
        value.localsave = true
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}存本地开启成功`)
      }
      if (msg.indexOf('关闭') != -1) {
        value.localsave = false
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}存本地关闭成功`)
      }
    }

    // 如果是设置撤回
    if (msg.match(/撤回/)) {
      if (msg.indexOf('开启') != -1) {
        value.recall = true
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}撤回开启成功`)
      }
      if (msg.indexOf('关闭') != -1) {
        value.recall = false
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}撤回关闭成功`)
      }
    }

    // 如果是设置警告
    if (msg.match(/警告/)) {
      if (msg.indexOf('开启') != -1) {
        value.warn = true
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}警告开启成功`)
      }
      if (msg.indexOf('关闭') != -1) {
        value.warn = false
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}警告关闭成功`)
      }
    }

    // 如果是设置通知
    if (msg.match(/通知/)) {
      if (msg.indexOf('开启') != -1) {
        value.notice = true
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}通知开启成功`)
      }
      if (msg.indexOf('关闭') != -1) {
        value.notice = false
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}通知关闭成功`)
      }
    }

    // 如果是设置禁言
    if (msg.match(/禁言/)) {
      if (msg.indexOf('开启') != -1) {
        value.mute = true
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}禁言开启成功`)
      }
      if (msg.indexOf('关闭') != -1) {
        value.mute = false
        Config.setPolicy(policy)
        e.reply(`【NSFWJS】${type}禁言关闭成功`)
      }
    }

    // 如果是设置禁言时间
    if (msg.match(/禁言时间/)) {
      const time = msg.match(/禁言时间(\d+)/)[1]
      value.mute_time = parseInt(time)
      Config.setPolicy(policy)
      e.reply(`【NSFWJS】${type}禁言时间设置成功`)
    }
  }
}