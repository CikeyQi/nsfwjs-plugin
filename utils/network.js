import axios from 'axios'
import Log from './logs.js'

/**
 * 安全地下载图片
 * @param {string} url 图片链接
 * @param {number} timeout 超时时间（毫秒），默认 10000ms
 * @returns {Promise<{data: Buffer, isGif: boolean}|null>} 返回图片数据，如果失败返回 null
 */
export async function downloadImage(url, timeout = 10000) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout
    })
    
    const contentType = response.headers['content-type'] || ''
    const isGif = contentType.includes('image/gif')
    
    return {
      data: response.data,
      isGif
    }
  } catch (error) {
    Log.e(`下载图片失败: ${url}`, error.message)
    return null
  }
}
