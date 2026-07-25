import Log from './logs.js'

/**
 * 安全地下载图片
 * @param {string} url 图片链接
 * @param {number} timeout 超时时间（毫秒），默认 10000ms
 * @returns {Promise<{data: Buffer, isGif: boolean}|null>} 返回图片数据，如果失败返回 null
 */
export async function downloadImage(url, timeout = 10000) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (!response.ok) {
      Log.e(`下载图片失败: ${url}`, `HTTP Status ${response.status}`)
      return null
    }

    const contentType = response.headers.get('content-type') || ''
    const isGif = contentType.includes('image/gif')
    const arrayBuffer = await response.arrayBuffer()

    return {
      data: Buffer.from(arrayBuffer),
      isGif
    }
  } catch (error) {
    Log.e(`下载图片失败: ${url}`, error.message)
    return null
  }
}
