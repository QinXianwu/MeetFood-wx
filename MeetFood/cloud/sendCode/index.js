const cloud = require('wx-server-sdk')

cloud.init({
  'env': cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let code = event.code
  let openid = wxContext.OPENID
  let phone = event.phone
  let text = event.text


  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      lang: 'zh_CN', // 进入小程序查看”的语言类型
      data: { // 模板内容
        character_string1: {
          value: code
        },
        thing2: {
          value: text
        }
      },
      templateId: 'qGc5Jn1OFD4n35whPsx0GIIsTWoGtaYTpMDCff1owNE', // 模板ID
      //miniprogramState 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
      miniprogramState: 'developer'
    })
    return {
      "mag": "ok",
      "result": result
    }
  } catch (err) {
    return err
  }
}