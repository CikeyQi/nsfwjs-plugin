import { savePic } from '../model/save.js'

export async function doPolicy(e, config, policy, pic, className, probability) {
  // 判断是否存本地
  if (policy.localsave) {
    await savePic(e, pic.data)
  }

  // 判断是否撤回
  if (policy.recall && e.group) {
    e.group.recallMsg(e.message_id)
  }

  // 判断是否警告
  if (policy.warn) {
    let msg = config.warn_text
    const reply_msg = []
    
    if (msg.includes('{') && msg.includes('}')) {
      const parts = msg.split('{')
      const picParts = parts[1].split('}')
      reply_msg.push(parts[0])
      reply_msg.push(segment.image(picParts[0]))
      reply_msg.push(picParts[1])
    } else {
      reply_msg.push(msg)
    }
    
    e.reply(reply_msg, true)
  }

  // 判断是否提醒主人
  if (policy.notice && config.notice_user?.length > 0) {
    for (const userId of config.notice_user) {
      const userCard = e.sender?.card || e.sender?.nickname || '未知'
      Bot.pickUser(userId).sendMsg([
        '[NSFWJS] 涩图监听',
        e.group_id ? `\n来自群聊：${e.group_name}(${e.group_id})` : '',
        `\n发送用户：${userCard}(${e.user_id})\n`,
        `违规类型：${className}(${(probability * 100).toFixed(2)}%)\n`,
        segment.image(pic.data)
      ])
    }
  }

  // 判断是否禁言 (仅群聊有效)
  if (policy.mute && e.group_id) {
    const redisKey = `nsfwjs:mutecount:${e.group_id}:${e.user_id}`
    let count = await redis.get(redisKey)
    count = count ? parseInt(count) : 0
    count++
    
    if (count >= policy.mutecount) {
      e.group.muteMember(e.user_id, policy.mute_time)
      await redis.del(redisKey)
    } else {
      await redis.set(redisKey, count)
    }
  }
}