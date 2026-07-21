import YAML from 'yaml'
import fs from 'fs'
import { pluginRoot } from '../../model/path.js'
import Log from '../../utils/logs.js'

class Config {
  constructor() {
    this.config = null
    this.policy = null
    this.history = null
    
    // Config paths
    this.configPath = `${pluginRoot}/config/config/config.yaml`
    this.defConfigPath = `${pluginRoot}/config/config_default.yaml`
    this.policyPath = `${pluginRoot}/config/config/policy.yaml`
    this.defPolicyPath = `${pluginRoot}/config/policy_default.yaml`
    this.historyPath = `${pluginRoot}/resources/history/history.yaml`
    
    this.watchConfig()
  }

  /**
   * 监听配置文件变动
   */
  watchConfig() {
    const watchFile = (filePath, callback) => {
      if (fs.existsSync(filePath)) {
        fs.watch(filePath, (event) => {
          if (event === 'change') {
            callback()
          }
        })
      }
    }
    
    watchFile(this.configPath, () => {
      Log.i('检测到 config.yaml 变动，重新加载配置')
      this.config = null
    })
    
    watchFile(this.policyPath, () => {
      Log.i('检测到 policy.yaml 变动，重新加载策略')
      this.policy = null
    })
    
    watchFile(this.historyPath, () => {
      Log.i('检测到 history.yaml 变动，重新加载历史记录')
      this.history = null
    })
  }

  /**
   * 读取通用 YAML
   */
  _readYaml(filePath) {
    try {
      if (!fs.existsSync(filePath)) return null
      return YAML.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch (err) {
      Log.e(`读取 YAML 文件失败: ${filePath}`, err)
      return null
    }
  }
  
  /**
   * 写入通用 YAML
   */
  _writeYaml(filePath, data) {
    try {
      fs.writeFileSync(filePath, YAML.stringify(data))
      return true
    } catch (err) {
      Log.e(`写入 YAML 文件失败: ${filePath}`, err)
      return false
    }
  }

  getConfig() {
    if (!this.config) {
      this.config = this._readYaml(this.configPath) || this.getDefConfig()
    }
    return this.config
  }

  getDefConfig() {
    return this._readYaml(this.defConfigPath) || {}
  }

  setConfig(config_data) {
    if (this._writeYaml(this.configPath, config_data)) {
      this.config = config_data
      return true
    }
    return false
  }

  getPolicy() {
    if (!this.policy) {
      this.policy = this._readYaml(this.policyPath) || this.getDefPolicy()
    }
    return this.policy
  }

  getDefPolicy() {
    return this._readYaml(this.defPolicyPath) || {}
  }

  setPolicy(policy_data) {
    if (this._writeYaml(this.policyPath, policy_data)) {
      this.policy = policy_data
      return true
    }
    return false
  }

  getHistory() {
    if (!this.history) {
      this.history = this._readYaml(this.historyPath) || { white_pic_md5: [] }
    }
    return this.history
  }

  setHistory(history_data) {
    if (this._writeYaml(this.historyPath, history_data)) {
      this.history = history_data
      return true
    }
    return false
  }
}

export default new Config()
