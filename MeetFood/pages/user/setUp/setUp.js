var app = getApp()
var getData = require('../../../utils/getData')

Page({
  data: {},
  onLoad: function (options) {
    console.log('setUp-onLoad');
    let line = [{
      title: '头像',
      value: getData.userAvatarSrc,
    }, {
      title: '昵称',
      value: ''
    }, {
      title: '绑定手机号',
      value: ''
    }, {
      title: '反馈',
      value: ''
    }, {
      title: '关于遇见食途',
      value: '测试版 1.0.0'
    }, ]
    let cloudUserData = app.globalData.cloudUserData
    line[0].value = cloudUserData.AVATAR_URL
    line[1].value = cloudUserData._NICKNAME
    line[2].value = cloudUserData.PHONE_NUMBER

    this.setData({
      line: line
    })
  },
  onLogout(e) {
    // 清除一切缓存
    try {
      wx.showLoading({
        title: '正在退出',
      })
      wx.clearStorage()
        .then(value => {
          app.globalData.userInfo = null
          app.globalData.isDBHasUser = false
          app.globalData.isUserLocation = false
          app.globalData.isLocationAuthorization = false
          app.globalData.userAvatarSrc = getData.userAvatarSrc
          app.globalData.cloudUserData = getData.cloudUserData
          app.globalData.newLocationInfo = getData.newLocationInfo
          app.globalData.hotShopList = getData.hotShopList
          app.globalData.tempShopList = []

          // 拿到所有的page对象
          const pages = getCurrentPages()
          // 前一个页面
          let indexPage = pages[pages.length - 2];
          indexPage.setData({
            PageCur: 'home'
          })
          indexPage.onLoad()
          wx.navigateBack({
            delta: 1,
          })
        })
    } catch (e) {
      console.log(e);
    }
  },
  // 分发调用函数
  onCurNavigateTo(e) {
    let cmd = e.currentTarget.dataset.cmd
    if (cmd == 0) {
      // 预览头像
      this.onPreviewAvatar()
    } else if (cmd == 1) {
      // 编辑昵称
      this.onEditNickname()
    } else if (cmd == 2) {
      // 绑定手机号
      this.onBindPhoneNumber()
    } else if (cmd == 3) {
      // 用户反馈
      this.onFeedback()
    } else if (cmd == 4) {
      this.onMeetFood()
    }
  },
  // 预览头像
  onPreviewAvatar() {
    let urls = []
    let avatarUrl = this.data.line[0].value
    urls.push(avatarUrl)
    wx.previewImage({
      current: this.data.line[0].value, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 编辑昵称
  onEditNickname() {
    wx.navigateTo({
      url: '../setUp/editNickname/editNickname',
    })
  },
  // 绑定手机号
  onBindPhoneNumber() {
    wx.navigateTo({
      url: '../setUp/bindPhoneNumber/bindPhoneNumber',
    })
  },

  // 用户反馈
  onFeedback() {
    wx.navigateTo({
      url: '../setUp/feedback/feedback',
    })
  },

  // 关于遇见食途
  onMeetFood() {
    wx.navigateTo({
      url: '../setUp/meetfood/meetfood',
    })
  }
})