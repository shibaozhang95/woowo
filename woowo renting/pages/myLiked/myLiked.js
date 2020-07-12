const app = getApp();
const util = require('../../utils/util');

// pages/myLiked/myLiked.js
Page({

  /**
   * Page initial data
   */
  data: {
    houseInfoList: [],
    ifLoading: false,
    ifNothing: false,
    ifReachBottom: false,

    housemateInfoList: [],
    ifHmLoading: false,
    ifHmNothing: false,
    ifHmReachBottom: false,

    ifHousingListChosen: true,
    ifHousemateListChosen: false,

    ifFirstRequestHousemate: true,

    currentContentId: 0,

    windowHeight: Number,
    navHeight: Number
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.windowHeight = app.globalData.windowHeight;
    data.navHeight = app.globalData.navHeight;

    let houseIdStr = app.globalData.woowoUserInfo.liked;

    if (houseIdStr.length > 0) {
      that.requestMyLikedList(houseIdStr);
    }
    else {
      data.ifNothing = true;
    }

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

  requestMyLikedList: function (houseIdStr) {
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
  },

  requestMyLikedHousemate: function (housemateIdStr) {
    let that = this;
    let data = that.data;

    data.ifHmLoading = true;
    that.setData(data);

    util.requestHousematesByIds(housemateIdStr)
    .then(res => {
      data.ifHmLoading = false;

      if (res.code == 0) {
        data.housemateInfoList = res.data;

        if (data.housemateInfoList.length != 0) {
          data.ifHmReachBottom = true;
        }
        else {
          data.ifHmNothing = true;
        }
      }
      else {
        data.ifHmNothing = true;

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
  },

  switchLikedContent: function (event) {
    let tid = event.currentTarget.dataset.tid;
    let that = this;
    let data = that.data;

    if (data.currentContentId == tid) return;

    data.currentContentId = tid;

    if (data.currentContentId == 1 && data.ifFirstRequestHousemate) {
      that.firstRequestLikedHousemate();
    }

    that.setData(data);
  },

  swipeLikedContent: function (event) {
    let cid = event.detail.current;
    let that = this;
    let data = that.data;

    if (cid == data.currentContentId) return;

    data.currentContentId = cid;

    if (data.currentContentId == 1 && data.ifFirstRequestHousemate) {
      that.firstRequestLikedHousemate();
    }

    that.setData(data);
  },

  firstRequestLikedHousemate: function () {
    let that = this;
    let data = that.data;

    data.ifFirstRequestHousemate = false;

    let housemateIdStr = app.globalData.woowoUserInfo.like_post;

    if (housemateIdStr) {
      that.requestMyLikedHousemate(housemateIdStr);
    }
    else {
      data.ifHmNothing = true;
    }
  }
})