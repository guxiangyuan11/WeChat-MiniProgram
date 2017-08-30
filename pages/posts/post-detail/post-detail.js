var postsData = require("../../../data/posts-data");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    collected: false,
    isPlayingMusic:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    const postData = postsData.local_database[id];
    this.setData({isPlayingMusic:false});
    this.setData({detailData: postData});
    const idString = this.data.detailData.postId+"";
    let collecteds =false;
    try {
      var value = wx.getStorageSync(idString)
      if (value) {
        collecteds = value;
      }
    } catch (e) {
      // Do something when catch error
      collecteds = false;
    }
    if (collecteds){
      this.setData({collected: collecteds});
    }
    wx.onBackgroundAudioPlay(()=>{
      this.setData({ isPlayingMusic: true})
    });
    wx.onBackgroundAudioPause(()=>{
      this.setData({ isPlayingMusic: false })
    });
    wx.onBackgroundAudioStop(() => {
      this.setData({ isPlayingMusic: false })
    });
  },
  onMusicTap(event){
    let playingMusic = !this.data.isPlayingMusic;
    this.setData({ isPlayingMusic: playingMusic});
    // 播放音乐
    wx.playBackgroundAudio({
      dataUrl: this.data.detailData.music.url,
      title: this.data.detailData.music.title,
      coverImgUrl: this.data.detailData.music.coverImg
    });
    if (!playingMusic) {
      wx.pauseBackgroundAudio();
    }
  },
  // 分享按钮
  onShareTap(event){
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel
        })
      }
    })
  },
  // 收藏按钮
  onColletionTap(){
    let idString = this.data.detailData.postId + "";
    let collected = this.data.collected;
    collected ? wx.removeStorage({
      key: idString
    }) : wx.setStorage({
      key: idString,
      data: true
    });
    collected ? this.setData({ collected: false }) : this.setData({ collected: true });
    wx.showToast({
      title: collected ? '取消成功': '收藏成功',
      duration: 1000,
      icon: "success"
    })
    // if (this.data.collected){
    //   wx.removeStorage({
    //     key: idString,
    //     success: function (res) {
    //       console.log(res.data)
    //     }
    //   })
    //   this.setData({collected: false});
    //   wx.showToast({
    //     title: '收藏成功！',
    //     duration: 1000,
    //     icon: "success"
    //   })
    // } else {
    //   this.setData({collected: true});
    //   wx.setStorage({
    //   key: idString,
    //   data: true
    // })
    //   wx.showToast({
    //     title: '取消成功',
    //     duration: 1000,
    //     icon: "success"
    //   })
    // }
  },
  onShow(){
    // const backgroundAudioManager = wx.getBackgroundAudioManager()
    // console.log(backgroundAudioManager.paused)
    // if (!backgroundAudioManager.paused){
    //   this.setData({ isPlayingMusic:true});
    // }
  },
  // 离开页面停止播放音乐
  onUnload(){
    wx.stopBackgroundAudio();
  }
})