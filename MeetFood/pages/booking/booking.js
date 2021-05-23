var app = getApp()
var util = require('../../utils/util')

const {
  request
} = require("../../utils/http")

Component({

  // 组件的属性列表
  properties: {
    // 接受父组件的给的数据
    newBookingData: {
      type: "Object",
      value: ""
    }
  },

  lifetimes: {
    attached: function () {
      this.LoadData()
    }
  },
  data: {
    tabs: [{
      title: '1',
      content: '11'
    }, {
      title: '2',
      content: '22'
    }],
    historyBooking: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    LoadData() {
      let bookingList = app.globalData.bookingList
      let _bookingList_ = app.globalData._bookingList_
      let isLoadBookingData = app.globalData.isLoadBookingData

      // 获取父页面给子组件的数据
      let newBookingData = this.data.newBookingData
      if (newBookingData._id) {
        console.log(newBookingData);
      }

      console.log(isLoadBookingData);

      if (!isLoadBookingData) {
        console.log('a');

        wx.showLoading({
          title: '正在加载',
        })
        wx.cloud.callFunction({
          name: 'booking_CRUD',
          data: {
            type: 'retrieve',
          }
        }).then(res => {
          let _booking = res.result.data
          bookingList = _booking
          _bookingList_ = JSON.parse(JSON.stringify(bookingList))
          app.globalData._bookingList_ = _bookingList_
          app.globalData.isLoadBookingData = true
          console.log(bookingList);
          bookingList.forEach(element => {
            element.SHOPDATA.address = util.titleTooLong(element.SHOPDATA.address, 24)
          });
          app.globalData.bookingList = bookingList
          this.setData({
            bookingList: bookingList,
            isLoadBookingData: true,
            _bookingList_: _bookingList_
          })
          wx.hideLoading()
        }).catch(err => {
          console.log(err);
          wx.hideLoading()
        })
      } else {
        this.setData({
          bookingList: bookingList,
          _bookingList_: _bookingList_
        })
      }
    },
    onChange(e) {
      // console.log(e);
    },
    onBooking(e) {
      // 给index传参 search
      // 参数1 自定义响应事件
      // 参数2 data
      this.triggerEvent('booking', {
        PageCur: "search"
      })
    },
  },
})