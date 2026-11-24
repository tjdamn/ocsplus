<div align="center">

<div style="padding:8px;border-radius:100%;background:white;width:124px;height:124px">
<img src="docs/logo.png" width=124 height=124  >
</div>

# OCS 网课助手

> OCS (Online Course Script) 网课刷课脚本，帮助大学生解决网课难题

![GitHub Repo stars](https://img.shields.io/github/stars/ocsjs/ocsjs)
![npm](https://img.shields.io/npm/v/ocsjs?color=red)
![NPM](https://img.shields.io/npm/l/ocsjs)
![今日安装](https://img.shields.io/badge/dynamic/json?color=orange&label=今日安装&query=$.data.today_install&url=https://scriptcat.org/api/v2/scripts/367)
![总共安装](https://img.shields.io/badge/dynamic/json?color=red&label=总共安装&query=$.data.total_install&url=https://scriptcat.org/api/v2/scripts/367)

</div>
 
<div align="center">

## 官网及教程 [https://docs.ocsjs.com](https://docs.ocsjs.com)

</div>

## DeepSeek 版

本分支通过 DeepSeek 生成答案，沿用 OCS 各平台的题目提取和页面操作。API Key 保存在脚本管理器中。答题时会向 DeepSeek 发送题干、选项和启用的题目图片。

### 构建和安装

在仓库根目录安装依赖并构建。使用 Node.js 22 或更新版本以及 pnpm 10。

```bash
pnpm install --frozen-lockfile
pnpm build
```

1. 将 `dist/ocs.user.js` 导入脚本猫或油猴。
2. 打开 OCS 的「通用 → 全局设置」，保存 DeepSeek API Key。
3. 点击「测试连接」发送一道固定样题。连接成功后，可在「通用 → 在线搜题」手动试题，或进入平台支持的答题页面。

超星和中国大学 MOOC 的试卷提交方式默认是「自动保存（不提交）」。可在全局设置更改，答题结果面板会显示已填、请求失败和未填的数量。

`pnpm test` 运行答案匹配测试和 DeepSeek 模拟测试。构建也会运行这两组测试。
