// pages/afterPostHousemate/afterPostHousemate.js
const app = getApp();
import WoowoHousemate from '../../utils/woowoHousemate';
Page({

  /**
   * Page initial data
   */
  data: {
    ifEditMode: false,
    woowoHousemate: WoowoHousemate
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.ifEditMode = options.editMode ? true : false;
    data.woowoHousemate = app.globalData.woowoHousemateDraft;
  
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
    let that = this;
    let data = that.data;

    if (data.ifEditMode) {
      wx.navigateBack({
        delta: 2
      })
    } 
    else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
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

  goToHousemateDetail: function () {
    let that = this;
    let data = that.data;

    app.globalData.woowoHousemateTemp = data.woowoHousemate;

    wx.navigateTo({
      url: '/pages/housemateDetail/housemateDetail?from=card'
    })
  },

  goToIndex: function () {
    let that = this;
    let data = that.data;

    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  copyText: function (event) {
    let copyContent = event.currentTarget.dataset.copyText;

    if (!copyContent) return;

    wx.setClipboardData({
      data: copyContent
    })
  }
})