import WoowoHouse from '../../utils/woowoHouse';
const app = getApp();
const util = require('../../utils/util');

// pages/houseDetail/houseDetail.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoUserInfo: {},
    woowoHouse: {},    // this woowoHouse is only showing data
    imagesUrsLs: [],

    ifSelfHouse: false,
    ifFollowingHouseHolder: false,
    ifNotGoFurther: false,

    ifShowShareImage: false,
    ifShared: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    console.log(options);

    data.ifNotGoFurther = options.ifNotGoFurther ? true : false;
    
    if (options.from == 'aptcard') {
      data.woowoHouse = new WoowoHouse(app.globalData.woowoHouseTemp).formatToShowingData();
      that.initializeHouseDetailPage();
    }
    else {
      if (options.houseId) {

        wx.showLoading({
          title: '加载中...',
          mask: true
        })

        util.requestHousesByIds(options.houseId)
        .then(res => {
          wx.hideLoading();

          console.log(res);
          if (res.code == 0) {

            console.log(res.data[0]);

            data.woowoHouse = new WoowoHouse(res.data[0]).formatToShowingData();

            console.log(data.woowoHouse);
            that.initializeHouseDetailPage();
          }
        })

      }
      else {
        wx.showToast({
          title: '出错啦！',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },

  initializeHouseDetailPage: function () {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;
    data.ifSelfHouse = data.woowoUserInfo.user_id == data.woowoHouse.houseHolderInfo.user_id;
    if (!data.ifSelfHouse) {
      data.ifFollowingHouseHolder = data.woowoUserInfo
        .checkIfFollowingUser(data.woowoHouse.houseHolderInfo.user_id)
    }


    if (data.woowoHouse.houseId) {
      // add count remotely
      that.addingViewCount(data.woowoHouse.houseId);
      // add count locally
      ++data.woowoHouse.view;

      // add view history
      app.globalData.woowoViewHistory.updateViewHistoryWithNewId(data.woowoHouse.houseId);
      app.globalData.woowoViewHistory.updateViewHistoryLocally();

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
    let that = this;
    let data = that.data;

    return {
      title: "我在Woowo看到好房 "+ data.woowoHouse.houseTitle + " 快来看看吧！",
      path: '/pages/index/index?houseId=' + data.woowoHouse.houseId
    }
  },

  goToUserPage: function () {
    let that = this;
    let data = that.data;

    if (data.ifNotGoFurther == true) {
      wx.navigateBack({
        delta: 1
      });
    }

    else {
      wx.navigateTo({
        url: '../userPage/userPage?targetUserInfo=' + JSON.stringify(data.woowoHouse.houseHolderInfo)
      })
    }
  },

  switchFollowingStatus: function () {
    let that = this;
    let data = that.data;

    let selfUserId = data.woowoUserInfo.user_id;
    let targetUserId = data.woowoHouse.houseHolderInfo.user_id;

    let prevFollowingStatus = data.ifFollowingHouseHolder;

    let loadingText = prevFollowingStatus ? '取消关注中...' : '关注中';
    
    wx.showLoading({
      title: loadingText,
      mask: true
    });

    util.requestUpdateFollowingUser(selfUserId, targetUserId)
    .then(res => {

      wx.hideLoading();

      if (res.code == 0) {
        data.ifFollowingHouseHolder = !prevFollowingStatus;
        
        let status = data.ifFollowingHouseHolder ? 'follow' : 'unfollow';

        data.woowoUserInfo.changeFollowingStatus(status, targetUserId);

        that.setData(data);

        // store locally
        util.updateWoowoUserLocally(data.woowoUserInfo);
      }
      else {
        wx.showToast({
          title: '出错啦，请稍后再试',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }
    })
  },

  goToHaveAChat: function () {
    let that = this;
    let data = that.data;

    let targetUserInfo = data.woowoHouse.houseHolderInfo;
    console.log(targetUserInfo);

    wx.navigateTo({
      url: '../chat/chat?targetUserInfo=' + JSON.stringify(targetUserInfo)
    })
  },

  goToAllIcons: function () {
    let that = this;
    let data = that.data;

    wx.navigateTo({
      url: 'pages/allFacilities/allFacilities?allIcons=' 
        + JSON.stringify(data.woowoHouse.allIcons)
    })
  },

  goToMaps: function (event) {
    let latlng = event.currentTarget.dataset.latlng;

    wx.navigateTo({
      url: '../maps/maps?latlng=' + latlng
    })
  },

  addingViewCount: function (houseId) {
    util.requestAddingViewCount(houseId).then(res => {
      if (res.code == 0) {
        console.log('adding new count for this house successfully')
      }
    })
  },

  updateLikingStatus: function (event) {
    let that = this;
    let data = that.data;

    let action = event.detail.data;

    if (action == 'like') ++data.woowoHouse.liked;
    else if (action == 'unlike') --data.woowoHouse.liked;

    that.setData(data);
  },

  triggerOnShare: function () {
    let that = this;
    let data = that.data;

    data.ifShowShareImage = true;

    that.setData(data);
  },

  cancelShare: function () {
    let that = this;

    that.setData({
      ifShowShareImage: false
    })
  },

  createImageDone: function (event) {
    console.log(event);
  },

  completeShare: function () {
    let that = this;

    that.setData({
      ifShared: true,
      ifShowShareImage: false
    })
  },

  callHouseholder: function () {
    let that = this;
    let data = that.data;

    wx.makePhoneCall({
      phoneNumber: data.woowoHouse.contactPhone,
      success: function() {
        console.log('call successfully')
      }
    })
  },

  previewImages: function (event) {
    let imgs = event.currentTarget.dataset.imgs;
    let currentImg = event.currentTarget.dataset.currentImg;
    console.log(imgs);
    console.log(currentImg)

    wx.previewImage({
      current: currentImg,
      urls: imgs
    })
  }
})