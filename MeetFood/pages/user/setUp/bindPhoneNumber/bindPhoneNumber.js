var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {},
  onLoad: function (options) {
    if (options.task) {
      let task = JSON.parse(options.task)
      console.log(task);
    }
    this.setData({
      time: 60,
      code: null,
      isGetCode: false,
      phoneNumber: app.globalData.cloudUserData.PHONE_NUMBER
    })
  },

  formSubmit(e) {
    let _code = this.data.code
    let code = e.detail.value.code
    let phoneNumber = e.detail.value.phoneNumber
    let cloudUserData = app.globalData.cloudUserData
    if (util.checkPhone(phoneNumber)) {
      if (code.length == 0) {
        this.myShowToast('请输入验证码', 'error', 2000)
      } else if (code.length < 5) {
        this.myShowToast('验证码为5位数字格式', 'none', 2000)
      } else if (_code == code) {
        // this.myShowToast('验证成功', 'succeed', 2000)
        let date = util.DateFormatted(new Date())
        wx.showLoading({
          title: '正在绑定',
        })
        wx.cloud.callFunction({
          name: 'MeetFood_UserCRUD',
          data: {
            type: 'update',
            data: {
              _id: cloudUserData._id,
              phoneNumber: phoneNumber,
              _nickName: cloudUserData._nickName,
              updatedTime: date.dateE + " " + date.time
            }
          }
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          console.log(res, '绑定成功');
          cloudUserData.PHONE_NUMBER = phoneNumber
          cloudUserData.UPDATED_TIME = date.dateE + " " + date.time
          app.globalData.isDBHasUser = false
          app.globalData.cloudUserData = cloudUserData
          setTimeout(() => {
            // 拿到所有的page对象
            const pages = getCurrentPages()
            // 前一个页面
            let setUpPage = pages[pages.length - 2];
            setUpPage.onLoad()
            wx.navigateBack()
          }, 1500)
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '绑定失败',
            icon: 'error',
            duration: 2000
          })
          console.log(err, '绑定失败');
        })
      } else if (_code != code && _code != null) {
        this.myShowToast('验证码错误', 'error', 2000)
      } else if (_code == null) {
        this.myShowToast('验证码已失效', 'error', 2000)
      }
    } else if (phoneNumber.length == 0) {
      this.myShowToast('请输入手机号码', 'error', 2000)
    } else {
      this.myShowToast('手机号码有误', 'error', 2000)
    }
  },
  onInputPhoneNumber(e) {
    this.data.phoneNumber = e.detail.value
  },
  onSendCode() {
    let pn = this.data.phoneNumber
    if (util.checkPhone(pn)) {
      // 手机号码正确 调用云函数发送订阅消息(暂时替代短信)
      this.onSubscribeMessage()
    } else if (pn.length == 0) {
      this.myShowToast('请输入手机号码', 'error', 2000)
    } else {
      this.myShowToast('手机号码有误', 'error', 2000)
    }
  },
  onEmptyValue() {
    this.setData({
      phoneNumber: ''
    })
  },
  // 获取验证码
  getCode() {
    let code = util.randomKey(5)
    wx.showLoading({
      title: '正在发送',
    })
    // 发送验证码
    wx.cloud.callFunction({
      name: 'sendCode',
      data: {
        code,
        phone: '13531045483',
        text: '验证码仅生效一次'
      }
    }).then(value => {
      wx.hideLoading()
      this.myShowToast('发送成功', 'success', 1500)
      this.setData({
        code: code
      })
      let timeInterval = setInterval(() => {
        let time = this.data.time
          --time
        this.setData({
          isGetCode: true,
          time: time
        })
      }, 1000)
      setTimeout(() => {
        this.setData({
          isGetCode: false,
          code: null,
          time: 60
        })
        clearInterval(timeInterval)
      }, 1000 * 60)
      console.log(value);
    }).catch(err => {
      wx.hideLoading()
      this.myShowToast('发送失败', 'error', 1500)
      console.log(err);
    })
  },

  // 用户对订阅消息进行授权 / 授权一次只能推送一条消息
  onSubscribeMessage() {
    let that = this
    // 进行授权
    wx.requestSubscribeMessage({
      // 一次调用最多可订阅3条消息
      tmplIds: [
        'qGc5Jn1OFD4n35whPsx0GIIsTWoGtaYTpMDCff1owNE'
      ], // 消息模板ID
      success(res) {
        if (res.qGc5Jn1OFD4n35whPsx0GIIsTWoGtaYTpMDCff1owNE == 'accept') {
          console.log('授权成功', res);
          that.getCode()
        } else {
          console.log('拒绝成功', res);
        }
      },
      fail(err) {
        console.log('授权失败', err);
        that.myShowToast('未开启订阅消息', 'error', 1500)
      }
    })
  },

  myShowToast(title = '标题', icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  }
})