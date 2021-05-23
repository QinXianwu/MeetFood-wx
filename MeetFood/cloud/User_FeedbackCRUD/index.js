const cloud = require('wx-server-sdk')

cloud.init({
  'env': cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const FeedbackDB = db.collection('Feedback')
  const type = event.type
  const data = event.data

  try {
    if (type == 'create') {
      return FeedbackDB.add({
        data: {
          OPENID: wxContext.OPENID,
          DESCRIPTION_TEXT: data.description_text || '',
          IMG_NAME1: data.imgNameArr[0] || '',
          IMG_NAME2: data.imgNameArr[1] || '',
          IMG_NAME3: data.imgNameArr[2] || '',
          IMG_NAME4: data.imgNameArr[3] || '',
          PHONE_NUMBER: data.phoneNumber || "",
          CREATED_TIME: data.createdTime || "",
          UPDATED_TIME: data.updatedTime || "",
        }
      })
    } else if (type == 'retrieve') {
      return FeedbackDB
        .where({
          OPENID: wxContext.OPENID
        })
        .get()
    } else if (type == 'update') {
      return 0
    } else if (type == 'delete') {
      return 0
    } else {
      return 0
    }
  } catch (error) {
    return error
  }
}