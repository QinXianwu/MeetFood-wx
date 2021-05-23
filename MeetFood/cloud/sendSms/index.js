const cloud = require('wx-server-sdk')
let QcloudSms = require('qcloudsms_js')

cloud.init({
  'env': cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  let code = event.code
  let phone = event.phone
  let appid = ''
  let appKey = ''
  let templateId = 1234 // 模板ID
  let smsSign = 'CCDD' // 短信签名
  let qcloudsms = QcloudSms(appid, appKey) // 创建实例
  let sender = qcloudsms.SmsSingleSender()
  sender.sendWithParam(86, phone, templateId, [code], smsSign, '', '', (res) => {
    console.log(res);
  })

  return {
    "msg": "ok"
  }

}