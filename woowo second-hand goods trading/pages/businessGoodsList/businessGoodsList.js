// pages/businessGoodsList/businessGoodsList.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentTopPos: 0,

    searchKeyword: '',

    searchMode: 'goods',   // merchants or goods

    // used to trigger content list
    refreshTrigger: true,
    requestMoreTrigger: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    // request the data first time
    data.refreshTrigger = !data.refreshTrigger;

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

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    let that = this;
    let data = that.data;

    data.refreshTrigger = !data.refreshTrigger;

    that.setData(data);

    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    let that = this;
    let data = that.data;

    data.requestMoreTrigger = !data.requestMoreTrigger;

    that.setData(data);
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onPageScroll: function (event) {
    let that = this;

    that.setData({
      currentTopPos: event.scrollTop
    })
  },

  switchSearchMode: function (event) {
    let that = this;
    let data = that.data;

    let mode = event.currentTarget.dataset.searchMode;

    data.searchMode = mode;

    that.setData(data);
  },

  confirmSearchKeyword: function (event) {
    let that = this;
    let data = that.data;

    let keyword = event.detail.keyword;

    data.searchKeyword = keyword;

    that.setData(data);
  }
})