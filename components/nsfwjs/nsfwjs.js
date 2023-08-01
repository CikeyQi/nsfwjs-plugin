import nsfw from 'nsfwjs'
import tf from '@tensorflow/tfjs-node'

/**
 * 通过图片Buffer判断是否为色情图片
 * @param {*} Buffer 图片Buffer
 * @returns 
 */
export async function nsfwjs(Buffer) {
  const model = await nsfw.load()
  const image = await tf.node.decodeImage(Buffer, 3)
  const predictions = await model.classify(image)
  image.dispose()
  let result = {}
  for (const key in predictions) {
    result[predictions[key].className] = predictions[key].probability
  }
  tf.dispose([model])
  return result
}