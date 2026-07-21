import Config from "./components/config/config.js";
import lodash from "lodash";
import path from "path";
import fs from "fs";
import { pluginRoot } from "./model/path.js";

export function supportGuoba() {
  // 获取所有可用的模型目录
  const modelsDir = path.join(pluginRoot, 'resources/models');
  let availableModels = [];
  try {
    if (fs.existsSync(modelsDir)) {
      availableModels = fs.readdirSync(modelsDir).filter(file => {
        const stat = fs.statSync(path.join(modelsDir, file));
        return stat.isDirectory();
      }).map(model => ({
        label: model,
        value: model
      }));
    }
  } catch (e) {
    console.error('获取模型列表失败', e);
  }

  // 如果没有找到模型，提供一个默认的占位符
  if (availableModels.length === 0) {
    availableModels.push({ label: 'mobilenet_v2', value: 'mobilenet_v2' });
  }

  return {
    pluginInfo: {
      name: 'nsfwjs-plugin',
      title: '色图监听插件',
      author: ['@CikeyQi', '@erzaozi'],
      authorLink: ['https://github.com/CikeyQi', 'https://github.com/erzaozi'],
      link: 'https://github.com/CikeyQi/nsfwjs-plugin',
      isV3: true,
      isV2: false,
      showInMenu: true,
      description: '基于 Yunzai 的涩图监听插件，使用 NSFWJS 模型',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'openmoji:stop-sign',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      iconColor: '#dc143c',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      iconPath: path.join(pluginRoot, 'resources/readme/girl.png'),
    },
    configInfo: {
      schemas: [
        {
          component: "Divider",
          label: "开关 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "listen.enable",
          label: "监听开关",
          bottomHelpMessage: "监听消息总开关",
          component: "Switch",
        },
        {
          field: "examine.enable",
          label: "主动审核开关",
          bottomHelpMessage: "主动审核开关",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "模型 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "model_name",
          label: "识别模型",
          bottomHelpMessage: "选择用于图像分类的模型（仅显示 resources/models 下已放置的模型）",
          component: "Select",
          componentProps: {
            options: availableModels,
            placeholder: '请选择识别模型',
          },
        },
        {
          component: "Divider",
          label: "审核 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "threshold.porn",
          label: "色情阈值",
          bottomHelpMessage: "大于该值判定为色情",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入色情阈值',
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        {
          field: "threshold.sexy",
          label: "性感阈值",
          bottomHelpMessage: "大于该值判定为性感",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入性感阈值',
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        {
          field: "threshold.hentai",
          label: "变态阈值",
          bottomHelpMessage: "大于该值判定为变态",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入变态阈值',
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        {
          field: "warn_text",
          label: "警告文本",
          bottomHelpMessage: "违规时，发送的警告文本",
          component: "Input",
          componentProps: {
            placeholder: '请输入警告文本',
          },
        },
        {
          component: "Divider",
          label: "群组 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "notice_user",
          label: "通知用户",
          bottomHelpMessage: "如果有人触发违规，通知的用户",
          component: "GTags",
          componentProps: {
            placeholder: '请输入用户ID',
            allowAdd: true,
            allowDel: true,
            showPrompt: true,
            promptProps: {
              content: '请输入用户ID',
              placeholder: '',
              okText: '添加',
              rules: [
                { required: true, message: '用户ID不能为空' },
              ],
            },
            valueParser: ((value) => value.split(',') || []),
          },
        },
        {
          field: "white_user_list",
          label: "白名单用户",
          bottomHelpMessage: "白名单用户，不会触发警告",
          component: "GTags",
          componentProps: {
            placeholder: '请输入用户ID',
            allowAdd: true,
            allowDel: true,
            showPrompt: true,
            promptProps: {
              content: '请输入用户ID',
              placeholder: '',
              okText: '添加',
              rules: [
                { required: true, message: '用户ID不能为空' },
              ]
            }
          }
        },
        {
          field: "black_user_list",
          label: "黑名单用户",
          bottomHelpMessage: "黑名单用户，不会触发警告",
          component: "GTags",
          componentProps: {
            placeholder: '请输入用户ID',
            allowAdd: true,
            allowDel: true,
            showPrompt: true,
            promptProps: {
              content: '请输入用户ID',
              placeholder: '',
              okText: '添加',
              rules: [
                { required: true, message: '用户ID不能为空' },
              ]
            }
          }
        },
        {
          field: "white_group_list",
          label: "白名单模式",
          bottomHelpMessage: "在白名单模式下，只有白名单群组才会触发警告",
          component: "GTags",
          componentProps: {
            placeholder: '请输入群组ID',
            allowAdd: true,
            allowDel: true,
            showPrompt: true,
            promptProps: {
              content: '请输入群组ID',
              placeholder: '',
              okText: '添加',
              rules: [
                { required: true, message: '群组ID不能为空' },
              ]
            }
          }
        },
        {
          field: "black_group_list",
          label: "黑名单模式",
          bottomHelpMessage: "在黑名单模式下，黑名单群组不会触发警告",
          component: "GTags",
          componentProps: {
            placeholder: '请输入群组ID',
            allowAdd: true,
            allowDel: true,
            showPrompt: true,
            promptProps: {
              content: '请输入群组ID',
              placeholder: '',
              okText: '添加',
              rules: [
                { required: true, message: '群组ID不能为空' },
              ]
            }
          }
        },
        {
          component: "Divider",
          label: "其他 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "save_path",
          label: "违规图片保存路径",
          bottomHelpMessage: "违规图片保存路径",
          component: "Input",
          componentProps: {
            placeholder: '请输入违规图片保存路径，可用变量：{group_id}、{user_id}、{time}',
          },
        },
      ],
      getConfigData() {
        let config = Config.getConfig()
        return config
      },

      setConfigData(data, { Result }) {
        let config = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value)
        }
        config = lodash.merge({}, Config.getConfig(), config)
        config.notice_user = (data['notice_user'] || []).map(ele => isNaN(ele) ? ele : Number(ele))
        config.white_user_list = (data['white_user_list'] || []).map(ele => isNaN(ele) ? ele : Number(ele))
        config.black_user_list = (data['black_user_list'] || []).map(ele => isNaN(ele) ? ele : Number(ele))
        config.white_group_list = (data['white_group_list'] || []).map(ele => isNaN(ele) ? ele : Number(ele))
        config.black_group_list = (data['black_group_list'] || []).map(ele => isNaN(ele) ? ele : Number(ele))
        
        // 当模型更改时，清空当前内存中的模型以便下次调用重新加载
        if (config.model_name && config.model_name !== Config.getConfig().model_name) {
          try {
            const NSFWService = import('./components/nsfwjs/nsfwjs.js').then(module => {
              module.default.model = null
              module.default.isInitialized = false
            }).catch(() => {})
          } catch (e) {}
        }
        
        Config.setConfig(config)
        return Result.ok({}, '保存成功~')
      },
    },
  }
}
