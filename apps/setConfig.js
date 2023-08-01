import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/config/config.js'
import { sendSettingPic } from '../components/getsettingpic/sendSettingPic.js'
import Init from '../model/init.js'

export class setConfig extends plugin {
  constructor() {
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
        },
        {
          reg: '^#?(nsfwjs|NSFWJS)查看(本群|默认|全局)(策略|设置|配置)$',
          fnc: 'queSetting',
          permission: 'master'
        }
      ]
    })
  }

  async setConfig(e) {
    // 初始化
    Init.initConfig()

    // 读取设置
    const config = await Config.getConfig()

    // 去除前缀
    const msg = e.msg.replace(/^#?(nsfwjs|NSFWJS)/, '').trim()

    // 如果是设置监听开启/关闭
    if (msg.startsWith('设置监听')) {
      // 如果是开启
      if (msg.indexOf('开启') !== -1) {
        config.listen.enable = true
        await Config.setConfig(config)
        sendSettingPic(e, true)
        return true
      }

      // 如果是关闭
      if (msg.indexOf('关闭') !== -1) {
        config.listen.enable = false
        await Config.setConfig(config)
        sendSettingPic(e, true)
        return true
      }
    }

    // 如果是设置审核开启/关闭
    if (msg.startsWith('设置审核')) {
      // 如果是开启
      if (msg.indexOf('开启') !== -1) {
        config.examine.enable = true
        await Config.setConfig(config)
        sendSettingPic(e, true)
        return true
      }

      // 如果是关闭
      if (msg.indexOf('关闭') !== -1) {
        config.examine.enable = false
        await Config.setConfig(config)
        sendSettingPic(e, true)
        return true
      }
    }

    // 如果是设置色情阈值
    if (msg.indexOf('设置色情阈值') !== -1) {
      // 获取阈值
      const threshold = msg.replace(/[^0-9.]/ig, '')
      // 如果阈值不为空
      if (threshold) {
        // 如果阈值大于等于0且小于等于10
        if (threshold >= 0 && threshold <= 10) {
          config.threshold.porn = Number(threshold)
          await Config.setConfig(config)
          sendSettingPic(e, true)
          return true
        } else {
          e.reply('【NSFWJS】色情阈值设置失败，阈值范围为0-10', true)
          return true
        }
      } else {
        e.reply('【NSFWJS】色情阈值设置失败，阈值不能为空', true)
        return true
      }
    }

    // 如果是设置性感阈值
    if (msg.indexOf('设置性感阈值') !== -1) {
      // 获取阈值
      const threshold = msg.replace(/[^0-9.]/ig, '')
      // 如果阈值不为空
      if (threshold) {
        // 如果阈值大于等于0且小于等于10
        if (threshold >= 0 && threshold <= 10) {
          config.threshold.sexy = Number(threshold)
          await Config.setConfig(config)
          sendSettingPic(e, true)
          return true
        } else {
          e.reply('【NSFWJS】性感阈值设置失败，阈值范围为0-10', true)
          return true
        }
      } else {
        e.reply('【NSFWJS】性感阈值设置失败，阈值不能为空', true)
        return true
      }
    }

    // 如果是设置变态阈值
    if (msg.indexOf('设置变态阈值') !== -1) {
      // 获取阈值
      const threshold = msg.replace(/[^0-9.]/ig, '')
      // 如果阈值不为空
      if (threshold) {
        // 如果阈值大于等于0且小于等于10
        if (threshold >= 0 && threshold <= 10) {
          config.threshold.hentai = Number(threshold)
          await Config.setConfig(config)
          sendSettingPic(e, true)
          return true
        } else {
          e.reply('【NSFWJS】变态阈值设置失败，阈值范围为0-10', true)
          return true
        }
      } else {
        e.reply('【NSFWJS】变态阈值设置失败，阈值不能为空', true)
        return true
      }
    }

    // 如果是添加/删除通知用户
    if (msg.startsWith('添加通知用户') || msg.startsWith('删除通知用户')) {
      // 获取QQ号
      let qq = msg.replace(/[^0-9]/ig, '')
      qq = Number(qq)
      // 如果QQ号不为空
      if (qq) {
        // 如果是添加
        if (msg.startsWith('添加通知用户')) {
          // 如果用户已存在
          if (config.notice_user.indexOf(qq) !== -1) {
            e.reply(`【NSFWJS】添加通知用户失败，用户${qq}已存在`, true)
            return true
          }
          // 添加用户
          config.notice_user.push(qq)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】添加通知用户成功，用户${qq}已添加`, true)
          return true
        }
        // 如果是删除
        if (msg.startsWith('删除通知用户')) {
          // 如果用户不存在
          if (config.notice_user.indexOf(qq) === -1) {
            e.reply(`【NSFWJS】删除通知用户失败，用户${qq}不存在`, true)
            return true
          }
          // 删除用户
          config.notice_user.splice(config.notice_user.indexOf(qq), 1)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】删除通知用户成功，用户${qq}已删除`, true)
          return true
        }
      } else {
        e.reply('【NSFWJS】添加/删除通知用户失败，QQ号不能为空', true)
        return true
      }
    }

    // 如果是设置警告文本
    if (msg.startsWith('设置警告文本')) {
      // 获取文本
      const text = msg.replace(/^设置警告文本/, '').trim()
      // 如果文本不为空
      if (text) {
        // 最多只能有一对{}，且{}内必须有内容
        if (text.split('{').length > 2 || text.split('}').length > 2 || text.indexOf('{}') !== -1) {
          e.reply('【NSFWJS】警告文本设置失败，文本格式错误', true)
          return true
        }
        config.warn_text = text
        await Config.setConfig(config)
        e.reply(`【NSFWJS】警告文本设置成功，当前文本为${text}`, true)
        return true
      } else {
        e.reply('【NSFWJS】警告文本设置失败，文本不能为空', true)
        return true
      }
    }

    // 如果是添加/删除群白名单
    if (msg.startsWith('添加群白名单') || msg.startsWith('删除群白名单')) {
      // 获取群号
      let group_id = msg.replace(/[^0-9]/ig, '') || e.group_id
      group_id = Number(group_id)
      // 如果群号不为空
      if (group_id) {
        // 如果是添加
        if (msg.startsWith('添加群白名单')) {
          // 如果群已存在
          if (config.white_group_list.indexOf(group_id) !== -1) {
            e.reply(`【NSFWJS】添加群白名单失败，群${group_id}已存在`, true)
            return true
          }
          // 添加群
          config.white_group_list.push(group_id)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】添加群白名单成功，群${group_id}已添加`, true)
          return true
        }
        // 如果是删除
        if (msg.startsWith('删除群白名单')) {
          // 如果群不存在
          if (config.white_group_list.indexOf(group_id) === -1) {
            e.reply(`【NSFWJS】删除群白名单失败，群${group_id}不存在`, true)
            return true
          }
          // 删除群
          config.white_group_list.splice(config.white_group_list.indexOf(group_id), 1)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】删除群白名单成功，群${group_id}已删除`, true)
          return true
        }
      } else {
        e.reply('【NSFWJS】添加/删除群白名单失败，群号不能为空', true)
        return true
      }
    }

    // 如果是添加/删除群黑名单
    if (msg.startsWith('添加群黑名单') || msg.startsWith('删除群黑名单')) {
      // 获取群号
      let group_id = msg.replace(/[^0-9]/ig, '') || e.group_id
      group_id = Number(group_id)
      // 如果群号不为空
      if (group_id) {
        // 如果是添加
        if (msg.startsWith('添加群黑名单')) {
          // 如果群已存在
          if (config.black_group_list.indexOf(group_id) !== -1) {
            e.reply(`【NSFWJS】添加群黑名单失败，群${group_id}已存在`, true)
            return true
          }
          // 添加群
          config.black_group_list.push(group_id)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】添加群黑名单成功，群${group_id}已添加`, true)
          return true
        }
        // 如果是删除
        if (msg.startsWith('删除群黑名单')) {
          // 如果群不存在
          if (config.black_group_list.indexOf(group_id) === -1) {
            e.reply(`【NSFWJS】删除群黑名单失败，群${group_id}不存在`, true)
            return true
          }
          // 删除群
          config.black_group_list.splice(config.black_group_list.indexOf(group_id), 1)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】删除群黑名单成功，群${group_id}已删除`, true)
          return true
        }
      } else {
        e.reply('【NSFWJS】添加/删除群黑名单失败，群号不能为空', true)
        return true
      }
    }

    // 如果是添加/删除用户白名单
    if (msg.startsWith('添加用户白名单') || msg.startsWith('删除用户白名单')) {
      // 获取QQ号
      let qq = msg.replace(/[^0-9]/ig, '')
      qq = Number(qq)
      // 如果QQ号不为空
      if (qq) {
        // 如果是添加
        if (msg.startsWith('添加用户白名单')) {
          // 如果用户已存在
          if (config.white_user_list.indexOf(qq) !== -1) {
            e.reply(`【NSFWJS】添加用户白名单失败，用户${qq}已存在`, true)
            return true
          }
          // 添加用户
          config.white_user_list.push(qq)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】添加用户白名单成功，用户${qq}已添加`, true)
          return true
        }
        // 如果是删除
        if (msg.startsWith('删除用户白名单')) {
          // 如果用户不存在
          if (config.white_user_list.indexOf(qq) === -1) {
            e.reply(`【NSFWJS】删除用户白名单失败，用户${qq}不存在`, true)
            return true
          }
          // 删除用户
          config.white_user_list.splice(config.white_user_list.indexOf(qq), 1)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】删除用户白名单成功，用户${qq}已删除`, true)
          return true
        }
      } else {
        e.reply('【NSFWJS】添加/删除用户白名单失败，QQ号不能为空', true)
        return true
      }
    }

    // 如果是添加/删除用户黑名单
    if (msg.startsWith('添加用户黑名单') || msg.startsWith('删除用户黑名单')) {
      // 获取QQ号
      let qq = msg.replace(/[^0-9]/ig, '')
      qq = Number(qq)
      // 如果QQ号不为空
      if (qq) {
        // 如果是添加
        if (msg.startsWith('添加用户黑名单')) {
          // 如果用户已存在
          if (config.black_user_list.indexOf(qq) !== -1) {
            e.reply(`【NSFWJS】添加用户黑名单失败，用户${qq}已存在`, true)
            return true
          }
          // 添加用户
          config.black_user_list.push(qq)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】添加用户黑名单成功，用户${qq}已添加`, true)
          return true
        }
        // 如果是删除
        if (msg.startsWith('删除用户黑名单')) {
          // 如果用户不存在
          if (config.black_user_list.indexOf(qq) === -1) {
            e.reply(`【NSFWJS】删除用户黑名单失败，用户${qq}不存在`, true)
            return true
          }
          // 删除用户
          config.black_user_list.splice(config.black_user_list.indexOf(qq), 1)
          await Config.setConfig(config)
          e.reply(`【NSFWJS】删除用户黑名单成功，用户${qq}已删除`, true)
          return true
        }
      } else {
        e.reply('【NSFWJS】添加/删除用户黑名单失败，QQ号不能为空', true)
        return true
      }
    }

    // 如果是设置保存路径
    if (msg.startsWith('设置保存路径')) {
      // 获取路径
      const path = msg.replace(/^设置保存路径/, '').trim()
      // 如果路径不为空
      if (path) {
        // 必须以.jpg或.png结尾
        if (!path.endsWith('.jpg') && !path.endsWith('.png')) {
          e.reply('【NSFWJS】保存路径设置失败，路径必须以.jpg或.png结尾', true)
          return true
        }
        // 必须以/开头
        if (!path.startsWith('/')) {
          e.reply('【NSFWJS】保存路径设置失败，路径必须以/开头', true)
          return true
        }
        // .jpg或.png前面必须不是/
        if (path.indexOf('/.jpg') !== -1 || path.indexOf('/.png') !== -1) {
          e.reply('【NSFWJS】保存路径设置失败，路径格式错误', true)
          return true
        }
        // 必须包含{time}
        if (path.indexOf('{time}') === -1) {
          e.reply('【NSFWJS】保存路径设置失败，路径必须包含{time}，否则会引起文件冲突', true)
          return true
        }
        config.save_path = path
        await Config.setConfig(config)
        e.reply(`【NSFWJS】保存路径设置成功，当前路径为${path}`, true)
        return true
      } else {
        e.reply('【NSFWJS】保存路径设置失败，路径不能为空', true)
        return true
      }
    }
    // 如果没有匹配到任何命令
    e.reply('【NSFWJS】设置失败，命令格式错误', true)
    return true
  }

  async queSetting(e) {
    if (/本群/.test(e.msg)) {
      sendSettingPic(e, false)
    } else {
      sendSettingPic(e, true)
    }
  }
}
