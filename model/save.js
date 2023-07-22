import Config from '../components/config/config.js'
import fs from 'fs'
import { pluginResources } from './path.js'

export async function savePic(e, buffer) {
    let path = pluginResources + (await Config.getConfig()).save_path
    // 替换变量，{group_id} 群号，{user_id} QQ号，{time} 时间戳
    path = path.replace('{group_id}', e.group_id || 'private')
    path = path.replace('{user_id}', e.user_id)
    path = path.replace('{time}', Date.now())
    // 递归创建文件夹
    let pathArr = path.split('/')
    let pathStr = ''
    for (let i = 0; i < pathArr.length - 1; i++) {
        pathStr += pathArr[i] + '/'
        if (!fs.existsSync(pathStr)) {
            fs.mkdirSync(pathStr)
        }
    }
    // 保存图片
    fs.writeFile(path, buffer, (err) => {
        if (err) {
            console.error(err)
        }
    })
}