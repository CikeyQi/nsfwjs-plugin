![nsfwjs-plugin](https://socialify.git.ci/CikeyQi/nsfwjs-plugin/image?description=1&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto)

<img decoding="async" align=right src="resources/readme/girl.png" width="35%">

# NSFWJS-PLUGIN🍒

- 一个适用于 [Yunzai 系列机器人框架](https://github.com/yhArcadia/Yunzai-Bot-plugins-index) 的违规图片识别插件，保护聊天环境

- 使用轻便的 [NSFWJS](https://github.com/infinitered/nsfwjs) 作为模型，本地 CPU 即可运行，性能要求极低，成本几乎为 0

- **使用中遇到问题请加 QQ 群咨询：[707331865](https://qm.qq.com/q/TXTIS9KhO2)**

> [!TIP]
> 闲着没事想复活一下之前 [渔火](https://github.com/yhArcadia) 的色图监听插件，为了节约成本我就想到了本地部署，偶遇 NSFWJS，发现这个模型体量小准确率还不错，就写了这个插件

## 安装插件

#### 1. 克隆仓库

```
git clone https://github.com/CikeyQi/nsfwjs-plugin.git ./plugins/nsfwjs-plugin
```

> [!NOTE]
> 如果你的网络环境较差，无法连接到 Github，可以使用 [GitHub Proxy](https://mirror.ghproxy.com/) 提供的文件代理加速下载服务
>
> ```
> git clone https://mirror.ghproxy.com/https://github.com/CikeyQi/nsfwjs-plugin.git ./plugins/nsfwjs-plugin
> ```

#### 2. 安装依赖

```
pnpm install --filter=nsfwjs-plugin
```

## 功能列表

请使用 `#NSFWJS帮助` 获取完整帮助

- [x] 识别违规图片
- [x] 违规图片通知主人
- [x] 违规图片保存到本地
- [x] 对违规人员进行处罚

## 常见问题

1. 安装依赖报错
   - 请查看本插件 [Issues](https://github.com/CikeyQi/nsfwjs-plugin/issues) 中的解决方案
2. 报错：TypeError: fetch failed
   - nsfwjs 本身问题，暂时没有解决方法

## 支持与贡献

如果你喜欢这个项目，请不妨点个 Star🌟，这是对开发者最大的动力， 当然，你可以对我 [爱发电](https://afdian.net/a/sumoqi) 赞助，呜咪~❤️

有意见或者建议也欢迎提交 [Issues](https://github.com/CikeyQi/nsfwjs-plugin/issues) 和 [Pull requests](https://github.com/CikeyQi/nsfwjs-plugin/pulls)。

## 相关项目

- [nsfwjs](https://github.com/infinitered/nsfwjs)：NSFW detection on the client-side via TensorFlow.js

## 许可证

本项目使用 [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) 作为开源许可证。
