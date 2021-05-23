let api = {}
let app = getApp()

// wx.request Promise封装
exports.request = function (params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: params.url,
      method: params.method || 'get',
      data: params.data || {},
      success: resolve,
      fail: reject
    })
  })
}

// wx.login Promise封装
exports.login = function () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
}

// 登录凭证校验 - 检查用户是否登录失效 
/*
  小程序 appId
  小程序 appSecret
  登录时获取的 code
  授权类型grant_type（authorization_code）
*/
exports.auth = function (params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: params.appid,
        secret: params.secret,
        js_code: params.js_code,
        grant_type: 'authorization_code'
      },
      success: resolve,
      fail: reject
    })
  })
}


// 关键字搜索 Promise封装
/*
  腾讯
  必传字段 
  key: 应用key
  keyword：搜索关键字
  boundary: nearby(lat,lng,radius[, auto_extend]) 格式顺序为纬度在前，经度在后
  latitude：纬度
  longitude：经度
  radius：搜索半径
*/
api.keyworSearch = function (params) {
  return new Promise((resolve, reject) => {
    let requestParameters = {}
    // boundary=nearby(lat,lng,radius[, auto_extend]) 格式顺序为纬度在前，经度在后
    let boundary = new Array()
    // 纬度 默认为北京的经纬度
    let latitude = params.latitude || 39.9

    // 经度 
    let longitude = params.longitude || 116.3

    // radius：搜索半径，单位：米，取值范围：10到1000
    let radius = params.radius || 1000

    // 0 不扩大 1 [默认] 自动扩大范围（依次按照按1公里、2公里、5公里，最大到全城市范围搜索）
    let auto_extend = params.auto_extend || 1
    boundary.push(latitude, longitude, radius, auto_extend)
    boundary = 'nearby(' + boundary + ')' // 默认使用 , 将各元素连接并返回字符串
    requestParameters.boundary = boundary
    // 腾讯位置服务 key
    requestParameters.key = app.globalData.api.loadLocationKey

    // 搜索关键字
    requestParameters.keyword = params.keyword || '美食'

    // 第x页，默认第1页
    requestParameters.page_index = params.page_index || 1

    // 筛选条件
    params.filter ? requestParameters.filter = params.filter : ''

    // 排序，支持按距离由近到远排序，默认：_distance
    requestParameters.orderby = params.orderby || '_distance'

    // 每页条目数，最大限制为20条
    requestParameters.page_size = params.page_size || 10

    // console.log(requestParameters);
    wx.request({
      url: app.globalData.api.qqmapSearch,
      method: 'get',
      data: requestParameters,
      success: resolve,
      fail: reject
    })
  })
}

/* 
  高德 周边搜索服务 POI
  https://restapi.amap.com/v3/place/around?parameters  get
  必传字段 
  key: 应用key
  location: longitude,latitude   经度和纬度用","分割 经纬度小数点后不得超过6位
*/
api.poiAroundSearch = function (params) {
  return new Promise((resolve, reject) => {
    let requestParameters = {}

    requestParameters.key = app.globalData.api.gaodeiMapWeb

    requestParameters.location = params.location || "116.3,39.9"

    // 搜索关键字 
    requestParameters.keywords = params.keywords || ''

    // 查询POI类型
    requestParameters.types = params.types || "050000"

    // 查询城市
    requestParameters.city = params.city || ''

    // 查询半径 默认3000
    requestParameters.radius = params.radius || 5000

    // 排序规则 默认distance  按距离排序：distance；综合排序：weight
    requestParameters.sortrule = params.sortrule || ''

    // 每页记录数据 默认20 强烈建议不超过25，若超过25可能造成访问报错
    requestParameters.offset = params.offset || 20

    // 当前页数
    requestParameters.page = params.page || 1

    wx.request({
      url: app.globalData.api.poiAroundSearch,
      method: 'get',
      data: requestParameters,
      success: resolve,
      fail: reject
    })
  })
}

/*
  高德 行政区域查询API服务地址 https://lbs.amap.com/api/webservice/guide/api/district
  https://restapi.amap.com/v3/config/district
  必填字段
  key: 应用key
*/

api.poiDistrictSearch = function (params) {
  return new Promise((resolve, reject) => {
    let requestParameters = {}

    requestParameters.key = app.globalData.api.gaodeiMapWeb

    // 搜索关键字 
    requestParameters.keywords = params.keywords || ''

    /*
    子级行政区
      0：不返回下级行政区；
      1：返回下一级行政区；
      2：返回下两级行政区；
      3：返回下三级行政区
    */
    requestParameters.subdistrict = params.subdistrict || 1

    requestParameters.page = params.page || 1

    requestParameters.offset = params.offset || 20

    wx.request({
      url: app.globalData.api.poiDistrictSearch,
      method: 'get',
      data: requestParameters,
      success: resolve,
      fail: reject
    })
  })
}

/*
  高德  输入提示(关键词提示)API  https://lbs.amap.com/api/webservice/guide/api/inputtips
  https://restapi.amap.com/v3/assistant/inputtips
  必填字段
  key: 应用key
  keywords: 查询关键词
*/

api.poiInputtipsSearch = function (params) {
  return new Promise((resolve, reject) => {
    let requestParameters = {}

    requestParameters.key = app.globalData.api.gaodeiMapWeb

    // 搜索关键字 
    requestParameters.keywords = params.keywords || '北京'

    // POI分类
    requestParameters.type = params.type || '050000'

    // 坐标 格式：“X,Y”（经度,纬度）在请求参数city不为空时生效
    requestParameters.location = params.location || ''

    // 搜索城市 可选值：citycode、adcode，不支持县级市
    requestParameters.city = params.city || ''

    // 仅返回指定城市数据
    requestParameters.citylimit = params.citylimit || ''

    wx.request({
      url: app.globalData.api.poiInputtipsSearch,
      method: 'get',
      data: requestParameters,
      success: resolve,
      fail: reject
    })
  })
}



exports.api = api