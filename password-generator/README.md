# 🔐 密码生成器 (Password Generator)

纯前端密码生成器，使用 `crypto.getRandomValues` 生成高强度随机密码，数据完全在本地浏览器生成，不上传。

## 功能
- 可调长度（4–64），可选大写 / 小写 / 数字 / 符号
- 可排除易混淆字符（0 O 1 l I）
- 实时强度评估（基于信息熵）与一键复制
- 保证每个选中的字符集至少出现一次

## 本地运行
直接用浏览器打开 `index.html` 即可。

## 发布到网页
把整个文件夹上传到任意静态托管即可：

- GitHub Pages / Vercel / Netlify / Cloudflare Pages
- 或把 `index.html`、`styles.css`、`app.js` 放到任意静态服务器 / 对象存储（如 OSS、COS）
