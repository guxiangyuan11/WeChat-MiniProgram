// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onTap(){
      wx.switchTab({
          url: '../posts/posts',
      });
    // wx.redirectTo({
    //   url: '../posts/posts',
    // })
  }
})