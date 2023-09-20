import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'
import { groupPolicy, privatePolicy } from '../components/policy/policy.js'
import { doPolicy } from '../model/policy.js'
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
                    reg: '',
                    log: false,
                    /** 执行方法 */
                    fnc: 'Listen',
                }
            ]
        })
    }

    async Listen(e) {

        // 不是图片则不处理
        if (!e.img) {
            return false
        }

        // 读取策略
        let policy = {}
        if (e.group_id) {
            // 走群策略
            policy = await groupPolicy(e)
        } else {
            // 走私聊策略
            policy = await privatePolicy()
        }

        // 读取设置
        let config = await Config.getConfig()

        // 判断是否开启监听
        if (!config.listen.enable) {
            return false
        }

        // 如果是群聊
        if (e.group_id) {
            // 判断群白名单与群黑名单，白名单优先级高于黑名单
            if (config.white_group_list.length > 0) {
                if (config.white_group_list.indexOf(e.group_id) == -1) {
                    return false
                }
            } else if (config.black_group_list.length > 0) {
                if (config.black_group_list.indexOf(e.group_id) != -1) {
                    return false
                }
            }
        }

        // 判断个人白名单与个人黑名单，白名单优先级高于黑名单
        if (config.white_user_list.length > 0) {
            if (config.white_user_list.indexOf(e.user_id) == -1) {
                return false
            }
        } else if (config.black_user_list.length > 0) {
            if (config.black_user_list.indexOf(e.user_id) != -1) {
                return false
            }
        }

        // 取图片md5，判断是否在白名单中（暂时咕了）
       /* const md5 = e.img[0].split('/')[6].split('-')[2]
        if ((await Config.getHistory()).white_pic_md5.indexOf(md5) != -1) {
            Log.i('【NSFWJS】图片已在白名单中，放行')
            return false
        } */

        // 获取所有图片Buffer
        for (const key in e.img) {
            const pic = await axios.get(e.img[0], {
                responseType: 'arraybuffer',
            })
            if (pic.headers['content-type'].indexOf('image/gif') != -1) {
                continue
            }
            const result = await nsfwjs(pic.data)

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
            }
        }
        // 放行消息
        return false
    }
}
