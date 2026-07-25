import * as nsfw from 'nsfwjs'
import * as tf from '@tensorflow/tfjs'
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm'
import Jimp from 'jimp'
import { pluginResources } from '../../model/path.js'
import fs from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'
import Log from '../../utils/logs.js'
import Config from '../config/config.js'

const require = createRequire(import.meta.url)

class NSFWService {
  constructor() {
    this.isInitialized = false
    this.model = null
    this.modelDir = null
  }

  // 获取 WASM 路径
  getWasmPath() {
    try {
      return path.dirname(require.resolve('@tensorflow/tfjs-backend-wasm/package.json')) + '/dist/'
    } catch (e) {
      return path.join(process.cwd(), 'node_modules', '@tensorflow', 'tfjs-backend-wasm', 'dist', path.sep)
    }
  }

  // 本地模型 IO Handler
  localModelIOHandler() {
    const modelDir = this.modelDir
    return {
      async load() {
        const jsonPath = path.join(modelDir, 'model.json')
        const modelJsonStr = await fs.readFile(jsonPath, 'utf-8')
        const modelJson = JSON.parse(modelJsonStr)
        const weightsManifest = modelJson.weightsManifest

        const weightSpecs = []
        const weightFiles = []

        for (const group of weightsManifest) {
          weightSpecs.push(...group.weights)
          weightFiles.push(...group.paths)
        }

        const buffers = await Promise.all(
          weightFiles.map(filename => fs.readFile(path.join(modelDir, filename)))
        )
        
        const weightData = Buffer.concat(buffers).buffer

        return {
          modelTopology: modelJson.modelTopology || modelJson.topology,
          weightSpecs,
          weightData,
          format: modelJson.format,
          generatedBy: modelJson.generatedBy,
          convertedBy: modelJson.convertedBy
        }
      }
    }
  }

  /**
   * 初始化 WASM 后端并加载模型（单例）
   */
  async init() {
    if (this.isInitialized && this.model) return

    try {
      setWasmPaths(this.getWasmPath())
      await tf.setBackend('wasm')
      await tf.ready()
      
      const config = Config.getConfig()
      const modelName = config.model_name || 'mobilenet_v2'
      this.modelDir = path.join(pluginResources, 'models', modelName)
      
      const options = {}
      if (modelName.includes('mid') || modelName.includes('graph')) {
        options.type = 'graph'
      } else if (modelName.includes('inception')) {
        options.size = 299
      }
      
      this.model = await nsfw.load(this.localModelIOHandler(), options)
      this.isInitialized = true
      Log.i(`NSFWJS 模型加载成功: ${modelName}，使用 WASM 后端`)
    } catch (error) {
      Log.e('NSFWJS 模型加载失败', error)
      throw error
    }
  }

  /**
   * 图像预处理
   */
  async preprocessImage(buffer) {
    const image = await Jimp.read(buffer)
    const width = image.bitmap.width
    const height = image.bitmap.height
    const rgbaData = image.bitmap.data

    const rgbData = new Uint8Array(width * height * 3)
    for (let i = 0, j = 0; i < rgbaData.length; i += 4, j += 3) {
      rgbData[j] = rgbaData[i]         // R
      rgbData[j + 1] = rgbaData[i + 1] // G
      rgbData[j + 2] = rgbaData[i + 2] // B
    }

    return tf.tensor3d(rgbData, [height, width, 3], 'int32')
  }

  /**
   * 鉴定图片色情程度
   * @param {Buffer} buffer 图片 Buffer
   * @returns {Promise<Object>} 鉴定结果字典
   */
  async classify(buffer) {
    await this.init()
    
    let image
    try {
      image = await this.preprocessImage(buffer)
      const predictions = await this.model.classify(image)
      
      const result = {}
      for (const pred of predictions) {
        result[pred.className] = pred.probability
      }
      return result
    } catch (error) {
      Log.e('图片审核过程中发生错误', error)
      return null
    } finally {
      if (image) {
        image.dispose()
      }
    }
  }
}

const nsfwService = new NSFWService()

/**
 * 兼容原有接口
 * @param {Buffer} buffer 
 * @returns 
 */
export async function nsfwjs(buffer) {
  return await nsfwService.classify(buffer)
}

export default nsfwService