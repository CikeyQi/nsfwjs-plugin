import Config from '../config/config.js'

/**
 * 获取群聊策略
 * @param {*} e
 * @returns 
 */
export async function groupPolicy(e) {
    const policy_data = Config.getPolicy()
    const group_id = e.group_id
    // 判断是否有群聊策略，没有则从默认新建
    if (!policy_data.group[group_id]) {
        policy_data.group[group_id] = policy_data.group.default
    }
    const policy = policy_data.group[group_id]
    return policy
}

/**
 * 获取私聊策略
 * @returns
 */
export async function privatePolicy() {
    const policy_data = Config.getPolicy()
    const policy = policy_data.private
    return policy
}