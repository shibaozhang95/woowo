Page({
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: "关于我们"
    })
  },
})