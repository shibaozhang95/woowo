const app = getApp();
const qrCodeCreater = require('../../utils/qrCodeCreater');
// pages/afterPost/afterPost.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoHouse: {},
    woowoUserInfo: {},
    ifShowShareImage: false,

    canvasId: 'imageCanvas',
    imageUrl: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoHouse = app.globalData.woowoHouseDraft.formatToShowingData();
    data.woowoUserInfo = app.globalData.woowoUserInfo;

    wx.showLoading({
      title: '生成中',
      mask: true
    })

    qrCodeCreater.createSharingImage(data.canvasId, that, data.woowoHouse, data.woowoUserInfo)
    .then(res => {
      that.setData({
        imageUrl: res.imageUrl
      })

      wx.hideLoading();

      wx.showToast({
        title: '生成成功',
        success: function() {
          setTimeout(() => {
            wx.hideToast()
          }, 2000)
        }
      })
    })

    // remove one the create a house successfully

    wx.removeStorage({
      key: 'woowoHouseDraft',
      success(res) {
        console.log('deleting woowo house locally succeed');
      }
    });  

    let pages = getCurrentPages();
    
    let indexPage = pages[pages.length - 2];

    indexPage.setData({
      'backFrom': 'posted'
    })
    
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
    // delete locally
    
    app.globalData.woowoHouseDraft = {};
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
    let that = this;
    let data = that.data;

    return {
      title: "我在Woowo发布了好房 "+ data.woowoHouse.houseTitle + " 快来买吧！",
      path: '/pages/index/index?houseId=' + data.woowoHouse.houseId
    }
  },

  createTest: function () {
    let that = this;

    that.setData({
      ifShowShareImage: !that.data.ifShowShareImage
    })
  },

  createImageDone: function (event) {
    let that = this;
    let data = that.data;

    data.imageUrl = event.detail.data;

    that.setData(data);
  },

  saveToLocal: function () {
    let that = this;
    let data = that.data;

    if (!data.imageUrl) return;

    wx.saveImageToPhotosAlbum({
      filePath: data.imageUrl,
      success(res) {
        console.log(res);
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，快去分享吧~',
          showCancel: false,
          confirmText: '确认',
          // confirmColor:'#2C3E50',
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      }

    })
  },

  goToHouseDetail: function () {
    let that = this;

    let url = '../houseDetail/houseDetail?houseId=' + app.globalData.woowoHouseDraft.houseId

    app.globalData.woowoHouseTemp = app.globalData.woowoHouseDraft;

    wx.navigateTo({
      url: url
    })

  },

  goToIndex: function () {
    // wx.switchTab({
    //   url: '../index/index'
    // })
    wx.navigateBack({
      delta: 1
    });
  },

  copyText: function (event) {
    let copyContent = event.currentTarget.dataset.copyText;

    if (!copyContent) return;

    wx.setClipboardData({
      data: copyContent
    })
  }
})