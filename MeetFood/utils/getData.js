var util = require('../utils/util')

let userAvatarSrc = 'https://hbimg.huabanimg.com/473b078d0879b844724e59eb5f2fc03ef57065fa726e-GlmJ8N_fw658/format/webp'

let _404Img = 'https://i01piccdn.sogoucdn.com/cef32159b287b251'

let hotActivityList = [{
  code: '主打推荐',
  title: 'SIAL China|审食度势，点食成金',
  imageSrc: 'https://i1.douguo.com//upload/banner/e/4/f/e47c99825bf31cb6c6b48fce0868f39f.jpg',
  content: `第二十二届SIAL China中国国际食品和饮料展览会开幕在即！一场肆意品尝世界味道的吃货狂欢，一个满满吃货福泽的干饭天堂～5月18日-5月20日上海浦东·新国际博览中心，SIAL China 2021邀你尝五湖四海的美味、玩转别开生面的主题活动！热爱美食的豆子们快来报名参展`
}, {
  code: '等你狂欢',
  title: '致敬吃心不改，万元好礼等你狂欢！',
  imageSrc: 'http://i1.douguo.net/upload/advert_user/1/7/c/1744df393f4be7189f037f7bad29648c.jpg',
  content: `#嗨饭十年，吃心不改# 
  2021年豆果美食已经10岁啦！感谢大家一路相伴，未来我们继续一起嗨饭！转+关，并对豆果美食送上你的十周年祝福，5.10日抽1位小可爱送上【豆果商城150元无门槛优惠券】1张，抽5位小可爱送上【豆果美食十周年限定礼盒套装】。
  还有十周年万元限定好礼[礼物]等你一同狂欢！`
}, {
  code: '限时优惠',
  title: '免费申领|厨房有维达，洁净超省心',
  imageSrc: 'https://i1.douguo.com//upload/banner/0/c/7/0c72f44204f40aae642e267cd16e6a67.jpg',
  content: `维达厨房纸用来吸收食材的水分真的是太好了，还可以清洁厨房油渍
  参与活动: #免费申领|厨房有维达，洁净超省心#`
}, {
  code: '值得参加',
  title: '笔记有奖征集丨自制万能卤味',
  imageSrc: 'https://i1.douguo.com/upload/note/8/f/6/8f7b50b79355c53b80d92f426f3e5216.jpg',
  content: `活动说明：
  　　用户以笔记形式上传分享喜欢的美食类型，或食材选择上的注意事项，最终以内容的总点赞量、主题契合度、作品呈现度由豆果美食小编进行筛选，三大维度综合考量评选出23名用户。
  　　赞助机会：
  　　活动设立“吃货大奖”
  　　赞助收益：
  　　1、赞助企业产品曝光机会：企业赞助的相关产品将作为奖品进行展示，同时随着该活动在全渠道的推广获得叠加品牌曝光效应；
  　　2、特别鸣谢：颁奖发布环节中，将赞助企业作为活动“特别鸣谢品牌”重点提及`
}]

let temphotShopList = [{
  id: "17666744697346607549",
  title: "福口居（正佳店）",
  logoUrl: "https://hbimg.huabanimg.com/9aa43a2c03016654ee40936ac524478d58dd37613d56-6sfHa2_fw658/format/webp",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.6",
  type: 0,
  address: "天河区正佳广场403号（体育西路A出口直达）",
  perCapita: "63.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  adname: "清城区",
  _distance: 320.02,
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "京味斋·北京牡丹烤鸭（奥体店) ",
  logoUrl: "https://hbimg.huabanimg.com/9aa43a2c03016654ee40936ac524478d58dd37613d56-6sfHa2_fw658/format/webp",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.0",
  type: 0,
  address: "朝阳区安苑东里1区2号楼",
  perCapita: "64.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "米斯特比萨（通州九棵树店）",
  logoUrl: "https://hbimg.huabanimg.com/b540625e448ce5aeb57f29640974804e73805ea6142e-4sEYaj_fw658/format/webp",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.5",
  type: 0,
  address: "通州区轻轨九棵树站南侧瑞都国际北区商场1层（九棵树城铁站旁）",
  perCapita: "83.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "福口居（正佳店）",
  logoUrl: "https://cp1.douguo.com/upload/caiku/8/9/f/400x266_896887bb3e6db843511d2b9fbac1e80f.jpeg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.6",
  type: 0,
  address: "天河区正佳广场403号（体育西路A出口直达）",
  perCapita: "63.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "福口居（正佳店）",
  logoUrl: "https://cp1.douguo.com/upload/caiku/8/9/f/400x266_896887bb3e6db843511d2b9fbac1e80f.jpeg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.6",
  type: 0,
  address: "天河区正佳广场403号（体育西路A出口直达）",
  perCapita: "63.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "京味斋·北京牡丹烤鸭（奥体店) ",
  logoUrl: "https://cp1.douguo.com/upload/caiku/4/5/9/400x266_45e01e64debbccb76fd74525078de229.jpeg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.0",
  type: 0,
  address: "朝阳区安苑东里1区2号楼",
  perCapita: "64.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "米斯特比萨（通州九棵树店）",
  logoUrl: "https://cp1.douguo.com/upload/caiku/9/9/d/400x266_99f04e0afa16d9d93358470bebbd0ead.jpeg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.5",
  type: 0,
  address: "通州区轻轨九棵树站南侧瑞都国际北区商场1层（九棵树城铁站旁）",
  perCapita: "83.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "福口居（正佳店）",
  logoUrl: "https://cp1.douguo.com/upload/caiku/c/f/e/400x266_cf646fb86c64b16821abb0b0fe99e0ee.jpg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.6",
  type: 0,
  address: "天河区正佳广场403号（体育西路A出口直达）",
  perCapita: "63.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "京味斋·北京牡丹烤鸭（奥体店) ",
  logoUrl: "https://cp1.douguo.com/upload/caiku/7/9/0/220x220_7961bf0cbddd97a2a05ab4d8ff74f110.jpg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.0",
  type: 0,
  address: "朝阳区安苑东里1区2号楼",
  perCapita: "64.00",
  adname: "清城区",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "米斯特比萨（通州九棵树店）",
  logoUrl: "https://i1.douguo.com/upload/caiku/b/3/d/960_b388e7dec09d8ea35fae59831e26572d.jpg",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.5",
  type: 0,
  address: "通州区轻轨九棵树站南侧瑞都国际北区商场1层（九棵树城铁站旁）",
  perCapita: "83.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  adname: "清城区",
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}]

let historyBooking = [{
  shopInfo: {
    logo: "https://hbimg.huabanimg.com/c570a9747ecb0a71a5b1b72b1dc22fbbf7713bc11683-6eFBW8_fw658/format/webp",
    title: "福口居（正佳店）",
    address: "天河区正佳广场403号（体育西路A出口直达）"
  },
  bookingState: "预约成功",
  takeNumber: 'B03',
  userName: '张三',
  seatNumber: 6,
  dinesNumber: '1-2',
  howOrder: '到店点餐',
  bookingTime: '2021-04-31 16:33:59',
  orderNumber: '2021043116335913888096',
  warmReminder: '温馨提醒：请及时到店点餐，15分钟后将会取消预约，取消预约或订单完成后即可再次预约',
  type: 2,
}]

let dishesList = [{
  type: '4款堂食套餐',
  data: [{
    imageUrl: 'https://p0.meituan.net/208.126/deal/c8ebac16f1d49391d63c75b3889f7c8b867017.png',
    title: '蘭苑四人套餐',
    description: '可免费使用包间',
    price: '688',
    discount: '10',
    number: 0
  }, {
    imageUrl: 'https://p0.meituan.net/208.126/deal/d955bb56fc938727f7925ed988caf89a865048.png',
    title: '蘭苑双人套餐',
    description: '可免费使用包间',
    price: '298',
    discount: '9.0',
    number: 0
  }, {
    imageUrl: 'https://p0.meituan.net/208.126/deal/66225a3872889c88d3552277952b6c11172636.jpg',
    title: '三文鱼刺身1份',
    description: '可免费使用包间',
    price: '29.9',
    discount: '8.5',
    number: 0
  }, {
    imageUrl: 'https://p0.meituan.net//deal/975004d3f33505322f52b1b998a714a060544.jpg',
    title: '微醺套餐1份',
    description: '提供免费WiFi',
    price: '116',
    discount: '10',
    number: 0
  }]
}, {
  type: '推荐菜',
  data: [{
    imageUrl: 'https://qcloud.dpfile.com/pc/-EQcdCpTxHR6YoZoi4Izh9aCl4PA3BNgKn2O-EHBRQG0SfohvPOe2grC2U57Bsze5g_3Oo7Z9EXqcoVvW9arsw.jpg',
    title: '芝士焗蟹宝',
    description: '周一至周五',
    price: '38',
    discount: '10',
    number: 0
  }, {
    imageUrl: 'https://qcloud.dpfile.com/pc/Pc6lp0W6XWKuTu4L7KloIBZ-QhD76V7ZQAMpIBC4xo22ow01Tmb5Px4JM8tbpvJc5g_3Oo7Z9EXqcoVvW9arsw.jpg',
    title: '鹅肝蛋蒸',
    description: '周一至周五',
    price: '15',
    discount: '10',
    number: 0
  }, {
    imageUrl: 'https://qcloud.dpfile.com/pc/EY_um97dCGZIawN-npr8TSjNX7oWiUzuuJy5XQLpUq2YaCqE8KEE8D3jXlKeA1a95g_3Oo7Z9EXqcoVvW9arsw.jpg',
    title: '炸鸡块',
    description: '周一至周五',
    price: '9.9',
    discount: '10',
    number: 0
  }, ]
}]

let hotShopList = [{
  id: "17666744697346607549",
  title: "福口居（正佳店）",
  logoUrl: "https://hbimg.huabanimg.com/c570a9747ecb0a71a5b1b72b1dc22fbbf7713bc11683-6eFBW8_fw658/format/webp",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.6",
  type: 0,
  address: "天河区正佳广场403号（体育西路A出口直达）",
  perCapita: "63.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "京味斋·北京牡丹烤鸭（奥体店) ",
  logoUrl: "https://hbimg.huabanimg.com/9aa43a2c03016654ee40936ac524478d58dd37613d56-6sfHa2_fw658/format/webp",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.0",
  type: 0,
  address: "朝阳区安苑东里1区2号楼",
  perCapita: "64.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}, {
  id: "17666744697346607549",
  title: "米斯特比萨（通州九棵树店）",
  logoUrl: "https://hbimg.huabanimg.com/b540625e448ce5aeb57f29640974804e73805ea6142e-4sEYaj_fw658/format/webp",
  tel: "0763-6888888",
  category: "美食:西餐:其它西餐",
  score: "4.5",
  type: 0,
  address: "通州区轻轨九棵树站南侧瑞都国际北区商场1层（九棵树城铁站旁）",
  perCapita: "83.00",
  location: {
    lat: 23.695756,
    lng: 113.060664
  },
  _distance: 320.02,
  ad_info: {
    adcode: 441802,
    province: "广东省",
    city: "清远市",
    district: "清城区"
  }
}]

let bookingList = [{
  arr: [{
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, ]
}, {
  arr: [{
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, ]
}, {
  arr: [{
    state: false,
    type: -1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, ]
}, {
  arr: [{
    state: false,
    type: -1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,
  }, {
    state: true,
    type: 1,
  }, {
    state: true,
    type: 1,
  }, ]
}, {
  arr: [{
    state: true,
    type: 1,
  }, {
    state: false,
    type: -1,

  }, {
    state: false,
    type: -1,

  }, {
    state: false,
    type: -1,

  }, ]
}, {
  arr: [{
    state: true,
    type: 1
  }, {
    state: false,
    type: -1
  }, {
    state: false,
    type: -1
  }, {
    state: true,
    type: 1
  }, {
    state: false,
    type: -1
  }, {
    state: false,
    type: -1
  }, ]
}, ]

let newLocationInfo = {
  city: "海淀区",
  date: util.DateFormatted(new Date()).dateC,
  province: "北京",
  recommend: '海淀区北京市十一学校(一分校)',
  reporttime: "2021-05-04 22:39:08",
  temperature: "15℃",
  weather: "晴",
  week: util.DateFormatted(new Date()).weekday,
}

let ad_info = {
  adcode: "110108",
  city: "北京市",
  city_code: "156110000",
  district: "海淀区",
  location: {
    lat: 40.045132,
    lng: 116.375
  },
  name: "中国,北京市,北京市,海淀区",
  nation: "中国",
  nation_code: "156",
  province: "北京市",
}

let cloudUserData = {
  _id: "",
  NICKNAME: "",
  _NICKNAME: "",
  AVATAR_URL: "",
  GENDER: 0,
  LEVEL: 1,
  INTEGRAL: 0,
  TRUST_SCORE: 0,
  GROWTH_VALUE: 0,
  PHONE_NUMBER: "",
  CollectionShopLength: 0,
  COUNTRY: "",
  PROVINCE: "",
  CITY: "",
  CREATED_TIME: "",
  UPDATED_TIME: "",
}

let menu1 = [{
    text: '全部美食',
    value: 0
  },
  {
    text: '小吃快餐（8887）',
    value: 1
  },
  {
    text: '面包甜点（6368）',
    value: 2
  },
  {
    text: '饮品店（12368）',
    value: 3
  },
  {
    text: '火锅（3268）',
    value: 4
  },
  {
    text: '粤菜（3856）',
    value: 5
  },
  {
    text: '生日蛋糕（2884）',
    value: 6
  },
  {
    text: '西餐（2546）',
    value: 7
  },
]

let menu2 = [{
    text: '智能排序',
    value: 'a'
  },
  {
    text: '好评优先',
    value: 'b'
  },
  {
    text: '销量最高',
    value: 'c'
  }, {
    text: '价格由低到高',
    value: 'd'
  }, {
    text: '价格由高到低',
    value: 'e'
  }
]

module.exports = {
  userAvatarSrc,
  hotActivityList,
  temphotShopList,
  historyBooking,
  bookingList,
  dishesList,
  hotShopList,
  newLocationInfo,
  cloudUserData,
  _404Img,
  menu1,
  menu2,
  ad_info
}