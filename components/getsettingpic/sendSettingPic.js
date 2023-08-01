import Config from '../config/config.js'
import Render from './Render.js'
import Version from './Version.js'

/**
 * 
 * @param {*} e 消息对象
 * @param {boolean} isDefault 是否为默认群配置,是为True
 * @returns 
 */
export async function sendSettingPic(e, isDefault) {
    const policy = Config.getPolicy()
    let groupPolicy = isDefault || !policy['group'][e.group_id] ? policy['group']['default'] : policy['group'][e.group_id]
    const privatePolicy = policy['private']
    const config = Config.getConfig()
    let cfg = {
        group: {
            ...groupPolicy
        },
        private: {
            ...privatePolicy
        },
        ...config
    }
    let schema = {
        nsfwjsGroup: {
            title: isDefault ? '默认群策略' : `当前群${e.group_id}策略`,
            cfg: {
                localsave: {
                    title: '违规图片保存本地',
                    key: '存本地',
                    def: true,
                    desc: '是否开启违规图片保存本地',
                    fileName: 'nsfwjs-grouppolicy'
                },
                recall: {
                    title: '违规图片撤回',
                    key: '撤回',
                    def: true,
                    desc: '是否开启违规图片撤回',
                    fileName: 'nsfwjs-grouppolicy'
                },
                warn: {
                    title: '违规图片警告',
                    key: '警告',
                    def: true,
                    desc: '是否开启违规图片警告',
                    fileName: 'nsfwjs-grouppolicy'
                },
                notice: {
                    title: '违规图片通知主人',
                    key: '通知',
                    def: true,
                    desc: '是否开启违规图片通知主人',
                    fileName: 'nsfwjs-grouppolicy'
                },
                mute: {
                    title: '违规图片禁言',
                    key: '禁言',
                    def: false,
                    desc: '是否开启禁言发送违规图片者',
                    fileName: 'nsfwjs-grouppolicy'
                },
                mute_time: {
                    title: '违规图片禁言时间',
                    key: '禁言时间',
                    type: 'num',
                    def: 60,
                    desc: '禁言发送违规图片者时间,单位秒',
                    fileName: 'nsfwjs-grouppolicy'
                }
            }
        },
        nsfwjsPrivate: {
            title: '私聊策略',
            cfg: {
                localsave: {
                    title: '违规图片保存本地',
                    key: '存本地',
                    def: true,
                    desc: '是否开启私聊违规图片保存本地',
                    fileName: 'nsfwjs-privatepolicy'
                },
                warn: {
                    title: '违规图片警告',
                    key: '警告',
                    def: true,
                    desc: '是否开启私聊违规图片警告',
                    fileName: 'nsfwjs-privatepolicy'
                },
                notice: {
                    title: '违规图片通知主人',
                    key: '通知',
                    def: true,
                    desc: '是否开启违规图片通知主人',
                    fileName: 'nsfwjs-privatepolicy'
                }
            }
        },
        nsfwjsConfig: {
            title: 'nsfwjs设置',
            cfg: {
                listen: {
                    title: '违规图片监听开启',
                    key: '监听',
                    def: true,
                    desc: '是否开启违规图片监听',
                    fileName: 'nsfwjs-config'
                },
                examine: {
                    title: '违规图片审核开启',
                    key: '审核',
                    def: false,
                    desc: '是否开启违规图片审核',
                    fileName: 'nsfwjs-config'
                },
                porn: {
                    title: '色情阈值',
                    key: '色情阈值',
                    type: 'num',
                    def: 0.7,
                    desc: 'porn设置阈值,范围0-1',
                    fileName: 'nsfwjs-config'
                },
                sexy: {
                    title: '性感阈值',
                    key: '性感阈值',
                    type: 'num',
                    def: 0.7,
                    desc: 'sexy设置阈值,范围0-1',
                    fileName: 'nsfwjs-config'
                },
                hentai: {
                    title: '变态阈值',
                    key: '变态阈值',
                    type: 'num',
                    def: 0.7,
                    desc: 'hentai设置阈值,范围0-1',
                    fileName: 'nsfwjs-config'
                },
            }
        }
    }
    let imgPlus = false

    // 渲染图像
    return await Render.render('admin/index', {
        schema,
        cfg,
        imgPlus,
        isMiao: Version.isMiao
    }, { e, scale: 1.4 })
}
