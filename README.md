# MeetFood-wx
GPS自动定位获取周边POI餐饮服务，实现未到店先预约，并实时更新可预订座位，解决用户到店排队，门口人群拥挤等问题

1.用户通过我们平台就能快速查看多个商家的招牌菜谱等，快速找到自己心仪的门店和菜品。

2.到店消费，通过小程序就能提前预约、在线点餐、支付，不需要到店取号排队，提升用户的就餐体验，提升餐厅的翻台率。

3.通过积分系统，用户消费就能自动成为会员，第二次买单的时候就能自动判别，享受优惠、折扣等对老用户来说，非常实在。


## 首先需要引入组件
### [weilanwl/ColorUI: 鲜亮的高饱和色彩，专注视觉的小程序组件库 (github.com)](https://github.com/weilanwl/ColorUI)
- 下载源码解压获得`/demo`，复制目录下的 `/colorui` 文件夹到你的项目根目录
`App.wxss` 引入关键Css `main.wxss` `icon.wxss`
```css
/*app.wxss*/
@import "colorui/main.wxss";
@import "colorui/icon.wxss";
```

### [Vant - 轻量、可靠的移动端组件库 (gitee.io)](https://vant-contrib.gitee.io/vant-weapp/#/quickstart)
- 在小程序项目根目录下执行
```js
npm init -y
npm i @vant/weapp -S --productiion
```
- 去除app.json 中的 `"style": "v2"`，小程序的[新版基础组件](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#style)强行加上了许多样式，难以覆盖，不关闭将造成部分组件样式混乱
- 构建项目（工具）


#### 踩坑
- [说说如何安装与配置 Vant Weapp 小程序 UI 组件库 - 简书 (jianshu.com)](https://www.jianshu.com/p/db7103a76430)
- [npm构建后没有生成miniprogram\_npm文件？ | 微信开放社区 (qq.com)](https://developers.weixin.qq.com/community/develop/doc/0004c6c95000e0d09bfa55b3b5bc00)
- [微信小程序npm安装vant并使用 - 小白&小菜 - 博客园 (cnblogs.com)](https://www.cnblogs.com/duanzhenzhen/p/11162766.html)

### [meili/minui: 基于规范的小程序 UI 组件库，自定义标签组件，简洁、易用、工具化 (github.com)](https://github.com/meili/minui)
#### 在小程序根目录的上一级目录安装 [Min命令](https://www.bookstack.cn/read/MinUI-munal/71cd66c60191c6fb.md)
```js
npm install -g @mindev/min-cli
```
#### [已有小程序项目 - 安装组件 - 《MinUI 使用手册(开发文档)》 - 书栈网 · BookStack](https://www.bookstack.cn/read/MinUI-munal/5faf9584a47e854f.md) 
- `在小程序根目录中执行`
- 根据需求安装 Min组件

```js
min install @minui/wxc-abnor //异常流
```
#### 使用组件
- 在json文件配置所用的组件
```json
"wxc-abnor": "../../dist/packages/@minui/wxc-abnor/dist/index"
```

### WeUI [快速上手 | 微信开放文档 (qq.com)](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/quickstart.html)

#### 配置微信小程序使用less文件
- 现在vscode编译器安装`Easy Less`插件
- [小程序使用less编译方法 | 微信开放社区 (qq.com)](https://developers.weixin.qq.com/community/develop/article/doc/0008a475b40fd0c53c4bd0f905bc13)
```js
npm i weui-miniprogram
```
- 同上 去构建就好了
