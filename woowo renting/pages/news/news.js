const util = require('../../utils/util');

// pages/news/news.js
Page({

  /**
   * Page initial data
   */
  data: {
    newsList: [],
    ifShowNotingMark: false,
    ifShowLoading: false,
    ifShowReachBottom: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;

    that.getNews();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  getNews: function () {
    let that = this;
    let data = that.data;
    
    data.ifShowLoading = true;
    that.setData(data);

    util.requestNews().then(res => {
      data.ifShowLoading = false;

      if (res.code == 0) {
        data.newsList = res.data;
        
        if (data.newsList.length == 0) {
          data.ifShowNotingMark = true;
        }
        else {
          data.ifShowReachBottom = true;
        }
      }

      else {
        data.ifShowNotingMark = true;

        wx.showToast({
          title: '请求失败，请稍后再试~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }

      that.setData(data);
    })
  },

  goToArticle: function (event) {

    let src = event.currentTarget.dataset.item.url;

    console.log(event);

    wx.navigateTo({
      url: '/pages/article/article?url=' + src
    })
  } 
})