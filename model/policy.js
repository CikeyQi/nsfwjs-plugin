import { savePic } from '../model/save.js'

export async function doPolicy(e, config, policy, pic, className, probability) {
    // 判断是否存本地
    if (policy.localsave) {
        await savePic(e, pic.data)
    }

    // 判断是否撤回
    if (policy.recall) {
        e.group.recallMsg(e.message_id);
    }

    // 判断是否警告
    if (policy.warn) {
        let msg = config.warn_text
        let reply_msg = []
        if (msg.indexOf('{') != -1 && msg.indexOf('}') != -1) {
            msg = msg.split('{')
            let pic = msg[1].split('}')
            reply_msg.push(msg[0])
            reply_msg.push(segment.image(pic[0]))
            reply_msg.push(pic[1])
        } else {
            reply_msg.push(msg)
        }
        console.log(reply_msg)
        e.reply(reply_msg, true)
    }

    // 判断是否提醒主人
    if (policy.notice) {
        // 遍历提醒列表
        let notice_user = config.notice_user
        for (let i = 0; i < notice_user.length; i++) {
            Bot.pickUser(notice_user[i]).sendMsg([
                `[NSFWJS]涩图监听`,
                    (e.group_id ? `\n来自群聊：${e.group_name}(${e.group_id})` : ''),
                `\n发送用户：${e.sender.card}(${e.user_id})\n`,
                `违规类型：${className}(${(probability * 100).toFixed(2)}%)\n`,
                segment.image(pic.data),
            ])
        }
    }

    // 判断是否禁言
    if (policy.mute) {
        e.group.muteMember(e.user_id, policy.mute_time);
    }
}