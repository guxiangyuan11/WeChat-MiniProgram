const app = getApp();
const util = require("../../util/util.js")
Page({
  data: {
  
  },
  onLoad: function (options) {
  const id = options.movieid;
  const url = app.globalData.doubanbase + "/v2/movie/subject/" + id;
  this.processDoubanData(url);
  },
  processDoubanData(url){
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
        var data = res.data;
        console.log(data)
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
})