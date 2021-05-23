const cloud = require('wx-server-sdk')

cloud.init({
  'env': cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const BookingDB = db.collection('Booking')
  const type = event.type
  const data = event.data
  try {
    if (type == 'create') {
      return BookingDB.add({
        data: {
          OPENID: wxContext.OPENID, // 用户openId
          USERNAME: data.userName || "", // 预约人姓名
          PHONE_NUMBER: data.phoneNumber || "", // 手机号码
          ORDER_MODE: data.orderMode || 0, // 点餐方式 1-在线 2-到店
          SHOPID: data.shopID || "", // 商家id
          SHOPDATA: data.shopData || "", // 商家数据
          STATE: data.state || "", // 预约状态 取号排队-预约成功
          DINERS_NUMBER: data.dinersNumber || "", // 就餐人数
          SEAT_NUMBER: data.seatNumber || "", // 锁定桌号
          TAKE_NUMBER: data.takeNumber || "00", // 取号随机码
          SHOPPING_CART: data.shoppingCart || [],
          CREATED_TIME: data.createdTime || "",
          UPDATED_TIME: data.updatedTime || "",
        }
      })
    } else if (type == 'retrieve') {
      return BookingDB
        .where({
          OPENID: wxContext.OPENID
        })
        .get()
    } else if (type == 'update') {
      return BookingDB.doc(data._id)
        .update({
          data: {}
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