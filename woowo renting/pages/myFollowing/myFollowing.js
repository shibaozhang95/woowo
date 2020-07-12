const app = getApp();
const util = require('../../utils/util');

// pages/myFollowing/myFollowing.js
Page({

  /**
   * Page initial data
   */
  data: {
    userInfoList: [],

    ifLoading: false,
    ifNothing: false,
    ifReachBottom: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    let followingUserIdStr = app.globalData.woowoUserInfo.like_user;

    if (followingUserIdStr.length > 0) {
      that.requestMyFollowingList(followingUserIdStr);
    }
    else {
      data.ifNothing = true;

      that.setData(data);
    }
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

  requestMyFollowingList: function (userIds) {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestUsersById(userIds)
    .then(res => {
      data.ifLoading = false;

      if (res.code == 0) {
        data.userInfoList = res.data;
        
        console.log(data.userInfoList);
        data.ifReachBottom = true;
      }
      else {
        data.ifNothing = true;

        wx.showToast({
          title: '出错了，请稍后再试~',
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
  }
})