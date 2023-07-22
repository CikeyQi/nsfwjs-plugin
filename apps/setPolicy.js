import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/config/config.js'
import Log from '../utils/logs.js'
import Init from '../model/init.js'

export class setPolicy extends plugin {
  constructor () {
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
          reg: '^#?(nsfwjs|NSFWJS)设置策略.*$',
          /** 执行方法 */
          fnc: 'setPolicy',
          /** 主人权限 */
          permission: 'master'
        }
      ]
    })
  }

  async setPolicy (e) {
    // 初始化
    Init.initPolicy()
  }
}
