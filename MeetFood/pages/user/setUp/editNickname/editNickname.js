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
      _nickName: app.globalData.cloudUserData.NICKNAME
    })
    console.log(app.globalData.cloudUserData);
  },

  onInputName(e) {
    let value = e.detail.value
    this.data._nickName = value
  },
  onSave(e) {
    let cloudUserData = app.globalData.cloudUserData
    let _nickName = this.data._nickName
    let date = util.DateFormatted(new Date())
    if (_nickName.length >= 1) {
      wx.showLoading({
        title: '正在更新',
      })
      wx.cloud.callFunction({
        name: 'MeetFood_UserCRUD',
        data: {
          type: 'update',
          data: {
            _id: cloudUserData._id,
            _nickName: _nickName,
            phoneNumber: cloudUserData.phoneNumber,
            updatedTime: date.dateE + " " + date.time
          }
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        })
        console.log(res, '修改成功');
        cloudUserData._NICKNAME = _nickName
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
          title: '更新失败',
          icon: 'error',
          duration: 2000
        })
        console.log(err, '修改失败');
      })
    } else {
      wx.showToast({
        title: '请输入昵称',
        icon: 'error'
      })
    }
  },
  onEmptyValue(e) {
    this.setData({
      _nickName: ''
    })
  }
})