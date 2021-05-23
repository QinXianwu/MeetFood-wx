// 处理字符串过长
function titleTooLong(title, leng) {
  if (title.length > leng) {
    return title.substring(0, leng - 3) + "...";
  } else {
    return title;
  }
}

// 格式时间
function DateFormatted(newDate) {
  let year = newDate.getFullYear()
  let month = (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)
  let date = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
  let hours = newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()
  let minutes = newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()
  let seconds = newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds()
  let weekday = new Array(7);
  weekday[0] = "星期天";
  weekday[1] = "星期一";
  weekday[2] = "星期二";
  weekday[3] = "星期三";
  weekday[4] = "星期四";
  weekday[5] = "星期五";
  weekday[6] = "星期六";

  return {
    dateC: year + "年" + month + "月" + date + "日",
    dateE: year + "-" + month + "-" + date,
    weekday: weekday[newDate.getDay()],
    time: hours + ":" + minutes + ":" + seconds,
  };
}

// 封装对话框 返回Promise对象
function showModal(obj) {
  return new Promise((resolve, reject) => {
    obj.success = resolve
    obj.fail = reject
    wx.showModal(obj)
  })
}

// 返回缓存中指定的key
function getStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject
    })
  })
}

// 随机key
function randomKey(length) {
  let key = "";
  let keyLength = parseInt(length);
  ////所有候选组成验证码的字符，当然也可以用中文的
  // let keyChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  //   'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
  //   'x', 'y', 'z',
  //   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
  //   'X', 'Y', 'Z');
  let keyChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
  //循环组成key的字符串
  for (let i = 0; i < keyLength; i++) {
    //获取随机key下标
    let keyNum = Math.floor(Math.random() * 9);
    //组合成key
    key += keyChars[keyNum];
  }
  return key
}

// 随机key
function randomKeyE(length) {
  let key = "";
  let keyLength = parseInt(length);
  let keyChars = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
  //循环组成key的字符串
  for (let i = 0; i < keyLength; i++) {
    //获取随机key下标
    let keyNum = Math.floor(Math.random() * 9);
    //组合成key
    key += keyChars[keyNum];
  }
  return key
}


// 校验手机号码
function checkPhone(_phone) {
  var tel = /^0\d{2,3}-?\d{7,8}$/; //校验电话号码
  var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (_phone.length == 11) { //手机号码
    if (phone.test(_phone)) {
      return true;
    }
  } else {
    return false
  }
}

module.exports = {
  getStorage,
  titleTooLong,
  DateFormatted,
  showModal,
  randomKey,
  randomKeyE,
  checkPhone,
}