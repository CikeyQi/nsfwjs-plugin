import Render from './Render.js'
import { style } from '../../resources/help/imgs/config.js'
import _ from 'lodash'

export async function sendHelpPic(e) {
  const helpCfg = {
    "themeSet": false,
    "title": "#NSFWJS帮助",
    "subTitle": "Yunzai-Bot & nsfwjs-plugin",
    "colWidth": 265,
    "theme": "all",
    "themeExclude": [
      "default"
    ],
    "colCount": 2,
    "bgBlur": true
  }
  const helpList = [
    {
      "group": "群聊策略管理",
      "list": [
        {
          "icon": 1,
          "title": "#NSFWJS(本群|全局)策略存本地(开启|关闭)",
          "desc": "是否开启违规图片保存本地"
        },
        {
          "icon": 5,
          "title": "#NSFWJS(本群|全局)策略警告(开启|关闭)",
          "desc": "是否开启违规图片警告"
        },
        {
          "icon": 7,
          "title": "#NSFWJS(本群|全局)策略通知(开启|关闭)",
          "desc": "是否开启违规图片通知主人"
        },
        {
          "icon": 11,
          "title": "#NSFWJS(本群|全局)策略撤回(开启|关闭)",
          "desc": "是否开启违规图片撤回"
        },
        {
          "icon": 54,
          "title": "#NSFWJS(本群|全局)策略禁言(开启|关闭)",
          "desc": "是否开启禁言违规图片者(机器人需为管理)"
        },
        {
          "icon": 45,
          "title": "#NSFWJS(本群|全局)策略禁言时间60",
          "desc": "禁言发送违规图片者时间,单位秒"
        }
      ]
    },
    {
      "group": "私聊策略管理",
      "list": [
        {
          "icon": 3,
          "title": "#NSFWJS私聊策略存本地(开启|关闭)",
          "desc": "是否开启违规图片保存本地"
        },
        {
          "icon": 32,
          "title": "#NSFWJS私聊策略警告(开启|关闭)",
          "desc": "是否开启违规图片警告"
        },
        {
          "icon": 48,
          "title": "#NSFWJS私聊策略通知(开启|关闭)",
          "desc": "是否开启违规图片通知主人"
        }
      ]
    },
    {
      "group": "设置管理",
      "list": [
        {
          "icon": 77,
          "title": "#NSFWJS设置监听(开启|关闭)",
          "desc": "是否开启违规图片监听"
        },
        {
          "icon": 79,
          "title": "#NSFWJS设置图片审核(开启|关闭)",
          "desc": "是否开启违规图片审核"
        },
        {
          "icon": 73,
          "title": "#NSFWJS设置色情阈值0.7",
          "desc": "色情设置阈值,范围0-1"
        },
        {
          "icon": 72,
          "title": "#NSFWJS设置性感阈值0.7",
          "desc": "性感设置阈值,范围0-1"
        },
        {
          "icon": 23,
          "title": "#NSFWJS设置变态阈值0.7",
          "desc": "变态设置阈值,范围0-1"
        }
      ]
    },
    {
      "group": "其他设置",
      "list": [
        {
          "icon": 13,
          "title": "#NSFWJS(添加|删除)通知用户QQ号",
          "desc": "检测违规图片私聊通知用户名单"
        },
        {
          "icon": 80,
          "title": "#NSFWJS设置警告文本啾咪有人涩涩!",
          "desc": "自定义警告文本"
        },
        {
          "icon": 52,
          "title": "#NSFWJS(添加|删除)群(白|黑)名单群号",
          "desc": "群设置白名单或黑名单"
        },
        {
          "icon": 64,
          "title": "#NSFWJS(添加|删除)用户(白|黑)名单QQ号",
          "desc": "用户设置白名单或黑名单"
        },
        {
          "icon": 62,
          "title": "#NSFWJS设置保存路径",
          "desc": "违规图片保存路径"
        },
        {
          "icon": 53,
          "title": "#NSFWJS查看本群设置",
          "desc": "查看当前群及私聊设定"
        },
        {
          "icon": 50,
          "title": "#NSFWJS查看全局设置",
          "desc": "查看默认群及私聊设定"
        }
      ]
    }
  ]
  let helpGroup = []
  _.forEach(helpList, (group) => {
    _.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })
    helpGroup.push(group)
  })

  let themeData = await getThemeData(helpCfg, helpCfg)
  return await Render.render('help/index', {
    helpCfg,
    helpGroup,
    ...themeData,
    element: 'default'
  }, { e, scale: 1.6 })
}

async function getThemeCfg() {
  let resPath = '{{_res_path}}/help/imgs/'
  return {
    main: `${resPath}/main.png`,
    bg: `${resPath}/bg.jpg`,
    style: style
  }
}

function getDef() {
  for (let idx in arguments) {
      if (!_.isUndefined(arguments[idx])) {
          return arguments[idx]
      }
  }
}

async function getThemeData(diyStyle, sysStyle) {
  let helpConfig = _.extend({}, sysStyle, diyStyle)
  let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2))
  let colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265))
  let width = Math.min(2500, Math.max(800, colCount * colWidth + 30))
  let theme = await getThemeCfg()
  let themeStyle = theme.style || {}
  let ret = [`
    body{background-image:url(${theme.bg});width:${width}px;}
    .container{background-image:url(${theme.main});width:${width}px;}
    .help-table .td,.help-table .th{width:${100 / colCount}%}
    `]
  let css = function (sel, css, key, def, fn) {
    let val = getDef(themeStyle[key], diyStyle[key], sysStyle[key], def)
    if (fn) {
      val = fn(val)
    }
    ret.push(`${sel}{${css}:${val}}`)
  }
  css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
  css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
  css('.help-desc', 'color', 'descColor', '#eee')
  css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
  css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`)
  css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
  css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
  css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
  return {
    style: `<style>${ret.join('\n')}</style>`,
    colCount
  }
}
