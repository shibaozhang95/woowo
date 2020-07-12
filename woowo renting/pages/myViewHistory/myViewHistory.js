const app = getApp();
const util = require('../../utils/util');

// pages/myViewHistory/myViewHistory.js
Page({

  /**
   * Page initial data
   */
  data: {
    houseInfoList: [],

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

    let houseIdStr = app.globalData.woowoViewHistory.getHouseIdStr();

    if (houseIdStr.length > 0) {
      that.requestViewHistoryList(houseIdStr);
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

  requestViewHistoryList: function (houseIdStr) {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestHousesByIds(houseIdStr)
    .then(res => {
      data.ifLoading = false;

      if (res.code == 0) {
        data.houseInfoList = res.data;
        
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