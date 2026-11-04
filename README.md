<div align="center">
<br>
<img width="200" src="https://raw.githubusercontent.com/Script-Hub-Org/Script-Hub/main/assets/icon-dark.png" alt="Script Hub">
<br>
<br>
<h1 align="center">Script Hub<h1>
</div>

<p align="center" color="#6a737d">
Advanced Script Converter for QX, Loon, Surge, Stash, Egern, LanceX and Shadowrocket
</p>
<p align="center" color="#6a737d">
重写 & 规则集转换
</p>

## 社群

👏🏻 欢迎加入社群进行交流讨论

👥 群组 [张佩服(群组)](https://t.me/zhangpeifu) & [折腾啥(群组)](https://t.me/zhetengsha_group)

📢 频道 [张佩服(频道)](https://t.me/h5683577) & [折腾啥(频道)](https://t.me/zhetengsha)

## 简介

• 支持将 QX 重写解析至 Surge Shadowrocket Loon Stash

• 支持将 Surge 模块解析至 Loon Stash

• 支持将 Loon 插件解析至 Surge Shadowrocket Stash

• Beta 支持将 Loon 3.5.1+ Script v2 转换为 Surge/Egern、Shadowrocket、Stash 或 Loon 插件

• 支持 QX & Surge & Loon & Shadowrocket & Clash 规则集解析，适用 app: Surge Shadowrocket Stash Loon

• 支持 将 QX 脚本转换成 Surge 脚本(兼容)

• 可以修改参数 argument

• 支持一键导入 Shadowrocket / Loon / Stash

• 高级功能 OR 修改任意文本

• 如果某些模块需要 `加参数才能使用` 但只想用远程链接，不想拉取到本地模块的情况 可以直接使用 `纯文本` -> `高级操作`、`修改参数` 功能修改远程链接 `任意内容` 或者 `argument` 参数, 不用再复制到本地模块

• [🆕 不需要代理 app 的全服务器部署版(测试中)](<https://github.com/Script-Hub-Org/Script-Hub/wiki/%E5%85%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%89%88(%E6%B5%8B%E8%AF%95%E4%B8%AD)>)

• 相关生态: [Surge 模块工具](https://github.com/Script-Hub-Org/Script-Hub/wiki/%E7%9B%B8%E5%85%B3%E7%94%9F%E6%80%81:-Surge-%E6%A8%A1%E5%9D%97%E5%B7%A5%E5%85%B7) 支持一键导入 Surge， 需要下载「Scriptable」app. 如果想把其他非 Script Hub 转换的 模块放在本地, 也可单独用此脚本

## 文档

[安装体验请查看文档](https://github.com/Script-Hub-Org/Script-Hub/wiki)

## Loon Script v2 跨端转换（Beta）

Beta 支持 Loon Script v2 的 `request`、`response`、`cron`、`network-changed`、`generic` 触发器，可转换为 Surge/Egern、Shadowrocket 和 Stash；转换为 Loon 时保留原生 v2 语法。

会保留可映射的 `timeout`、`enable`、`requires_body`、`binary_body_mode` 和脚本参数。`binary_body_mode` 不等同于 `requires_body`，需要完整响应体时请在源脚本显式设置 `requires_body=true`。WASM、加密逻辑和脚本内容不会被解密或改写，只转换宿主配置。

Surge/Shadowrocket 支持 Loon Rewrite Action 的 `reject*`、`response.json.*`、`*.body.*`、`*.header.*`、`redirect`、`url.replace`；JSON 映射为 Body Rewrite 的 jq，`jq_file` 由转换器服务端读取并内联。无法等价转换的条件或参数会提示，不会静默丢失。

不兼容项（如方法、响应状态码、Header 组合条件、`debug`）会进入提示。`network-changed` 映射为 Surge/Shadowrocket 的 `event-name=network-changed`，Stash 保留诊断；`img_url` 在 Loon 保留，Stash Generic 映射为 Tile `icon`，其他目标提示不支持。Shadowrocket 不支持 Generic/Tile Script；Stash 动态 `enable` 会转为注释。Loon 原生 v2 与旧式 Script 混排时保持源顺序。

Beta 模块使用官方 `main` 解析器，回归测试：

```bash
npm run test:loon-v2
```

参考：[Loon Script v2 文档](https://nsloon.app/docs/Script/script_v2/)

## Stash 覆写转换（Beta）

- **直接安装**：启用 Beta Stash 模块后，可在 Stash 中直接安装 `.plugin`、`.lpx`、`.sgmodule` 链接（允许 GitHub 的 `?raw=true` 等查询参数），模块会把 Stash 自身发起的下载转换为覆写；浏览器等其他客户端的请求原样放行。支持 `raw.githubusercontent.com`（`github.com/.../blob/...?raw=true` 会跳转到这里）、`gist.githubusercontent.com`、`gitlab.com`、`cdn.jsdelivr.net`、`fastly.jsdelivr.net`、`kelee.one`；其他域名需把主机名加入模块的 MitM 与匹配规则，或继续使用 `script.hub` 转换链接。
- **参数**：Surge `#!arguments`/`#!arguments-desc` 与 Loon `[Argument]` 转为 Stash 覆写参数（`arguments-version: 1`，iOS/tvOS 3.7+、macOS 4.4+），引用改为 `${args.name}`，可在 Stash 的「参数」中修改。Loon `select` 保留全部选项，`switch` 对应开关；单独作为脚本 `argument` 的布尔参数以字符串 `true`/`false` 选项声明，作为 `timeout` 的整数参数声明为 `value-type: integer`。旧版 Stash 可在转换链接加 `stashArgs=false`，按默认值写死。
- **无法动态表达的部分**：Stash 脚本没有启停字段，`enable={参数}` 与 Surge 行首参数按默认值启用或注释，并给出提示；MitM 主机名参数的默认值含逗号时按默认值展开。
- **响应脚本兼容**：Surge 脚本无参调用 `$done()` 表示不修改，Stash 的响应脚本这样放行后 App 会反复重试（例如 YouTube 评论加载不出来）。转换后的覆写里，响应脚本经 `script.hub/convert` 下载，脚本转换在原脚本外包一层，改为带回原始 body，原脚本内容不变；只处理覆写中引用的响应脚本。转换链接加 `stashDoneFix=false` 可关闭。
- **其他映射**：`[Host]` → `hosts`（Loon `use-in-proxy=true` 同时写入 `proxy-hosts`；`server:`/`script:` 不支持）；文本/Base64 Map Local 与 Loon Mock → 原生 `mock`（远程文件仍使用 echo-response 脚本）；JSON 修改使用原生 jq Body Rewrite；Surge `[Panel]` 的标题、内容、图标、颜色、刷新间隔 → Tile；脚本 `engine=webview` → `webkit`；只保留 Stash 使用的元信息字段。

## 鸣谢

Powered by [_@Chavy‘s_](https://github.com/chavyleung) [Env.js](https://github.com/chavyleung/scripts)  
原脚本作者 @小白脸  
脚本修改[_@chengkongyiban_](https://github.com/chengkongyiban)  
大量借鉴[_@KOP-XIAO_](https://github.com/KOP-XIAO)佬的[resource-parser.js](https://github.com/KOP-XIAO/QuantumultX/raw/master/Scripts/resource-parser.js)  
感谢[_@xream_](https://github.com/xream) 佬提供与 [_@keywos_](https://github.com/keywos) 修改 `本项目 Script Hub 网页前端`, [replace-header.js](https://raw.githubusercontent.com/Script-Hub-Org/Script-Hub/main/scripts/replace-header.js)，[echo-response.js](https://raw.githubusercontent.com/Script-Hub-Org/Script-Hub/main/scripts/echo-response.js)，[script-converter.js](https://raw.githubusercontent.com/Script-Hub-Org/Script-Hub/main/script-converter.js)  
感谢[_@mieqq_](https://github.com/mieqq) 佬提供的[replace-body.js](https://github.com/mieqq/mieqq/raw/master/replace-body.js), 本项目中已进行修改  
感谢[_@Maasea_](https://github.com/Maasea) 佬的指导  
项目 logo 感谢 [_@Toperlock_](https://github.com/Toperlock)  
插件图标用的 [_@Keikinn_](https://github.com/Keikinn) 佬的 [StickerOnScreen](https://github.com/KeiKinn/StickerOnScreen)项目，以及 [_@Toperlock_](https://github.com/Toperlock) 佬的 [QX 图标库](https://github.com/Toperlock/Quantumult/tree/main/icon)项目，感谢

## 开发

`pnpm preview` html 内容的本地预览

## 赞助

支持我们的工作

[Patreon](https://www.patreon.com/scripthuborg)
