const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    sysMessages: []
  },

  onLoad: function () {
    let that = this;

    that.setData({
      sysMessages: app.globalData.notificationList
    })

    util.requestReadAllNotifications(Number(app.globalData.woowoUserInfo.user_id))
    .then(res => {
      if (res.code != 0) console.log('Read notifications failed');
      else console.log('Read all notifications successfully')
    })
    .catch(err => {
      console.log(err);
    })
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的消息',
      success: function(res) {
        // success
      }
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})