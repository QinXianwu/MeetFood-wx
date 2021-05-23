var app = getApp()

Page({

  data: {
    lprivilegeList: [{
      icon: 'vip',
      title: '身份铭牌'
    }, {
      icon: 'selection',
      title: '积分抵现'
    }, {
      icon: 'cardboard',
      title: '免费试吃'
    }, {
      icon: 'light',
      title: '极速退款'
    }, {
      icon: 'service',
      title: '客服优先介入'
    }, ],
    taskList: [{
      name: '每日签到',
      value: 10,
      goValue: '去签到',
      taskUrl: '',
      state: -1
    }, {
      name: '初次绑定手机',
      value: 20,
      goValue: '去绑定',
      taskUrl: '../setUp/bindPhoneNumber/bindPhoneNumber',
      state: -1
    }, {
      name: '设置用户名',
      value: 10,
      goValue: '去设置',
      taskUrl: '../setUp/editNickname/editNickname',
      state: -1
    }, ]
  },

  onLoad(options) {
    let cloudUserData = app.globalData.cloudUserData
    this.setData({
      userInfo: cloudUserData,
    })
  },
  onGoTask(e) {
    let task = e.currentTarget.dataset.task
    if (task.taskUrl != '') {
      wx.navigateTo({
        url: task.taskUrl + '?task=' + JSON.stringify(task),
      })
    } else {
      wx.showToast({
        title: '任务尚未开启',
        icon: 'error'
      })
    }
  },
})