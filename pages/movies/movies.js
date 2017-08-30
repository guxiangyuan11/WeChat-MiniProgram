const util =require("../util/util.js")
const app = getApp();
// pages/movies/movies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTeater: "",
    comingSoon: "",
    top: "",
    searchResult:"",
    containerShow:true,
    searchPanelShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const inTeaterUrl = app.globalData.doubanbase + "/v2/movie/in_theaters" + "?start=0&count=3";
    const comingSoonUrl = app.globalData.doubanbase + "/v2/movie/coming_soon" + "?start=0&count=3";
    const topUrl = app.globalData.doubanbase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTeaterUrl, "inTeater","正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(topUrl, "top", "TOP评分");
  },
  // 请求数据
  getMovieListData(url, key, Nametitle) {
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    var that = this;
    wx.request({
      url: url,
      method: "get",
      header: {
        "content-Type": "application/xml"
      },
      success(res) {
        var data = res.data.subjects;
        that.getRequire(data, key, Nametitle);
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
  },
  // 对数据进行整理
  getRequire(data, key, Nametitle) {
    let movies = data.map((val) => {
      let title = val.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      return {
        stars: util.convertToStarsArray(val.rating.stars),
        title: title,
        average: val.rating.average,
        coverageUrl: val.images.large,
        movieId: val.id
      }
    });
    let readyData = {}
    readyData[key] = {
      movies,
      Nametitle
      };
    this.setData(readyData);
  },
  onMoreTap(event){
    const queryUrl = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-moive?category=' + queryUrl,
    })
  },
  onBindfocus(){
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  // 回退
  onBack(){
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  },
  onBindchange(e){
    let text = e.detail.value;
    let inTeaterUrl = app.globalData.doubanbase + "/v2/movie/search?q="+text;
    this.getMovieListData(inTeaterUrl,"searchResult","");
  },
  onMovieTap(e){
    let movieid = e.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieid=' + movieid
    })
  }
})