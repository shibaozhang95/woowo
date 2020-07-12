const app = getApp();
import WoowoHousemate from '../../utils/woowoHousemate';
const util = require('../../utils/util');

// pages/housemateDetail/housemateDetail.js
Page({

  /**
   * Page initial data
   */
  data: {
    bottomGapHeight: 0,
    functionBarHeight: 50,

    imageUrls: ['','',''],

    contactInfo: {
      contactPhone: '',
      contactWechat: '',
      contactWechatCodeUrl: ''
    },

    ifSentMessage: false,

    woowoHousemate: {},
    woowoUserInfo: {},
    housemateInfo: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;

    data.bottomGapHeight = app.globalData.bottomGapHeight;

    // from card
    if (options.from == 'card') {
      data.woowoHousemate = app.globalData.woowoHousemateTemp;
      data.housemateInfo = data.woowoHousemate.formatToShowingData();

      // contact information
      this.formatContactInfo();
    }
    else if (options.housemateId) {
      this.requestForHousemate(options.housemateId);
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
    let that = this;
    let data = that.data;

    console.log(data.woowoHousemate.id);
    return {
      title: "我在Woowo看到求租，快来看看呀~",
      path: '/pages/index/index?housemateId=' + data.woowoHousemate.id
    }
  },

  requestForHousemate: function (housemateId) {
    let that = this;
    let data = that.data;

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    util.requestHousematesByIds([housemateId].join(','))
    .then(res => {
      wx.hideLoading();

      if (res.code == 0) {
        data.woowoHousemate = new WoowoHousemate();
        data.woowoHousemate.formatDataFromServer(res.data[0]);
        data.housemateInfo = data.woowoHousemate.formatToShowingData();

        this.formatContactInfo();
      }
      else {
        wx.showToast({
          title: '出错了，请稍后再试！',
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

  formatContactInfo: function () {
    let that = this;
    let data = that.data;

    data.contactInfo = {
      contactPhone: data.woowoHousemate.phone,
      contactWechat: data.woowoHousemate.wx_id,
      contactWechatCodeUrl: data.woowoHousemate.wx_qr
    }

    that.setData(data);
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
  },

  callThePoster: function () {
    let that = this;
    let data = that.dat;

    wx.makePhoneCall({
      phoneNumber: data.contactInfo.contactPhone,
      success: function() {
        console.log('call successfully')
      }
    })
  },

  sendMessageTo: function () {
    let that = this;
    let data = that.data;

    let targetUserInfo = data.woowoHousemate.userInfo;

    if (data.woowoUserInfo.user_id == targetUserInfo.user_id) {
      wx.showToast({
        title: '您不能私信您自己呀！',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 2000)
        }
      })
      
      return;
    }
    data.ifSentMessage = true;

    console.log('contact');

    wx.navigateTo({
      url: '/pages/chat/chat?targetUserInfo=' + JSON.stringify(targetUserInfo)
    })

    that.setData(data);
  }
})