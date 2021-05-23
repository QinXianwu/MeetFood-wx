var app = getApp()
var util = require('../../utils/util')

// 分割函数
const getInf = (str, key) => str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');

const {
  request,
  api
} = require("../../utils/http")
var getData = require('../../utils/getData')


Component({
  properties: {
    userInfo: Object
  },

  lifetimes: {
    attached: function () {
      this.LoadData()
    }
  },
  data: {
    menu1: getData.menu1,
    menu2: getData.menu2,
    menu3: '筛选',
    keyWords: '',
    value1: 0,
    value2: 'a',
    isShowAllCity: false,
    isShowOption: false,
    isShowMain: false,
    isSearchFocus: false,
    keyWordList: [{
      /*
      1：历史搜索
      2：热门/猜你想搜
      */
      type: 1,
      title: '历史搜索',
      data: []
    }, {
      type: 2,
      title: '猜你想搜',
      data: ['广州大排档', '北京烤鸭', '隆江猪脚饭', '长隆欢收到的乐谷', '夜市', '华莱士', 'coco', '必胜客']
    }, {
      type: 3,
      title: '热门',
      data: []
    }],
    page: 2,
    cityCur: 0,
    businessHours: {
      time: ['0-5时', '5-10时', '10-14时', '14-17时', '17-21时', '21-24时', '24小时营业'],
      selected: []
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    LoadData() {
      let cityNameArr = []
      let ad_info = app.globalData.ad_info
      let keyWordList = this.data.keyWordList

      // 获取
      api.poiDistrictSearch({
        keywords: ad_info.city,
        subdistrict: 2
      }).then(res => {
        let cityList = res.data.districts[0]
        if (cityList.districts.length > 1) {
          console.log('非直辖市');
          console.log(cityList.districts);
          cityList = cityList.districts
        } else {
          console.log('直辖市');
          console.log(cityList.districts[0].districts);
          cityList = cityList.districts[0].districts
        }

        cityNameArr = JSON.parse(JSON.stringify(cityList))
        cityNameArr.forEach(element => {
          element.name = util.titleTooLong(element.name, 5)
        });
        this.setData({
          cityList: cityList,
          cityNameArr: cityNameArr
        })
      }).catch(err => {
        console.log(err);
      })

      util.getStorage('userLocation')
        .then(value => {
          this.loadShopList({
            location: value.data,
            page: this.data.page
          })
          this.setData({
            location: value.data,
            tempShopList: []
          })
        })
        .catch(err => {
          console.log(err);
          this.loadShopList({
            page: this.data.page,
          })
          this.setData({
            location: "",
            tempShopList: []
          })
        })

      // 获取历史记录 
      util.getStorage('historicalSearch')
        .then(value => {
          if (value.data.data.length > 0) {
            keyWordList[0] = value.data
          }
          console.log(keyWordList);
          this.setData({
            keyWordList: keyWordList
          })
        }).catch(err => {
          console.log(err);
        })
    },

    // 刷新门店列表信息
    loadShopList(obj) {
      api.poiAroundSearch(obj)
        .then(value => {
          let tempShopList = []
          let data = value.data.pois
          // 对数据处理
          data.forEach(element => {
            if (element.photos.length > 0 && element.biz_ext.rating > 0) {
              element.title = element.name
              element.address = element.address
              element.photos.length > 0 ? element.logoUrl = element.photos[0].url : element.logoUrl = getData._404Img
              element.biz_ext.cost.length > 0 ? element.perCapita = element.biz_ext.cost : element.perCapita = "~"
              element.score = element.biz_ext.rating
              element._distance = ~~element.distance
              app.globalData.searchTempShopList.push(JSON.parse(JSON.stringify(element)))
              element.title = util.titleTooLong(element.name, 16)
              element.address = util.titleTooLong(element.adname + element.address, 22)
              tempShopList.push(element)
            }
          });

          app.globalData.isAroundSearch = true
          app.globalData.searchTempShopList = tempShopList
          wx.hideLoading()
          setTimeout(() => {
            this.setData({
              tempShopList: tempShopList
            })
          }, 500)
          return
        }).catch(err => {
          wx.hideLoading()
          console.log(err);
        })
    },

    // 滚到底部刷新列表
    onLoadShopData(e) {
      wx.showLoading({
        title: '努力加载中',
      })
      console.log(e);
      api.poiAroundSearch({
          location: this.data.location,
          page: this.data.page + 1,
          keywords: this.data.keywords
        })
        .then(value => {
          let tempShopList = []
          let data = value.data.pois
          let searchTempShopList = []
          // 对数据处理
          data.forEach(element => {
            if (element.photos.length > 0 && element.biz_ext.rating > 0) {
              element.title = element.name
              element.address = element.address
              element.photos.length > 0 ? element.logoUrl = element.photos[0].url : element.logoUrl = getData._404Img
              element.biz_ext.cost.length > 0 ? element.perCapita = element.biz_ext.cost : element.perCapita = "~"
              element.score = element.biz_ext.rating
              element._distance = ~~element.distance
              app.globalData.searchTempShopList.push(JSON.parse(JSON.stringify(element)))

              element.title = util.titleTooLong(element.name, 16)
              element.address = util.titleTooLong(element.adname + element.address, 22)
              tempShopList.push(element)
            }
          });

          app.globalData.searchTempShopList.concat(searchTempShopList)

          // console.log(app.globalData.searchTempShopList);
          // console.log(this.data.tempShopList.concat(tempShopList));


          wx.hideLoading()
          this.setData({
            page: this.data.page + 1,
            tempShopList: this.data.tempShopList.concat(tempShopList)
          })
          return
        }).catch(err => {
          wx.hideLoading()
          console.log(err);
        })
    },

    onConfirm(e) {
      this.selectComponent('#item').toggle();
      console.log(e);
    },

    // 值发生改变时触发
    onChange(value) {
      console.log(value);
    },

    // 控制选择城市动画
    onSelectedCity(e) {
      let isShowAllCity = this.data.isShowAllCity
      let isShowMain = this.data.isShowMain
      // 收起菜单
      this.hideMenu()
      // 收起搜索模块
      this.onSearchBlur()

      if (isShowAllCity) {
        // 隐藏
        setTimeout(() => {
          this.setData({
            isShowAllCity: !isShowAllCity,
          })
        }, 500)
        this.setData({
          isShowMain: !isShowMain,
        })
      } else {
        // 显示
        setTimeout(() => {
          this.setData({
            isShowMain: !isShowMain,
          })
        }, 1)
        this.setData({
          isShowAllCity: !isShowAllCity
        })
      }
    },

    // 输入框聚焦事件
    onSearchFocus(e) {
      // 收起全城列表
      if (this.data.isShowAllCity) {
        this.onSelectedCity()
      }
      // 收起菜单
      this.hideMenu()
      this.setData({
        isSearchFocus: true,
        keyWords: this.data.keyWords
      })
    },

    // 输入关键词
    onInputKeyWords(e) {
      let keyWords = e.detail.value

      api.poiInputtipsSearch({
          keywords: keyWords
        })
        .then(res => {
          // console.log(res);
          // 实现 关键词高亮
          this.searchTap(JSON.parse(JSON.stringify(res.data.tips)), keyWords)
          this.setData({
            tips: res.data.tips,
          })
        }).catch(err => {
          console.log(err);
        })
      this.setData({
        keyWords: keyWords
      })
    },

    // 监听点击完成触发
    onGoSearch(e) {
      let shopList = []
      let tips = this.data.tips
      let value = e.detail.value
      let keyWordList = this.data.keyWordList
      wx.showLoading({
        title: '努力加载中',
      })
      console.log(tips);
      app.globalData.searchTempShopList = []
      tips.forEach(element => {
        api.poiAroundSearch({
            location: element.location,
            keywords: element.name,
            page: 1
          })
          .then(res => {
            let dataList = res.data.pois
            dataList.forEach(ele => {
              if (ele.photos.length > 0) {
                ele.address = ele.address
                ele.biz_ext.cost.length > 0 ? ele.perCapita = ele.biz_ext.cost : ele.perCapita = "~"
                ele.photos.length > 0 ? ele.logoUrl = ele.photos[0].url : ele.logoUrl = getData._404Img
                ele.score = ele.biz_ext.rating
                ele._distance = ~~ele.distance
                app.globalData.searchTempShopList.push(ele)

                ele.title = util.titleTooLong(ele.name, 16)
                ele.address = util.titleTooLong(ele.adname + ele.address, 22)
                shopList.push(ele)
              }
            })
            setTimeout(() => {
              this.setData({
                tempShopList: shopList
              })
            }, 500)
          })
          .catch(err => {
            console.log(err);
          })
        wx.hideLoading()
      });

      keyWordList[0].data.indexOf(value) == -1 ? keyWordList[0].data.push(value) : ''
      wx.setStorageSync('historicalSearch', keyWordList[0])
      this.setData({
        keyWordList: keyWordList,
        isSearchFocus: false
      })
    },

    // 清空历史记录
    clearRecord(e) {
      let keyWordList = this.data.keyWordList
      keyWordList[0].data = []
      wx.setStorageSync('historicalSearch', keyWordList[0])
      this.setData({
        keyWordList: keyWordList
      })
    },

    // 点击历史记录/热门
    onInputKey(e) {
      this.onInputKeyWords({
        detail: {
          value: e.currentTarget.dataset.keywords
        }
      })
      this.setData({
        keyWords: e.currentTarget.dataset.keywords
      })
    },

    // 处理搜索关键字 将文本与关键词分隔存入数组 实现高亮
    searchTap: function (arr, keyWords) {
      var listData = arr;
      for (var i = 0; i < listData.length; i++) {
        var dic = listData[i];
        var text = dic.name;
        dic.name = getInf(text, keyWords);
      }
      // console.log(listData);
      this.setData({
        searchListData: listData
      });

    },

    // 跳转到门店详情页
    onGoShop(e) {
      let isR = e.currentTarget.dataset.isr // 是否需要查询
      // 直接点击搜索到的门店
      if (isR == "yes") {
        let shopData = e.currentTarget.dataset.shopdata
        console.log(shopData);
        api.poiAroundSearch({
          location: shopData.location,
          keywords: shopData.name
        }).then(res => {
          let dataList = res.data.pois
          try {
            dataList.forEach(element => {
              if (element.name == shopData.name) {
                shopData = element
                throw new Error('End Loop')
              }
            })
          } catch (error) {
            if (e.message === 'End Loop') throw error
          }
          console.log(shopData);
          // 跳转到门店详情页
          shopData.address = shopData.address
          shopData.biz_ext.cost.length > 0 ? shopData.perCapita = shopData.biz_ext.cost : shopData.perCapita = "~"
          shopData.photos.length > 0 ? shopData.logoUrl = shopData.photos[0].url : shopData.logoUrl = getData._404Img
          shopData.score = shopData.biz_ext.rating
          shopData._distance = ~~shopData.distance
          wx.navigateTo({
            url: '../shop/shop?shopData=' + JSON.stringify(shopData),
          })
        }).catch(err => {
          console.log(err);
          wx.showToast({
            title: '该门店已打烊',
            icon: 'error'
          })
        })
      } else {
        // 在搜索页点击的门店
        let shopdatacur = e.currentTarget.dataset.shopdatacur
        let searchTempShopList = app.globalData.searchTempShopList
        console.log(searchTempShopList[shopdatacur]);
        wx.navigateTo({
          url: '../shop/shop?shopData=' + JSON.stringify(searchTempShopList[shopdatacur]),
        })
      }
    },

    // 收起搜索模块
    onSearchBlur(e) {
      this.setData({
        isSearchFocus: false,
        keyWords: ''
      })
    },

    // 收起菜单
    hideMenu() {
      this.selectComponent('#menu1').toggle(false);
      this.selectComponent('#menu2').toggle(false);
      this.selectComponent('#menu3').toggle(false);
    },

    // 筛选城市
    onFilterCity(e) {
      this.onSelectedCity()
      this.setData({
        cityCur: e.currentTarget.dataset.citycur
      })
    },

    // 选择营业时间
    onBusinessHours(e) {
      let cur = e.currentTarget.dataset.timecur
      let businessHours = this.data.businessHours
      let selected = businessHours.selected
      if (!selected[cur] || selected[cur] == -1) {
        if (cur == 0 && selected[cur] == 0) {
          selected[cur] = -1
        } else {
          selected[cur] = cur
        }
      } else {
        selected[cur] = -1
      }
      businessHours.selected = selected
      this.setData({
        businessHours: businessHours
      })
    }
  },
})