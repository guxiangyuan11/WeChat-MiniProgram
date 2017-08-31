const app = getApp();
// const util = require("../../util/util.js")
import {Movie} from "classMovie/movie.js";
Page({
  data: {
    movie:""
  },
  onLoad: function (options) {
  const id = options.movieid;
  const url = app.globalData.doubanbase + "/v2/movie/subject/" + id;
  let movie = new Movie(url);
  movie.getMovieData((movies)=>{
    this.setData({
      movie: movies
    });
    console.log(this.data.movie);
   });
  },
  viewMoviePostImg(e){
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  }
})