# 扭蛋

打开就随机甩给你一样东西（笑话 / 外语 / 知识点 / 书介绍），点一下换一个，专治无聊。内容由 DeepSeek 实时生成。

## 运行

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 设置 API key

首次打开会弹出设置框，粘贴你的 DeepSeek API key（在 https://platform.deepseek.com 获取）。key 只保存在本机浏览器的 localStorage 里。之后想更换，点右上角齿轮。

## 说明

- 内容类型：笑话、外文句子（原文 + 翻译 + 语种）、知识点、书介绍
- 盲抽，无选择；连抽不会连续出现同一类
- 提示词里已加防编造约束：知识点只出常识级事实，书只推荐真实存在的经典书
