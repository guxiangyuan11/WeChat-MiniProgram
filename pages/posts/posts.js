var postsData = require("../../data/posts-data");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts_key: postsData.local_database
  },
  onPostTap(event){
   const postId = event.currentTarget.dataset.postid;
   wx.navigateTo({
     url: 'post-detail/post-detail?id='+postId,
   })
  },
  onSwiperItemTap(event){
    const postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})