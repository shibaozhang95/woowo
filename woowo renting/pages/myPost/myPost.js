const app = getApp();
const util = require('../../utils/util');

// pages/myPost/myPost.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoUserInfo: {},
    containerTopPos: 0,
    houseInfoList: [],

    onShelfCount: 0,

    ifLoading: false,
    ifNothing: false,
    ifReachBottom: false,

    housemateInfoList: [],
    ifHmLoading: false,
    ifHmNothing: false,
    ifHmReachBottom: false,

    onShelfCountHm: 0,
    ifFirstRequestHousemate: true,

    // nav
    currentContentId: 0,

    // layout 
    windowHeight: Number,
    navHeight: Number,
    totalNavHeight: Number,

    ifReload: false,
    ifReloadHousemate: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;
    
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    data.containerTop = 0;
    if (ifCustomNavigation) {
      data.containerTopPos = app.globalData.defaultNavBarHeigh + app.globalData.statusBarHeigh;
    }

    // layout
    data.windowHeight = app.globalData.windowHeight;
    data.navHeight = app.globalData.navHeight;

    data.totalNavHeight = data.navHeight + 145 + 35;

    that.setData(data);

    // first request
    that.requestMyPost();
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
    let that = this;
    let data = that.data;

    if (data.ifReload) {
      data.houseInfoList = [];
      data.ifReload = false;

      // reload this page
      that.requestMyPost();
    }
    else if (data.ifReloadHousemate) {
      data.housemateInfoList = [];
      data.ifReloadHousemate = false;

      // only reload housemate
      that.requestHousemate(data.woowoUserInfo.wx_unionid);
    }
    that.setData(data);
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

  requestMyPost: function () {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestHousesByUserId(data.woowoUserInfo.user_id)
    .then(res => {
      data.ifLoading = false;
      if (res.code == 0) {
        data.houseInfoList = res.data;
        if (data.houseInfoList.length == 0) {
          data.ifNothing = true;
        }
        else {
          data.ifReachBottom = true
        }

        that.countingShelf(data.houseInfoList);
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

  countingShelf: function(houseList) {
    let that = this;
    let data = that.data;

    data.onShelfCount = 0;

    for (let i = 0, len = houseList.length; i < len; ++i) {
      if (houseList[i].status == 'postedChecked') {
        ++data.onShelfCount;
      }
    }

    that.setData(data);
  },

  shelfChanged: function (event) {
    let that = this;
    let data = that.data;

    let houseId = event.detail.houseId;
    let newStatus = event.detail.newStatus;
    
    for (let i = 0, len = data.houseInfoList.length; i < len; ++i) {
      if (houseId == data.houseInfoList[i].id 
        || houseId == data.houseInfoList[i].houseId) {
          
        data.houseInfoList[i].status = newStatus;
        
        if (newStatus == 'deleted') {
          data.houseInfoList.splice(i, 1);
        }
        break;
      }
    }

    that.countingShelf(data.houseInfoList);
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

  requestHousemate: function (uniondId) {
    let that = this;
    let data = that.data;

    data.ifHmLoading = true;
    that.setData(data);

    util.requestHousemateByUnionid(uniondId).then(res => {
      data.ifHmLoading = false;

      if (res.code == 0) {
        data.housemateInfoList = res.data;
        data.onShelfCountHm = res.data.length;
        
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

  firstRequestLikedHousemate: function () {
    let that = this;
    let data = that.data;

    let uniondId = data.woowoUserInfo.wx_unionid;

    that.requestHousemate(uniondId);
  },

  deleteAHousemate: function (event) {
    let that = this;
    let data = that.data;

    let targetId = event.detail.deleteId;

    for (let i = 0, len = data.housemateInfoList.length; i < len; ++i) {
      if (targetId == data.housemateInfoList[i].id) {
        data.housemateInfoList.splice(i, 1);
        break;
      }
    }

    data.onShelfCountHm = data.housemateInfoList.length;

    if (data.housemateInfoList.length == 0) {
      data.ifHmReachBottom = false;
      data.ifHmNothing = true;
    }

    that.setData(data);
  }
})