
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

function http(url,callBack) {
  douban_limit();
  wx.showLoading({
    title: 'Loading',
    mask: true
  })
  wx.request({
    url: url,
    method: "get",
    header: {
      "content-Type": "application/xml"
    },
    success(res) {
      var data = res.data.subjects;
      callBack(data);
      wx.hideLoading();
    },
    fail(err) {
      wx.showToast({
        title: '请检查网络是否链接',
        icon: 'loading',
        duration: 2000
      })
    }
  })
}
function douban_limit() {
  var timestamp = Date.parse(new Date());
  var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
  var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
  if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
    wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
    if (requestDoubanNum < 35) {
      //Lower than 35/m,pass            
      return;
    }
    else {
      wx.showToast({
        title: '豆瓣api请求频率超35/m，小心',
        icon: 'loading',
        duration: 5000
      })
      //提示或者去别的地方
      // wx.redirectTo({
      //      url:"pages/welcome/welcome"
      // });
    }
  }
  else {
    wx.setStorageSync('requestDoubanTime', timestamp);
    wx.setStorageSync('requestDoubanNum', 1);
  }
}
module.exports = {
  convertToStarsArray,
  http
}