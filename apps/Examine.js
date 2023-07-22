import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'
import Config from '../components/config/config.js'
import Log from '../utils/logs.js'
import { nsfwjs } from '../components/nsfwjs/nsfwjs.js'

export class Listen extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'NSFWJS-监听',
            /** 功能描述 */
            dsc: 'NSFWJS 监听',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1009,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '#sadfsdsd',
                    /** 执行方法 */
                    fnc: 'Listen',
                }
            ]
        })
    }

    async Listen(e) {

        if (!e.img) {
            return false
        }

        if (!(await Config.getConfig()).listen.enable) {
            return false
        }

        // 遍历所有图片
        for (const key in e.img) {
            const pic = await axios.get(e.img[0], {
                responseType: 'arraybuffer',
            })

            // 不支持GIF
            if (pic.headers['content-type'].indexOf('image/gif') != -1) {
                continue
            }

            const result = await nsfwjs(pic.data)
            
            console.log(result)
        }

        return false
    }
}
