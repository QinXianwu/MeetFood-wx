import {
  request,
  api
} from '../../utils/http'

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

var app = getApp()
var amapsdk = app.globalData.api.amapsdk
var qqmapsdk = app.globalData.api.qqmapsdk
var util = require('../../utils/util')
var getData = require('../../utils/getData')

Component({
  properties: {
    userInfo: Object
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.LoadData()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  data: {
    isLoad: false,
    isLoadShow: false, // 控制页面滚到底部是否刷新数据
    isShowActivity: false, // 控制活动页面的显示
    isLocationAuthorization: app.globalData.isLocationAuthorization,
    hotActivityList: getData.hotActivityList,
    temphotShopList: getData.temphotShopList
  },
  /**
   * 组件的方法列表
   */
  methods: {
    LoadData() {
      let userInfo = app.globalData.userInfo
      let hotShopList = app.globalData.hotShopList
      let isLocationAuthorization = app.globalData.isLocationAuthorization

      hotShopList.forEach(element => {
        element.title = util.titleTooLong(element.title, 16)
        element.address = util.titleTooLong(element.address, 22)
      });

      if (!isLocationAuthorization) {
        this.getNewLocation()
      } else {
        isLocationAuthorization = true
      }

      if (!userInfo) {
        util.getStorage('userInfo')
          .then(value => {
            let userInfo = value.data.userInfo
            app.globalData.userAvatarSrc = userInfo.avatarUrl
            this.setData({
              userAvatarSrc: userInfo.avatarUrl
            })
          })
          .catch(reason => {
            this.setData({
              userAvatarSrc: app.globalData.userAvatarSrc
            })
          })
      } else {
        this.setData({
          userAvatarSrc: userInfo.userInfo.avatarUrl
        })
      }

      this.setData({
        hotShopList: hotShopList,
        isLocationAuthorization: isLocationAuthorization,
        newLocationInfo: app.globalData.newLocationInfo
      })
    },
    getNewLocation() {
      let that = this
      let newLocationInfo = app.globalData.newLocationInfo

      // 高德 获取最新天气
      amapsdk.getWeather({
        success: function (data) {
          wx.showLoading({
            title: '加载中',
          })
          //成功回调
          console.log(data);
          newLocationInfo.city = data.liveData.city // 城市
          newLocationInfo.province = data.liveData.province // 省份
          newLocationInfo.date = util.DateFormatted(new Date()).dateC // 当前日期
          newLocationInfo.week = util.DateFormatted(new Date()).weekday // 当前星期
          newLocationInfo.weather = data.liveData.weather // 天气状态
          newLocationInfo.temperature = data.liveData.temperature + '℃' // 温度
          newLocationInfo.reporttime = data.liveData.reporttime // 天气更新时间
          app.globalData.newLocationInfo = newLocationInfo

          // 关键字搜索 1-获取经纬度
          util.getStorage('userLocation')
            .then(value => {
              let location = value.data.split(',').reverse()
              console.log(value.data, location);
              return {
                location: value.data
              }
            }).then(value => {
              // 2-调用api
              that.callApi({
                apiParameter: value,
                newLocationInfo,
                that
              })
            }).catch(reason => {
              console.log(reason);
            })

          // 腾讯 WebService API 逆解析 获取精准定位
          util.getStorage('userLocation')
            .then(value => {
              location = value.data.split(',').reverse()
              return request({
                url: app.globalData.api.qqMapInverseResolution,
                method: 'get',
                data: {
                  location: location[0] + ',' + location[1],
                  key: app.globalData.api.loadLocationKey
                },
              })
            }).then(value => {
              let result = value.data.result
              let city = app.globalData.newLocationInfo.city // 城市
              let recommend = result.formatted_addresses.recommend
              recommend = recommend.split(city)

              app.globalData.newLocationInfo.recommend = recommend.join('')
              app.globalData.isLocationAuthorization = true
              app.globalData.isAroundSearch = false
              app.globalData.ad_info = result.ad_info


              console.log(result.ad_info);
              that.setData({
                newLocationInfo: app.globalData.newLocationInfo,
                isLocationAuthorization: true
              })
              wx.hideLoading()
            }).catch(reason => {
              console.log(reason);
              wx.hideLoading()
            })
        },
        fail: function (err) {
          //失败回调 拒绝授权
          console.log(err)
          that.callApi({
            apiParameter: {},
            newLocationInfo,
            that
          })
        },
        complete() {
          // wx.hideLoading()
        }
      })
    },

    // 封装调用api 获取门店信息
    callApi(obj) {
      let {
        apiParameter,
        newLocationInfo,
        that
      } = obj
      // 2-调用api
      api.poiAroundSearch(apiParameter)
        .then(value => {
          let data = value.data.pois
          let hotShopList = []
          app.globalData.tempShopList = []

          data.forEach(element => {
            if (element.photos.length > 0 && element.biz_ext.rating > 0) {
              app.globalData.tempShopList.push(JSON.parse(JSON.stringify(element)))
              element.title = util.titleTooLong(element.name, 16)
              element.address = util.titleTooLong(element.adname + element.address, 22)
              element.photos.length > 0 ? element.logoUrl = element.photos[0].url : element.logoUrl = getData._404Img
              element.biz_ext.cost.length > 0 ? element.perCapita = element.biz_ext.cost : element.perCapita = "~"
              element.score = element.biz_ext.rating
              element._distance = ~~element.distance
              hotShopList.push(element)
            }
          });

          app.globalData.hotShopList = hotShopList
          that.setData({
            isLoadShow: false,
            newLocationInfo: newLocationInfo,
            hotShopList: hotShopList.slice(0, 3)
          })
          return
        }).catch(err => {
          console.log(err);
        })
    },

    // 引导用户授权
    onUpdatePositioning() {
      let that = this

      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
      wx.getSetting({
        success(res) {
          console.log(res.authSetting['scope.userLocation']);
          if (!res.authSetting['scope.userLocation']) {

            // 自定义showModal
            util.showModal({
              title: '您还未授权位置信息',
              content: '你的位置信息将用于定位效果和天气信息展示',
              cancelColor: '#333333',
              mask: true,
              confirmText: '去授权'
            }).then((result) => {
              console.log(result);
              if (result.confirm) {
                // 点击确认 打开设置权限页面
                wx.openSetting({
                  success(res) {
                    console.log(res)
                    if (res.authSetting['scope.userLocation']) {
                      console.log('授权成功');
                      that.getNewLocation()
                    } else {
                      console.log('未授权');
                      wx.showToast({
                        title: '授权失败',
                        icon: 'error'
                      })
                    }
                  }
                })
              }
            }).catch((reason => {
              console.log(reason);
            }))
          }
        }
      })
    },

    // 下滑刷新数据
    loadRecommendData(e) {
      let isLoad = this.data.isLoad
      let isLoadShow = this.data.isLoadShow
      let hotShopList = this.data.hotShopList
      let hotShopAllList = app.globalData.hotShopList
      let temp = hotShopAllList.slice(hotShopList.length, hotShopList.length + 3)

      if (hotShopList.length < hotShopAllList.length) {
        isLoad = true
        isLoadShow = true
        setTimeout(() => {
          this.setData({
            isLoadShow: false,
            hotShopList: hotShopList.concat(temp)
          })
        }, 2000)
      } else {
        isLoad = false
        isLoadShow = true
      }

      this.setData({
        isLoad: isLoad,
        isLoadShow: isLoadShow
      })
    },

    // 组件事件
    onUser(e) {
      this.triggerEvent('home', {
        PageCur: "user"
      })
    },

    // 跳转到门店详情页
    onNavigateToShop(e) {
      let isLocationAuthorization = this.data.isLocationAuthorization

      if (isLocationAuthorization) {
        let shopCur = e.currentTarget.dataset.shopcur
        let shopList = app.globalData.tempShopList
        let shopData = shopList[shopCur]

        shopData.address = shopData.adname + shopData.address
        shopData.biz_ext.cost.length > 0 ? shopData.perCapita = shopData.biz_ext.cost : shopData.perCapita = "~"
        shopData.photos.length > 0 ? shopData.logoUrl = shopData.photos[0].url : shopData.logoUrl = getData._404Img

        shopData.score = shopData.biz_ext.rating
        shopData._distance = ~~shopData.distance


        // 已授权
        wx.navigateTo({
          url: '../shop/shop?shopData=' + JSON.stringify(shopData),
        })
      } else {
        // 未授权
        this.onUpdatePositioning()
      }
    },

    showPopup(e) {
      let aid = e.currentTarget.dataset.aid
      let activityList = this.data.hotActivityList
      // console.log(activityList[aid]);
      this.setData({
        isShowActivity: true,
        activity: activityList[aid]
      });
    },

    onClose(e) {
      this.setData({
        isShowActivity: false
      });
    },
  },
})