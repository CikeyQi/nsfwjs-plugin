import fs from 'fs'
import Config from '../components/config/config.js'
import { pluginRoot } from '../model/path.js'
import Log from '../utils/logs.js'

class Init {
  constructor() {
    this.initConfig()
    this.initPolicy()
  }

  initConfig() {
    const config_default_yaml = `${pluginRoot}/config/config_default.yaml`
    if (!fs.existsSync(config_default_yaml)) {
      Log.e('默认设置文件不存在，请检查或重新安装插件')
      return true
    }
    const config_yaml = `${pluginRoot}/config/config/config.yaml`
    if (!fs.existsSync(config_yaml)) {
      Log.e('设置文件不存在，将使用默认设置文件')
      fs.copyFileSync(config_default_yaml, config_yaml)
    }
    const config_default_data = Config.getDefConfig()
    const config_data = Config.getConfig()
    for (const key in config_default_data) {
      if (!(key in config_data)) {
        config_data[key] = config_default_data[key]
      }
    }
    for (const key in config_data) {
      if (!(key in config_default_data)) {
        delete config_data[key]
      }
    }
    Config.setConfig(config_data)
  }

  initPolicy() {
    const policy_default_yaml = `${pluginRoot}/config/policy_default.yaml`
    if (!fs.existsSync(policy_default_yaml)) {
      Log.e('默认策略文件不存在，请检查或重新安装插件')
      return true
    }
    const policy_yaml = `${pluginRoot}/config/config/policy.yaml`
    if (!fs.existsSync(policy_yaml)) {
      Log.e('策略文件不存在，将使用默认策略文件')
      fs.copyFileSync(policy_default_yaml, policy_yaml)
    }
    // 同步default策略文件中全局键与策略文件全局键
    const policy_default_data = Config.getDefPolicy()
    const policy_data = Config.getPolicy()
    for (const key in policy_default_data.group.default) {
      if (!(key in policy_data.group.default)) {
        policy_data.group.default[key] = policy_default_data.group.default[key]
      }
    }
    for (const key in policy_data.group.default) {
      if (!(key in policy_default_data.group.default)) {
        delete policy_data.group.default[key]
      }
    }
    Config.setPolicy(policy_data)
  }
}

export default new Init()
