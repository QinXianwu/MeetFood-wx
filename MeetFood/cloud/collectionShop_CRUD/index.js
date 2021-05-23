const cloud = require('wx-server-sdk')

cloud.init({
  'env': cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const ShopDB = db.collection('Shop')
  const CollectionShopDB = db.collection('CollectionShop')
  const type = event.type
  const data = event.data
  const shopid = event.shopid

  try {
    if (type == 'createShop') {
      return ShopDB.add({
        data: {
          SHOPID: data.id,
          TYPE: data.type,
          TITLE: data.title,
          SCORE: data.score,
          LOGOURL: data.logoUrl,
          PER_CAPITA: data.perCapita,
          CATEGORY: data.category,
          ADDRESS: data.address,
          ADCODE: data.adcode,
          CITY: data.city,
          DISTRICT: data.district,
          PROVINCE: data.province,
          LATITUDE: data.lat,
          LONGITUDEL: data.lng,
          TEL: data.tel,
          CREATED_TIME: data.createdTime,
          UPDATED_TIME: data.updatedTime
        }
      })
    } else if (type == 'createCollection') {
      // 用户订阅门店
      return CollectionShopDB.add({
        data: {
          OPENID: wxContext.OPENID,
          SHOPID: data.shopid,
          CREATED_TIME: data.createdTime,
          UPDATED_TIME: data.updatedTime
        }
      })
    } else if (type == 'retrieveShop') {
      return ShopDB
        .where({
          SHOPID: shopid
        })
        .get()
    } else if (type == 'retrieveCollection') {
      let obj = {
        OPENID: wxContext.OPENID
      }
      data.id ? obj.SHOPID = data.id : ''
      return CollectionShopDB
        .where(obj)
        .get()
    } else if (type == 'update') {
      return 0
    } else if (type == 'deleteCollection') {
      return CollectionShopDB.doc(event._id).remove()
    } else {
      return -1
    }
  } catch (error) {
    return error
  }
}