var app = getApp()
var util = require('../../utils/util')

Component({

  lifetimes: {
    attached: function () {
      this.LoadData()
    },
    detached: function () {},
  },
  data: {},
  methods: {
    LoadData() {
      let userInfo = app.globalData.userInfo.userInfo
      let isDBHasUser = app.globalData.isDBHasUser
      let cloudUserData = app.globalData.cloudUserData
      if (!isDBHasUser) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        // 调用云函数获取用户信息
        wx.cloud.callFunction({
            name: 'MeetFood_UserCRUD',
            data: {
              type: 'retrieve',
            }
          })
          .then(res => {
            console.log(res, '调用成功');
            let data = res.result.data
            if (data.length > 0) {
              // 数据库中已存在该用户
              console.log(data[0], "数据库中已存在该用户 无需重复创建");
              cloudUserData = data[0]
              // 查询收藏数量
              wx.cloud.callFunction({
                name: 'collectionShop_CRUD',
                data: {
                  type: 'retrieveCollection',
                  data: {}
                }
              }).then(res => {
                let data = res.result.data
                // console.log(res, '收藏门店');
                cloudUserData._id = cloudUserData._id
                cloudUserData.NICKNAME = cloudUserData.NICKNAME
                cloudUserData._NICKNAME = cloudUserData._NICKNAME
                cloudUserData.GENDER = cloudUserData.GENDER
                cloudUserData.AVATAR_URL = cloudUserData.AVATAR_URL
                cloudUserData.LEVEL = cloudUserData.LEVEL
                cloudUserData.INTEGRAL = cloudUserData.INTEGRAL
                cloudUserData.TRUST_SCORE = cloudUserData.TRUST_SCORE
                cloudUserData.PHONE_NUMBER = cloudUserData.PHONE_NUMBER
                cloudUserData.GROWTH_VALUE = cloudUserData.GROWTH_VALUE
                cloudUserData.COUNTRY = cloudUserData.COUNTRY
                cloudUserData.PROVINCE = cloudUserData.PROVINCE
                cloudUserData.CITY = cloudUserData.CITY
                cloudUserData.CREATED_TIME = cloudUserData.CREATED_TIME
                cloudUserData.UPDATED_TIME = cloudUserData.UPDATED_TIME
                cloudUserData.CollectionShopLength = data.length

                app.globalData.cloudUserData = cloudUserData
                app.globalData.isDBHasUser = true
                this.setData({
                  cloudUserData: cloudUserData
                })
                wx.hideLoading()
              })
            } else {
              let date = util.DateFormatted(new Date())
              // 创建用户
              wx.cloud.callFunction({
                  name: 'MeetFood_UserCRUD',
                  data: {
                    type: 'create',
                    data: {
                      nickname: userInfo.nickName,
                      _nickname: userInfo.nickName,
                      gender: userInfo.gender,
                      // 获取高清图 /132 -> /0
                      avatarUrl: userInfo.avatarUrl.substring(0, (userInfo.avatarUrl.length - 4)) + '/0',
                      level: 1,
                      integral: 0,
                      trust_score: 0,
                      growth_value: 10,
                      phoneNumber: "",
                      country: userInfo.country,
                      province: userInfo.province,
                      city: userInfo.city,
                      createdTime: date.dateE + " " + date.time,
                      updatedTime: date.dateE + " " + date.time
                    }
                  }
                })
                .then(res => {
                  cloudUserData._id = res.result._id
                  cloudUserData.NICKNAME = userInfo.nickName
                  cloudUserData._NICKNAME = userInfo.nickName
                  cloudUserData.AVATAR_URL = userInfo.avatarUrl.substring(0, (userInfo.avatarUrl.length - 4)) + '/0'
                  app.globalData.cloudUserData = cloudUserData
                  wx.hideLoading()
                  console.log(res, '添加成功');
                  this.setData({
                    cloudUserData: cloudUserData
                  })
                })
                .catch(err => {
                  console.log(err, '添加失败');
                })
            }
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err, '调用失败');
          })
      }

      this.setData({
        userInfo: userInfo,
        cloudUserData: cloudUserData
      })
    },

    onCollectionShop(e) {
      wx.navigateTo({
        url: '../user/collectionShop/collectionShop',
      })
    },

    // 跳转订单页
    onOrdersNavigateTo(e) {
      wx.navigateTo({
        url: '../user/orders/orders?active=' + e.currentTarget.dataset.active,
      })
    },

    // 跳转设置页
    onSetupNavigateTo(e) {
      wx.navigateTo({
        url: '../user/setUp/setUp',
      })
    },

    // 跳转成长值页
    onGrowthValue(e) {
      wx.navigateTo({
        url: '../user/growthValue/growthValue',
      })
    },

    // 跳转信任分页
    onTrustScore(e) {
      wx.navigateTo({
        url: '../user/trustScore/trustScore',
      })
    },
    // 签到
    onCheckLogin(e) {
      wx.showToast({
        title: '任务尚未开启',
        icon: 'error'
      })
    }
  },
})