const app = getApp();
const util = require("../../util/util");
Page(
  {
    /**
     * 页面的初始数据
     */
    data: {
      movies:"",
      dataUrl: "",
      totalCount:0,
      isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      const queryName = options.category;
      wx.setNavigationBarTitle({
        title: queryName
      })
      let dataUrl = "";
      switch (queryName) {
        case "正在热映":
          dataUrl = app.globalData.doubanbase + "/v2/movie/in_theaters";
          break;
        case "即将上映":
          dataUrl = app.globalData.doubanbase + "/v2/movie/coming_soon";
          break;
        case "TOP评分":
          dataUrl = app.globalData.doubanbase + "/v2/movie/top250";
          break;
        default:
          wx.showToast({
            title: '未找到分类',
            icon: "loading"
          })
      }
      this.setData({
        dataUrl
      });
      util.http(dataUrl,(data)=>{
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
        let totalMovies = {};
        // 如果isEmpty不为空那表示movies已经有值，赋值给totalMovies
        // 下次进来把之前的数据链接起来
        // 为了能够连续的加载更多
        if (!this.data.isEmpty) {
          totalMovies = this.data.movies.concat(movies);
        } else {
          totalMovies = movies;
          this.data.isEmpty = false;
        }
        this.setData({ movies: totalMovies });
        this.data.totalCount += 20;
      });
    },
    onScrollLower(){

      var nextUrl = this.data.dataUrl + "?start=" + this.data.totalCount+"&count=20";
      util.http(nextUrl, (data) => {
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
        let totalMovies ={};
        // 如果isEmpty不为空那表示movies已经有值，赋值给totalMovies
        // 下次进来把之前的数据链接起来
        if(!this.data.isEmpty){
          totalMovies = this.data.movies.concat(movies);
        }else{
          totalMovies = movies;
          this.data.isEmpty = false;
        }
        this.setData({ movies:totalMovies });
        this.data.totalCount += 20;
      });
    },
    onMovieTap(e) {
      let movieid = e.currentTarget.dataset.movieid;
      wx.navigateTo({
        url: '../movie-detail/movie-detail?movieid=' + movieid
      })
    }
  }
)