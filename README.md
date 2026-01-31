# 华韵非遗传播 - 中国非遗宣传官网（静态多页面模板）

这是一个**纯前端**多页面官网模板（HTML/CSS/JS），风格偏传统：宣纸底、墨色、朱砂与金线，并加入了：
- 顶部滚动进度条
- 页面过渡“印章”效果
- Canvas 灯笼漂浮动效（自绘，不用 AI 图片）
- 滚动进入动画（AOS）
- 轮播（Swiper）
- 图片灯箱（GLightbox）
- 卡片轻微 3D 倾斜（VanillaTilt）

## 目录结构
- `index.html` 首页
- `heritage.html` 非遗项目库（带筛选）
- `cases.html` 宣传服务/案例
- `news.html` 活动资讯
- `about.html` 关于我们
- `contact.html` 联系我们（含演示表单）
- `credits.html` 图片来源与授权说明
- `assets/css/main.css`
- `assets/js/main.js` `assets/js/lanterns.js`
- `assets/img/` 示例图片（来自 Wikimedia Commons，详见 `credits.html`）

## 如何本地预览
任意静态服务器都可，例如：

```bash
cd ich_site
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 需要替换的公司信息
在每个页面顶部与页脚已经写入示例信息：
- 公司名：华韵非遗传播有限公司
- 电话：400-123-4567 / 010-8888-6666
- 邮箱：info@huayun-ich.com
- 地址：北京市朝阳区·示例路 88 号（示例地址）
- 备案号：京ICP备00000000号-1（示例）

请按您的真实信息替换即可。

## 表单说明
`contact.html` 的“在线留言”为演示版（前端提示，不会真实发送）。
如需真实收集，可接入：
- 您自己的后端接口
- 企业微信/飞书机器人
- 第三方表单（Formspree、Tally 等）

## 图片版权
示例图片均来自 Wikimedia Commons，对应许可见 `credits.html`。
上线前请确保您替换/新增的图片也有合法授权。
