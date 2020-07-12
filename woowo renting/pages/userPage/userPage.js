const app = getApp();
const util = require('../../utils/util');
// pages/userPage/userPage.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoUserInfo: {},
    targetUserInfo: {},
    ifSelf: false,
    navTitle: 'woowo 租房',
    ifFollowingHouseHolder: false,

    containerTopPos: 0,
    
    houseInfoList: [],
    ifLoading: false,
    ifNothing: false,
    ifReachBottom: false,

    onShelfCount: 0,

    housemateInfoList: [],
    ifHmLoading: false,
    ifHmNothing: false,
    ifHmReachBottom: false,

    ifFirstRequestHousemate: true,

    // nav
    currentContentId: 0,
    // layout 
    windowHeight: Number,
    navHeight: Number,
    insideNavHeight: Number,
    selfPersonalInfoHeight: Number,
    shelfCountHeight: Number,
    othersPersonalInfoHeight: Number
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;

    data.targetUserInfo = JSON.parse(options.targetUserInfo);
    console.log(data.targetUserInfo);

    if (data.woowoUserInfo.user_id == data.targetUserInfo.user_id) {
      data.ifSelf = true;
      data.navTitle = '我的主页'
    }
    else {
      data.ifSelf = false;
      data.navTitle = data.targetUserInfo.username + '的主页';
    }

    if (!data.ifSelf) {
      data.ifFollowingHouseHolder = data.woowoUserInfo
        .checkIfFollowingUser(data.targetUserInfo.user_id);
    }
    
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    data.containerTop = 0;
    if (ifCustomNavigation) {
      data.containerTopPos = app.globalData.defaultNavBarHeigh + app.globalData.statusBarHeigh;
    }

    // layout
    data.windowHeight = app.globalData.windowHeight;
    data.navHeight = app.globalData.navHeight;

    data.insideNavHeight = 35;
    data.selfPersonalInfoHeight = 115 + data.insideNavHeight;
    data.shelfCountHeight = 30;
    data.othersPersonalInfoHeight = 110 + data.insideNavHeight;

    that.setData(data);

    that.requestUserPost(data.targetUserInfo.user_id);
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

    // update following status
    if (!data.ifSelf) {
      data.ifFollowingHouseHolder = data.woowoUserInfo
        .checkIfFollowingUser(data.targetUserInfo.user_id);
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

  requestUserPost: function (userId) {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestHousesByUserId(userId)
    .then(res => {
      console.log(res);

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
        that.setData(data);
        
      }

      else {
        data.ifNothing = true;
        that.setData(data);
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

      
    })
  },

  switchFollowingStatus: function () {
    let that = this;
    let data = that.data;

    let selfUserId = data.woowoUserInfo.user_id;
    let targetUserId = data.targetUserInfo.user_id;

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

      console.log(data.housemateInfoList);
      that.setData(data);
    })
  },

  firstRequestLikedHousemate: function () {
    let that = this;
    let data = that.data;

    let uniondId = data.woowoUserInfo.wx_unionid;

    that.requestHousemate(uniondId);
  }
})