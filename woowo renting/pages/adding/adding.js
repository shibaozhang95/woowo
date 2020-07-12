const app = getApp();
const util = require('../../utils/util');
import WoowoHouse from '../../utils/woowoHouse';
import WoowoHousemate from '../../utils/woowoHousemate';

// adding.js
Page({

  /**
   * Page initial data
   */
  data: {
    navListHouse: [{
      iconUrl: '/statics/images/icon_menu_rent.png',
      navUrl: '/pages/post/post?type=整租',
      title: '发布整租房源',
      // type: 'take',
      rentType: '整租'
    }, {
      iconUrl: '/statics/images/icon_menu_share_rent.png',
      navUrl: '/pages/post/post?type=合租',
      title: '发布合租房源',
      // type: 'share',
      rentType: '合租',
    }, {
      iconUrl: '/statics/images/icon_menu_short_rent.png',
      navUrl: '/pages/post/post?type=短租',
      title: '发布短租房源',
      // type: 'short',
      rentType: '短租',
    }],

    navListHousemate: [{
      iconUrl: '/statics/images/icon_menu_find_housemate.png',
      navUrl: '/pages/postHousemate1/postHousemate1',
      title: '发布求租信息',
      rentType: '求租'
    }],

    woowoUserInfo: {},
    backFrom: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;

    let woowoHouseDraft = that.getWoowoHouseDraftLocally();

    if (woowoHouseDraft.ifExist == true) {
      wx.showModal({
        title: '提示',
        content: '是否继续填写上次未完成的发布信息？',
        cancelText: '重新填写',
        confirmText: '继续填写',
        success: (res) => {
          // clicked sure
          if (res.confirm == true) {
            app.globalData.woowoHouseDraft = new WoowoHouse(woowoHouseDraft.value);
            that.goToPost();
          }
          // cilicker cancel
          else if (res.cancel == true) {
            that.deleteWoowoHouseDraft(woowoHouseDraft.value, data.woowoUserInfo);
          }
          // didn't choose anything
          else {

          }
        },
        fail: () => {
          wx.showToast({
            title: '出错啦，稍后再试~',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
      })
    }
    else {
      console.log('No localy house draft')
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

  getWoowoHouseDraftLocally: function () {
    let value = wx.getStorageSync('woowoHouseDraft');
    if (value) {
      return {
        ifExist: true,
        value: value
      }
    }

    return {
      ifExist: false
    }
  },


  deleteWoowoHouseDraft: function (woowoHouseInfo, woowoUserInfo) {
    // delete remotely
    util.requestDeleteAHouse(woowoHouseInfo.houseId, woowoUserInfo.user_id)
    .then(res => {
      if (res.code == 0) {
        console.log('deleting woowo house remotely succeed')
      }
    })  
    // delete locally
    wx.removeStorage({
      key: 'woowoHouseDraft',
      success(res) {
        console.log('deleting woowo house locally succeed');
      }
    });  
  },

  chooseOneRentType: function (event) {
    let that = this;
    let data = that.data;

    let rentType = event.currentTarget.dataset.type;

    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    that.createANewHouseId(rentType, that.data.woowoUserInfo)
    .then(res => {
      wx.hideLoading();

      if (res.code == 0 && res.data) {
        app.globalData.woowoHouseDraft = new WoowoHouse({
          id: res.data,
          type: rentType
        })

        that.goToPost(rentType);
      }

      else if (res.code == 1) {
        let tips = '您最多可同时在架 ' + res.data + ' 个房源，超出发布限制了！'
        wx.showToast({
          title: tips,
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 4000)
          }
        })
      }
      
      else {
        wx.showToast({
          title: '出错了，请稍后再试。',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }

    });
  },

  createANewHouseId: function (type, woowoUserInfo) {

    return new Promise((resolve, reject) => {
      
      util.requestCreateAHouseId(woowoUserInfo, type)
      .then(res => {
        resolve(res);
      })
    })
    
  },

  goToPost: function (type) {

    wx.redirectTo({
      url: '../post/post?type=' + type
    })
  },

  goToPostHousemate: function (event) {
    let navUrl = event.currentTarget.dataset.navUrl;

    let woowoUserInfo = app.globalData.woowoUserInfo;

    let housemate = new WoowoHousemate();
    housemate.updateWithFieldName('wx_unionid', woowoUserInfo.wx_unionid);
    housemate.updateWithFieldName('userInfo', {
      user_id: woowoUserInfo.user_id,
      username: woowoUserInfo.username,
      user_image: woowoUserInfo.user_image,
      wx_unionid: woowoUserInfo.wx_unionid
    })
    
    app.globalData.woowoHousemateDraft = housemate;
    
    wx.navigateTo({
      url: navUrl
    })
  }
})