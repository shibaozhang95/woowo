const app = getApp();

// pages/messages/messages.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoMessages: [],
    woowoUserInfo: {},

    getMessagesInt: Object
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;


    // Request First Time
    let woowoMessages = app.globalData.woowoMessages.chats ? app.globalData.woowoMessages.chats : [];
    let woowoUserInfo = app.globalData.woowoUserInfo;

    // Request as a loop
    let getMessagesInt = setInterval(() => {
      woowoMessages = app.globalData.woowoMessages.chats ? app.globalData.woowoMessages.chats : [];

      that.setData({
        woowoMessages: woowoMessages
      })

    }, 1000);

    that.setData({
      woowoMessages: woowoMessages,
      woowoUserInfo: woowoUserInfo,
      getMessagesInt: getMessagesInt
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
    let that = this;

    clearInterval(that.data.getMessagesInt);
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

  goToChat: function (event) {
    let that = this;

    // let chatInfo = event.currentTarget.dataset.chatInfo;
    let uniqueChatId = event.currentTarget.dataset.uniqueChatId;
    let selfUserId = event.currentTarget.dataset.selfUserId;

    let userOne = event.currentTarget.dataset.userOne;
    let userTwo = event.currentTarget.dataset.userTwo;

    let targetUserInfo = {};
    if (selfUserId == userOne.user_id) {
      targetUserInfo = userTwo;
    }
    else {
      targetUserInfo = userOne;
    }

    let url = '../chat/chat?targetUserInfo=' + JSON.stringify(targetUserInfo);

    wx.navigateTo({
      url: url
    })
  }
})