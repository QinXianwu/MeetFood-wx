var app = getApp()

Page({

  data: {

  },
  onLoad: function (options) {
    let shopList = []

    wx.showLoading({
      title: '正在加载',
    })
    wx.cloud.callFunction({
      name: 'collectionShop_CRUD',
      data: {
        type: 'retrieveCollection',
        data: {}
      }
    }).then(res => {
      let data = res.result.data
      if (data.length > 0) {
        let count = 0
        data.forEach(element => {
          wx.cloud.callFunction({
            name: 'collectionShop_CRUD',
            data: {
              type: 'retrieveShop',
              shopid: element.SHOPID
            }
          }).then(value => {
            count++
            shopList.push(value.result.data[0])
            if (count == shopList.length) {
              wx.hideLoading()
              this.setData({
                shopList: shopList,
                idList: data
              })
            }
          })
        })
      } else {
        wx.hideLoading()
      }
    })
  },
  onDelete(e) {
    let cloudUserData = app.globalData.cloudUserData
    let cur = e.currentTarget.dataset.cur
    let shopList = this.data.shopList
    let idList = this.data.idList
    console.log(idList);
    console.log(cur);

    wx.showLoading({
      title: '正在删除',
    })

    wx.cloud.callFunction({
      name: 'collectionShop_CRUD',
      data: {
        type: 'deleteCollection',
        _id: idList[cur]._id
      }
    }).then(value => {
      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500
      })

      shopList.splice(cur, 1)
      idList.splice(cur, 1)
        --cloudUserData.CollectionShopLength
      app.globalData.cloudUserData = cloudUserData
      this.setData({
        shopList: shopList,
        idList: idList
      })
    })
  }
})