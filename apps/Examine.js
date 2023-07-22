import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'
import Config from '../components/config/config.js'
import { nsfwjs } from '../components/nsfwjs/nsfwjs.js'

export class Examine extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'NSFWJS-审核',
            /** 功能描述 */
            dsc: 'NSFWJS 审核',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1009,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '#?审核$',
                    /** 执行方法 */
                    fnc: 'Examine',
                }
            ]
        })
    }

    async Examine(e) {
        if (e.source) {
            let reply;
            if (e.isGroup) {
                reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()?.message;
            } else {
                reply = (await e.friend.getChatHistory(e.source.time, 1)).pop()?.message;
            }
            if (reply) {
                for (let val of reply) {
                    if (val.type == "image") {
                        e.img = [val.url];
                        break;
                    }
                }
            }
        }
        if (!e.img) {
            e.reply('未能获取到图片，请指令中携带图片或引用回复图片', true)
            return false
        }

        if (!(await Config.getConfig()).examine.enable) {
            e.reply('未开启审核功能，请联系机器人管理员开启', true)
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

            e.reply("该图片的审核结果如下：\n"
                + `【变态程度】:  ${(result.Hentai * 100).toFixed(2)}%\n`
                + `【色情程度】:  ${(result.Porn * 100).toFixed(2)}%\n`
                + `【性感程度】:  ${(result.Sexy * 100).toFixed(2)}%`
                , true)
        }

        return false
    }
}
