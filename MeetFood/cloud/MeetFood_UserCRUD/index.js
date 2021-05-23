const cloud = require('wx-server-sdk')

cloud.init({
  'env': cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const UsersDB = db.collection('Users')
  const type = event.type
  const data = event.data
  try {
    if (type == 'create') {
      return UsersDB.add({
        data: {
          OPENID: wxContext.OPENID,
          NICKNAME: data.nickname || "测试号",
          _NICKNAME: data._nickname || "测试号",
          GENDER: data.gender || 0,
          AVATAR_URL: data.avatarUrl || "",
          PHONE_NUMBER: data.phoneNumber || "",
          LEVEL: data.level || 1,
          INTEGRAL: data.integral || 0,
          TRUST_SCORE: data.trust_score || 0,
          GROWTH_VALUE: data.growth_value || 10,
          COUNTRY: data.country || "",
          PROVINCE: data.province || "",
          CITY: data.city || "",
          CREATED_TIME: data.createdTime || "",
          UPDATED_TIME: data.updatedTime || "",
        }
      })
    } else if (type == 'retrieve') {
      return UsersDB
        .where({
          OPENID: wxContext.OPENID
        })
        .get()
    } else if (type == 'update') {
      return UsersDB.doc(data._id)
        .update({
          data: {
            _NICKNAME: data._nickName,
            PHONE_NUMBER: data.phoneNumber,
            UPDATED_TIME: data.updatedTime,
          }
        })
    } else if (type == 'delete') {
      return 0
    } else {
      return -1
    }
  } catch (error) {
    return error
  }
}