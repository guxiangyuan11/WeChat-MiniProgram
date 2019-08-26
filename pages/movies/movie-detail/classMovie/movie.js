const util = require("../../../util/util.js");
class Movie{
  constructor (url){
    this.url = url;
  }

  getMovieData(cb) {
    this.cb = cb;
    this.processDoubanData(this.url,this.cb);
  }

  processDoubanData(url,callBack) {
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
        if (!data) {
          return;
        }
        var director = {
          avatar: "",
          name: "",
          id: ""
        }
        if (data.directors[0] != null) {
          if (data.directors[0].avatars != null) {
            director.avatar = data.directors[0].avatars.large

          }
          director.name = data.directors[0].name;
          director.id = data.directors[0].id;
        }
        var movie = {
          movieImg: data.images ? data.images.large : "",
          country: data.countries[0],
          title: data.title,
          originalTitle: data.original_title,
          wishCount: data.wish_count,
          commentCount: data.comments_count,
          year: data.year,
          generes: data.genres.join("、"),
          stars: util.convertToStarsArray(data.rating.stars),
          score: data.rating.average,
          director: director,
          casts: util.convertToCastString(data.casts),
          castsInfo: util.convertToCastInfos(data.casts),
          summary: data.summary
        }
        callBack(movie);
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
}
export { Movie }