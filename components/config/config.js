import YAML from 'yaml'
import fs from 'fs'
import { pluginRoot } from '../../model/path.js'
import Log from '../../utils/logs.js'

class Config {
  getConfig() {
    try {
      const config_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config/config.yaml`, 'utf-8')
      )
      return config_data
    } catch (err) {
      Log.e('读取config.yaml失败', err)
      return false
    }
  }

  getDefConfig() {
    try {
      const config_default_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config_default.yaml`, 'utf-8')
      )
      return config_default_data
    } catch (err) {
      Log.e('读取config_default.yaml失败', err)
      return false
    }
  }

  setConfig(config_data) {
    try {
      fs.writeFileSync(
        `${pluginRoot}/config/config/config.yaml`,
        YAML.stringify(config_data),
      )
      return true
    } catch (err) {
      Log.e('写入config.yaml失败', err)
      return false
    }
  }

  getPolicy() {
    try {
      const policy_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/config/policy.yaml`, 'utf-8')
      )
      return policy_data
    } catch (err) {
      Log.e('读取policy.yaml失败', err)
      return false
    }
  }

  getDefPolicy() {
    try {
      const policy_default_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/config/policy_default.yaml`, 'utf-8')
      )
      return policy_default_data
    } catch (err) {
      Log.e('读取policy_default.yaml失败', err)
      return false
    }
  }

  setPolicy(policy_data) {
    try {
      fs.writeFileSync(
        `${pluginRoot}/config/config/policy.yaml`,
        YAML.stringify(policy_data),
      )
      return true
    } catch (err) {
      Log.e('写入policy.yaml失败', err)
      return false
    }
  }

  getHistory() {
    try {
      const history_data = YAML.parse(
        fs.readFileSync(`${pluginRoot}/resources/history/history.yaml`, 'utf-8')
      )
      return history_data
    } catch (err) {
      Log.e('读取history.yaml失败', err)
      return false
    }
  }

  setHistory(history_data) {
    try {
      fs.writeFileSync(
        `${pluginRoot}/resources/history/history.yaml`,
        YAML.stringify(history_data),
      )
      return true
    } catch (err) {
      Log.e('写入history.yaml失败', err)
      return false
    }
  }
}

export default new Config()
