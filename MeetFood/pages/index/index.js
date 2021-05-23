var util = require('../../utils/util')
var app = getApp()

Page({
  data: {
    PageCur: 'home',
    newBookingData: {},
    pageTitle: ['遇见食途', '遇见食途', '遇见食途', '我的食途']
  },

  onLoad() {
    let that = this
    console.log('index-onLoad');
    this.mySetNavigationBarTitle(this.data.pageTitle[0])
  },

  mySetNavigationBarTitle(title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },
  
  NavChange(e) {
    let cur = e.currentTarget.dataset.cur || e.detail.PageCur
    let pageTitle = this.data.pageTitle

    if (cur == 'home') {
      this.mySetNavigationBarTitle(pageTitle[0])
    } else if (cur == 'booking') {
      this.mySetNavigationBarTitle(pageTitle[1])
    } else if (cur == 'search') {
      this.mySetNavigationBarTitle(pageTitle[2])
    }

    this.setData({
      PageCur: cur
    })
  },

  // 处理点击 user
  onGetUserInfo(e) {
    let userInfo = app.globalData.userInfo
    let pageTitle = this.data.pageTitle
    let cur = e.currentTarget.dataset.cur || e.detail.PageCur
    console.log(userInfo);

    if (userInfo) {
      this.mySetNavigationBarTitle(pageTitle[3])
      this.setData({
        PageCur: cur
      })
    } else {
      // 缓存中未存有用户信息
      // 调用自定义模态框 模拟授权
      util.showModal({
          title: '微信授权',
          content: '用微信授权登录，使用遇见食途完成功能',
          confirmText: '继续'
        })
        .then(res => {
          if (res.confirm) {
            // 点击继续 调用授权
            wx.getUserProfile({
                desc: '展示用户信息'
              })
              .then(value => {
                // 授权成功
                wx.showLoading({
                  title: '正在加载',
                  mask: true,
                  success: () => {
                    console.log(value, '成功获取用户数据');
                    wx.setStorageSync('userInfo', value)
                    app.globalData.userInfo = value
                    setTimeout(() => {
                      wx.hideLoading()
                      this.mySetNavigationBarTitle(pageTitle[3])
                      this.setData({
                        PageCur: cur
                      })
                    }, 300)
                  }
                })
              })
              .catch(reason => {
                // 拒绝授权
                console.log(reason, '拒绝授权');
                wx.showLoading({
                  title: '正在加载',
                  mask: true
                })
                setTimeout(() => {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '授权后获取更多权益哦',
                    showCancel: false,
                    confirmText: '我知道了'
                  })
                }, 300)
              })
          }
        })
        .catch(err => {
          console.log("点击了取消", err);
        })
    }
  },

  // 监听页面
  onShow() {},
})