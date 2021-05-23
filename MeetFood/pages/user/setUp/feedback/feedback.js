import Notify from '../../../../miniprogram_npm/@vant/weapp/notify/notify';
var util = require('../../../../utils/util')

Page({

  data: {
    description_text: '',
    imgList: [],
    phoneNumber: ''
  },
  onLoad: function (options) {},
  onInputText(e) {
    this.setData({
      description_text: e.detail.value
    })
  },
  // 选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  // 预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  onPhoneNumber(e) {
    this.data.phoneNumber = e.detail.value
  },
  onSubmit(e) {
    let description_text = this.data.description_text
    let phoneNumber = this.data.phoneNumber
    let imgList = this.data.imgList
    let newDate = util.DateFormatted(new Date())

    if (description_text.length < 10) {
      Notify({
        type: 'warning',
        background: '#ffc107',
        message: '请填写不低于10个字的问题描述'
      });
    } else {
      let date = new Date()
      let _date = date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate()
      let tempPath = 'MeetFoot/UserFeedback_img/' + _date + '/'
      let _date_ = date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '__'
      let imgNameArr = []

      if (phoneNumber.length == 0 || (util.checkPhone(phoneNumber) && phoneNumber.length > 0)) {
        // 未输入手机号码 或 输入正确的手机号码
        wx.showLoading({
          title: '正在提交'
        })
        if (imgList.length > 0) {
          imgList.forEach(img => {
            let tempName = img.slice(img.lastIndexOf('/') + 1)
            imgNameArr.push(tempName)
            this.uploadFile({
              temFileSrc: img,
              fileName: tempPath + _date_ + tempName
            })
          });
        }
        wx.cloud.callFunction({
          name: 'User_FeedbackCRUD',
          data: {
            type: 'create',
            data: {
              description_text: description_text,
              phoneNumber: phoneNumber,
              imgNameArr: imgNameArr,
              createdTime: newDate.dateE + " " + newDate.time,
              updatedTime: newDate.dateE + " " + newDate.time
            }
          }
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '谢谢你的意见',
            icon: 'success',
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
            console.log(res, '反馈添加成功');
          })
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '提交失败',
            icon: "error",
          }).then(() => {
            console.log(err, '反馈添加失败');
          })
        })
      } else {
        Notify({
          type: 'warning',
          background: '#ffc107',
          message: '手机号码有误，请重试'
        });
      }
    }
  },
  // 上传文件(图片)
  uploadFile({
    temFileSrc,
    fileName
  }) {
    let UploadTask = wx.cloud.uploadFile({
      cloudPath: fileName, // 文件名称及路径
      filePath: temFileSrc, // 文件临时路径
      success: (res) => {
        console.log(res);
        console.log(UploadTask);
      },
      fail: (error) => {
        console.log(error);
      }
    })
    UploadTask.onProgressUpdate((result) => {
      console.log('上传进度', result.progress)
      console.log('已经上传的数据长度', result.totalBytesSent, 'Bytes')
      console.log('预期需要上传的数据总长度', result.totalBytesExpectedToSend, 'Bytes')
    })
  },
})