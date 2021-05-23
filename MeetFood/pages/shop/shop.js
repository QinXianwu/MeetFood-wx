import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

var app = getApp()
var getData = require('../../utils/getData')
var util = require('../../utils/util')

Page({

  data: {
    imgList: [{
      url: 'https://res.hoto.cn/5d382d750135db3ab01f8261.png!default'
    }, {
      url: 'https://res.hoto.cn/5d240ee20135db3ab01f496e.png!default'
    }, {
      url: 'https://res.hoto.cn/5cfd14db0135db3ab01ef780.png!default'
    }],
    time: 60,
    dnCur: 0,
    confirmBookingShow: false,
    tempUserInfo: {
      username: '',
      phoneNumber: '',
      code: -1,
    },
    orderMode: -1,
    isGetCode: false,
    isTakeNumber: false,
    isCollShop: false,
    isSelectBar: false,
    isShowSelectText: true,
    dishesList: getData.dishesList,
    bookingList: getData.bookingList,
    userBookingNBT: {
      dnCur: 0,
      tid: -1
    }
  },

  onLoad: function (options) {
    let shopData = JSON.parse(options.shopData)
    console.log(shopData);
    // 创建门店
    this.collectionShop_CRUD(shopData)

    // 初始座位
    this.onSelectBooking({
      currentTarget: {
        dataset: {
          tid: -1,
          type: 'dn',
          dncur: 0
        }
      }
    })

    util.getStorage('userInfo')
      .then(res => {
        wx.showLoading({
          title: '加载中',
          mask: "true"
        })
        wx.cloud.callFunction({
            name: 'collectionShop_CRUD',
            data: {
              type: 'retrieveCollection',
              data: {
                id: shopData.id
              }
            }
          })
          .then(res => {
            let data = res.result.data
            if (data.length > 0) {
              // 该用户已订阅该门店
              this.setData({
                isCollShop: true
              })
            }
            wx.hideLoading()
          })
      })
    this.setData({
      shopData: shopData,
      imgList: shopData.photos.length != 0 ? shopData.photos : this.data.imgList
    })
  },

  // 查询数据库中是否存在该门店 不存在 则添加
  collectionShop_CRUD(shopData) {
    wx.cloud.callFunction({
      name: 'collectionShop_CRUD',
      data: {
        type: 'retrieveShop',
        shopid: shopData.id
      }
    }).then(res => {
      console.log(res, '查询成功');
      let data = res.result.data
      if (data.length > 0) {
        // 该门店已加盟
        console.log('已加盟');
      } else {
        // 未加盟
        let date = util.DateFormatted(new Date())
        let data = {
          id: shopData.id,
          type: shopData.type,
          title: shopData.name,
          score: shopData.score,
          logoUrl: shopData.logoUrl,
          perCapita: shopData.perCapita,
          category: shopData.category,
          address: shopData.address,
          // adcode: shopData.ad_info.adcode,
          city: shopData.cityname,
          district: shopData.adname,
          province: shopData.pname,
          lat: shopData.location.split(',')[1],
          lng: shopData.location.split(',')[0],
          tel: shopData.tel,
          createdTime: date.dateE + " " + date.time,
          updatedTime: date.dateE + " " + date.time
        }
        // console.log(data);
        wx.cloud.callFunction({
            name: 'collectionShop_CRUD',
            data: {
              type: 'createShop',
              data,
            }
          })
          .then(res => {
            console.log(res, '添加成功');
          })
          .catch(err => {
            console.log(err, '添加失败');
          })
      }
    }).catch(reason => {
      console.log(reason, '查询门店失败');
    })
  },

  // 订阅该门店
  onCollectionShop(e) {
    let cloudUserData = app.globalData.cloudUserData

    if (!this.data.isCollShop) {
      wx.showLoading({
          title: '正在加载',
          mask: true,
        })
        .then(value => {
          let date = util.DateFormatted(new Date())
          util.getStorage('userInfo').then(res => {
              wx.cloud.callFunction({
                name: 'collectionShop_CRUD',
                data: {
                  type: 'retrieveCollection',
                  data: {}
                }
              }).then(res => {
                let data = res.result.data
                if (data.length < 10) {
                  wx.cloud.callFunction({
                    name: 'collectionShop_CRUD',
                    data: {
                      type: 'createCollection',
                      data: {
                        shopid: this.data.shopData.id,
                        createdTime: date.dateE + " " + date.time,
                        updatedTime: date.dateE + " " + date.time
                      }
                    }
                  }).then(value => {
                    wx.hideLoading()
                    this.myShowToast('订阅成功', 'success', 1500)
                    cloudUserData.CollectionShopLength++
                    app.globalData.cloudUserData = cloudUserData
                    this.setData({
                      isCollShop: true
                    })
                  })
                } else {
                  wx.hideLoading()
                  this.myShowToast('订阅次数上限', 'error', 1500)
                }
              })
            })
            .catch(err => {
              wx.hideLoading()
              this.myShowToast('您还未登录', 'error', 1500)
              console.log(err, '未登录');
            })
        })
        .catch(reason => {
          console.log(reason);
        })
    }
  },

  onSelectBar(e) {
    let barCur = e.currentTarget.dataset.barcur
    let isSelectBar = this.data.isSelectBar
    if (barCur == 'booking' && isSelectBar) {
      this.setData({
        isSelectBar: !this.data.isSelectBar,
      })
      setTimeout(() => {
        this.setData({
          isShowSelectText: !this.data.isSelectBar
        })
      }, 1)
    } else if (barCur == 'dishes' && !isSelectBar) {
      this.setData({
        isSelectBar: !this.data.isSelectBar,
      })
      setTimeout(() => {
        this.setData({
          isShowSelectText: !this.data.isSelectBar
        })
      }, 1)
    }
  },

  // 减少菜品数量
  onSubtrahDishes(e) {
    let dCur = e.currentTarget.dataset.d
    let ddCur = e.currentTarget.dataset.dd
    let dishesList = this.data.dishesList
    let data = dishesList[dCur].data[ddCur]
    data.number--
    this.setData({
      dishesList: dishesList
    })
  },

  // 添加菜品数量
  onAddDishes(e) {
    let dCur = e.currentTarget.dataset.d
    let ddCur = e.currentTarget.dataset.dd
    let dishesList = this.data.dishesList
    let data = dishesList[dCur].data[ddCur]

    data.number++
    this.setData({
      dishesList: dishesList
    })
  },

  // 拨打商家电话
  onPhoneCall(e) {
    let tel = this.data.shopData.tel
    if (tel.length > 0) {
      wx.makePhoneCall({
        phoneNumber: tel.split(";")[0],
      }).then(value => {
        console.log(value);
      }).catch(reason => {
        console.log(reason);
      })
    } else {
      wx.showToast({
        title: '联系不到商家',
        icon: 'error'
      })
    }
  },

  // 选择预约座位
  onSelectBooking(e) {
    let tid = e.currentTarget.dataset.tid
    let type = e.currentTarget.dataset.type
    let dnCur = e.currentTarget.dataset.dncur
    let bookingList = this.data.bookingList
    let userBookingNBT = this.data.userBookingNBT
    let isTakeNumber = false

    if (type == 'dn') {
      //判断该 就餐人数是否需要取号
      isTakeNumber = bookingList[dnCur].arr.every(function (item) {
        return item.type == 1;
      })

      if (userBookingNBT.tid != -1 && userBookingNBT.tid != -2) {
        bookingList[userBookingNBT.dnCur].arr[userBookingNBT.tid].state = false
      }
      userBookingNBT.dnCur = dnCur
      userBookingNBT.tid = isTakeNumber ? -2 : -1
      this.setData({
        dnCur: dnCur,
        bookingList: bookingList,
        userBookingNBT: userBookingNBT,
        isTakeNumber: isTakeNumber ? true : false //是否需要取号
      })
    } else if (type == 'table') {
      // 选座
      dnCur = this.data.dnCur
      bookingList[dnCur].arr[tid].state = false
      userBookingNBT.tid == tid ? userBookingNBT.tid = -1 : userBookingNBT.tid = tid
      this.setData({
        bookingList: bookingList,
        userBookingNBT: userBookingNBT
      })
    }
  },

  // 确认预约
  showPopup() {
    util.getStorage('userInfo')
      .then(value => {
        this.setData({
          confirmBookingShow: true,
          tempUserInfo: {
            username: '',
            phoneNumber: '',
            code: -1,
          },
          orderMode: -1,
        });
      })
      .catch(reason => {
        this.myShowToast('您还未登录', 'error', 1500)
      })
  },

  onClose() {
    this.setData({
      confirmBookingShow: false
    });
  },

  // 选择点餐方式
  onOrderMode(e) {
    this.setData({
      orderMode: e.currentTarget.dataset.ordermode
    })
  },

  // 提示用户就餐人数超过多少可直接联系商家
  onDNremind(e) {
    let bookingList = this.data.bookingList
    // this.myShowToast('人数超过' + bookingList.length + '人可直接联系商家', 'none', 2000)
    Notify({
      type: 'primary',
      message: '人数超过' + bookingList.length + '人可直接联系商家'
    });
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
        text: '验证码五分钟内有效'
      }
    }).then(value => {
      let newData = new Date()
      wx.hideLoading()
      this.myShowToast('发送成功', 'success', 1500)
      this.setData({
        isGetCode: true,
        code: code
      })
      wx.setStorageSync('code', {
        code: code,
        date: newData
      })
      let timeInterval = setInterval(() => {
        let time = this.data.time
        time--
        this.setData({
          time: time
        })
      }, 1000)
      setTimeout(() => {
        this.setData({
          isGetCode: false,
          time: 60
        })
        clearInterval(timeInterval)
      }, 1000 * 60)
      console.log(value);
    }).catch(err => {
      console.log(err);
      wx.hideLoading()
      this.myShowToast('发送失败', 'error', 1500)
      console.log(err);
    })
  },

  // 用户对订阅消息进行授权 / 授权一次只能推送一条消息
  onSubscribeMessage() {
    let that = this
    let tempUserInfo = this.data.tempUserInfo
    let isPN = util.checkPhone(tempUserInfo.phoneNumber)
    if (isPN) {
      if (!this.data.isGetCode) {
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
      }
    } else if (tempUserInfo.phoneNumber.length == 0) {
      this.myShowToast('请输入手机号码', 'error', 2000)
    } else {
      this.myShowToast('手机号码有误', 'error', 2000)
    }
  },

  //输入用户名/手机号码/验证码
  onInputUserInfo(e) {
    let inputtype = e.currentTarget.dataset.inputtype
    let value = e.detail.value

    if (inputtype == 'un') {
      this.data.tempUserInfo.username = value
    } else if (inputtype == 'pn') {
      this.data.tempUserInfo.phoneNumber = value
    } else if (inputtype == 'co') {
      this.data.tempUserInfo.code = value
    }
  },

  // 提交预约
  onSubmitBooking(e) {
    let tempUserInfo = this.data.tempUserInfo
    let dishesList = this.data.dishesList
    let orderMode = this.data.orderMode

    if (tempUserInfo.username.length == 0) {
      this.myShowToast('请输入姓名', 'error', 1500)
    } else if (tempUserInfo.phoneNumber.length == 0) {
      this.myShowToast('请输入手机号码', 'error', 1500)
    } else if (orderMode == -1) {
      this.myShowToast('请选择点餐方式', 'error', 1500)
    } else if (tempUserInfo.code == -1) {
      this.myShowToast('请输入验证码', 'error', 1500)
    } else if (tempUserInfo.code.length < 5) {
      this.myShowToast('验证码为5位数字格式', 'none', 1500)
    } else {
      wx.showLoading({
        title: '校验中',
      })
      util.getStorage('code')
        .then(value => {
          let code = value.data.code // 验证码
          let date = new Date(value.data.date) // 存入时间
          let newDate = new Date() // 当前时间
          let shoppingCart = [] // 购物车

          dishesList.forEach(element => {
            element.data.forEach(ele => {
              if (ele.number > 0) {
                shoppingCart.push(ele)
              }
            })
          });
          wx.hideLoading()
          if (newDate.getTime() - date.getTime() > 300000) {
            this.myShowToast('验证码无效', 'error', 1500)
            return
          } else if (tempUserInfo.code != code) {
            this.myShowToast('验证码错误', 'error', 1500)
            return
          } else if (orderMode == 1 && shoppingCart.length == 0) {
            this.myShowToast('购物车为空', 'error', 1500)
            return
          } else {
            let date = util.DateFormatted(new Date())
            let isTakeNumber = this.data.isTakeNumber
            let userBookingNBT = this.data.userBookingNBT
            let shopData = this.data.shopData
            let keyChars = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
              'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
            let bookingInfo = {
              userName: tempUserInfo.username, // 姓名
              phoneNumber: tempUserInfo.phoneNumber, // 手机号码
              orderMode: ~~orderMode, // 点餐方式 1-在线 2-到店
              shopID: shopData.id, // 门店id
              shopData: shopData, // 门店信息
              state: isTakeNumber ? '取号排队' : '预约成功',
              dinersNumber: userBookingNBT.dnCur + 1, // 就餐人数
              seatNumber: isTakeNumber ? '待分配' : userBookingNBT.tid + 1, // 锁定的桌号
              takeNumber: keyChars[userBookingNBT.dnCur] + (Math.random() * 9).toFixed(1) * 10,
              createdTime: date.dateE + " " + date.time,
              updatedTime: date.dateE + " " + date.time,
              shoppingCart: ~~orderMode == 1 ? shoppingCart : []
            }

            wx.showLoading({
              title: '正在提交',
            })
            wx.cloud.callFunction({
              name: 'booking_CRUD',
              data: {
                type: 'create',
                data: {
                  ...bookingInfo
                }
              }
            }).then(res => {
              wx.hideLoading()
              console.log(res, '提交成功');
              bookingInfo._id = res.result._id
              wx.showToast({
                title: isTakeNumber ? '取号成功' : '预约成功',
                icon: 'success'
              })
              app.globalData.isLoadBookingData = false
              setTimeout(() => {
                // 拿到所有的page对象
                const pages = getCurrentPages()
                // 前一个页面
                let indexPage = pages[pages.length - 2];
                indexPage.setData({
                  PageCur: 'booking',
                  newBookingData: bookingInfo
                })
                // indexPage.onLoad()
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500)
            }).catch(err => {
              wx.hideLoading()
              wx.showToast({
                title: isTakeNumber ? '取号失败' : '预约失败',
                icon: 'error'
              })
              console.log(err, '提交失败');
            })
            console.log(bookingInfo);
          }
        })
        .catch(reason => {
          wx.hideLoading()
          this.myShowToast('验证码无效', 'error', 1500)
        })
    }
  },
  myShowToast(title = '标题', icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  }
})