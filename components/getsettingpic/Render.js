import Version from './Version.js'

function scale(pct = 1) {
    let scale = 100
    scale = Math.min(2, Math.max(0.5, scale / 100))
    pct = pct * scale
    return `style=transform:scale(${pct})`
}

const Render = {
    async render(path, params, cfg) {
        let { e } = cfg
        if (!e.runtime) {
            console.log('未找到e.runtime，请升级至最新版Yunzai')
        }

        let BotName = Version.isMiao ? 'Miao-Yunzai' : 'Yunzai-Bot'
        return e.runtime.render('nsfwjs-plugin', path, params, {
            retType: cfg.retMsgId ? 'msgId' : 'default',
            beforeRender({ data }) {
                let pluginName = ''
                if (data.pluginName !== false) {
                    pluginName = ` & ${data.pluginName || 'nsfwjs-plugin'}`
                    if (data.pluginVersion !== false) {
                        pluginName += `<span class="version">${data.pluginVersion || Version.version}`
                    }
                }
                let resPath = data.pluResPath
                const layoutPath = process.cwd() + '/plugins/nsfwjs-plugin/resources/common/layout/'
                return {
                    ...data,
                    _res_path: resPath,
                    _nsfwjs_path: resPath,
                    _layout_path: layoutPath,
                    defaultLayout: layoutPath + 'default.html',
                    elemLayout: layoutPath + 'elem.html',
                    sys: {
                        scale: scale(cfg.scale || 1)
                    },
                    copyright: `Created By ${BotName}<span class="version">${Version.yunzai}</span>${pluginName}</span>`,
                    pageGotoParams: {
                        waitUntil: 'networkidle2'
                    }
                }
            }
        })
    }
}

export default Render