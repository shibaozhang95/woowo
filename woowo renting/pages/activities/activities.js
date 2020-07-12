const util = require('../../utils/util.js');
const api = require('../../services/api.js');

Page({
  data: {
    name: "",
    phone: "",
    dateRecord: "",
    address: "",
    comment: "",
    FormData: {}
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  touchCopy: function (event) {
    console.log(event);

    wx.setClipboardData({
      data: event.currentTarget.dataset.content
    })
  },

  previewQRCode: function (event) {
    let that = this;
    console.log(event)
    let url = event.currentTarget.dataset.url;
    let imgs = [url];
  
    wx.previewImage({
      // current: event.currentTarget.dataset.current,
      urls: imgs
    })
  },
})