// 引入SDK核心类
var QQMapWX = require('./libs/tx-wx-map/qqmap-wx-jssdk.js'); //腾讯
var amapFile = require('./libs/tx-wx-map/amap-wx.js'); //高德
var util = require('./utils/util')
var getData = require('./utils/getData')

App({
  onLaunch() {
    wx.cloud.init({
      'env': 'qxw-7pvkt' //云开发控制台 环境ID
    })

    // 实例化API核心类
    this.globalData.api.qqmapsdk = new QQMapWX({
      key: this.globalData.api.loadLocationKey
    });
    this.globalData.api.amapsdk = new amapFile.AMapWX({
      key: this.globalData.api.gaodeiMapKey
    });

    // 从缓存中取出userInfo
    util.getStorage('userInfo')
      .then(value => {
        this.globalData.userInfo = value.data
        console.log(value, 'app');
      })
      .catch(reason => {
        this.globalData.userInfo = null
        console.log(reason, 'app');
      })
  },
  // 全局数据
  globalData: {
    userInfo: null,
    isDBHasUser: false, // 数据库是否存在该用户
    isUserLocation: false,
    isAroundSearch: false,
    isLoadBookingData: false,
    isLocationAuthorization: false, // 是否授权位置信息
    userAvatarSrc: '/images/MeetFood-logo.png',
    api: {
      qqmapsdk: null,
      amapsdk: null,
      userLocation: 'RUIBZ-36YLX-5AT4X-T2QHK-U7JZK-PPB3S', //腾讯地图key
      loadLocationKey: 'ZDFBZ-ORNCJ-7C4FO-FHTZW-Y2PIQ-ZQFLC', //腾讯地图key
      gaodeiMapKey: '40436288f877c2b72780489a7f28262c', //高德地图key
      gaodeiMapWeb: '1a57122b024d128d3aa66130e7160549', //高德地图key
      qqmapSearch: 'https://apis.map.qq.com/ws/place/v1/search', // 关键字搜索
      qqMapInverseResolution: 'https://apis.map.qq.com/ws/geocoder/v1', //经纬度逆解析
      poiAroundSearch: 'https://restapi.amap.com/v3/place/around', // POI周边服务查询
      poiDistrictSearch: 'https://restapi.amap.com/v3/config/district', // POI 行政区域查询AP1I
      poiInputtipsSearch: 'https://restapi.amap.com/v3/assistant/inputtips' // 搜索关键词提示

    },
    cloudUserData: getData.cloudUserData,
    newLocationInfo: getData.newLocationInfo,
    hotShopList: getData.hotShopList,
    ad_info: getData.ad_info,
    tempShopList: [],
    searchTempShopList: [],
    _searchTempShopList: [],
    _bookingList_: [],
    bookingList: []
  },
})