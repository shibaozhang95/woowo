const app = getApp();

// pages/homepage/homepage.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoUserInfo: {},
    showLoginAuth: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;

    that.setData(data);
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
    wx.setNavigationBarTitle({
      title: "个人中心"
    })
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

  navigateToHomepage: function () {
    let that = this;
    let data = that.data;

    if (data.woowoUserInfo.ifLogedin) {
      wx.navigateTo({
        url: '../userPage/userPage?targetUserInfo=' + JSON.stringify(data.woowoUserInfo)
      })
    }
    else {
      that.setData({
        showLoginAuth: true
      })
    }
  },

  navigateTo: function (event) {
    let that = this;
    let data = that.data;
    
    if (!data.woowoUserInfo.ifLogedin) {
      wx.showToast({
        title: '请先登录~',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 2000)
        }
      })

      return;
    }

    let toWhere = event.currentTarget.dataset.towhere;

    wx.navigateTo({
      url: toWhere
    })
  },

  loginSuccess: function (event) {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;
    data.showLoginAuth = false;
    
    that.setData(data);
  },

  refuseAuth: function () {
    let that = this;
    let data = that.data;

    data.showLoginAuth = false;

    that.setData(data);
  }
})