      //index.js
const app = getApp()
const util = require('../../utils/util');

Page({
  data: {
    currentTopPos: Number,

    monitorReachBottom: 0,   // used to load school areas apt

    backFrom: '',  // posting, posted

    ifShowLoginAuth: false,

    reLoadTrigger: 0,

    scene: null
  },

  onLoad: function (options) {
    // Use DIY tabbar
    wx.hideTabBar();

    console.log(options);

    let that = this;
    let data = that.data;

    // source analysis
    if (options.source) {
      this.sourceAnalysis(options.source);
    }
    

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);

      // For company homepage
      if (scene.includes('company')) {
        let companyId = scene.split('=')[1];

        wx.navigateTo({
          url: '../housingList/housingList?companyId=' + companyId
        })
      }

      // House 
      else {
        data.scene = scene;
      }
    }

    if (options.houseId) {
      data.scene = options.houseId;
    }

    if (app.globalData.woowoUserInfo.ifLogedin) {
      that.loginSuccess();
    }
    else {
      data.ifShowLoginAuth = true;
    }

    that.setData(data);
  },

  onShow: function () {
    let that = this;

    if (that.data.backFrom == 'posting') {
      console.log(app.globalData.woowoHouseDraft);

      wx.showModal({
        title: '提示',
        content: '是否保存，下次可以继续填写。',
        cancelText: '删除',
        confirmText: '保存',
        success: (res) => {
          if (res.confirm == true) {
            that.storeWoowoHouseDraftLocally(app.globalData.woowoHouseDraft);
          }
          else {
            that.deleteWoowoHouseDraft(app.globalData.woowoHouseDraft
              , app.globalData.woowoUserInfo);
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

    that.setData({
      backFrom: ''   // reset
    })
  },

  onReachBottom: function () {
    let that = this;

    that.setData({
      monitorReachBottom: that.data.monitorReachBottom + 1
    })
  },

  onShareAppMessage: function () {
    return {
      title: 'Woowo 租房',
      path: '/pages/index/index'
    }
  },

  onPageScroll: function (event) {
    let that = this;
    let scrollTop = event.scrollTop;

    that.setData({
      currentTopPos: scrollTop
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    let that = this;
    
    that.setData({
      reLoadTrigger: ++that.data.reLoadTrigger
    })

    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  goToAreasSearch: function () {
    wx.navigateTo({
      url: '/pages/areasSearch/areasSearch?from=index'
    })
  },

  loginSuccess: function () {
    let that = this;
    let data = that.data;

    data.ifShowLoginAuth = false;

    that.setData(data);

    if (data.scene) {
      // Housemate
      if (data.scene.includes('housemateId')) {
        let housemateId = data.scene.split('=')[1];
        console.log(housemateId);
        wx.navigateTo({
          url: '../housemateDetail/housemateDetail?housemateId=' + housemateId
        })
      }
      else {
        wx.navigateTo({
          url: '../houseDetail/houseDetail?houseId=' + data.scene
        })
      }
      
    }
  },

  refuseAuth: function () {
    let that = this;
    let data = that.data;

    console.log('AAAAAAAA')
    data.ifShowLoginAuth = false;

    that.setData(data);
  },

  storeWoowoHouseDraftLocally: function (woowoHouseInfo) {
    wx.setStorage({
      key: 'woowoHouseDraft',
      data: woowoHouseInfo,
      success: function() {
        console.log('Store woowohouse locally succeed');
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '保存失败，请稍后再试。',
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

  deleteWoowoHouseDraft: function (woowoHouseInfo, woowoUserInfo) {
    // delete remotely
    util.requestDeleteAHouse(woowoHouseInfo.houseId, woowoUserInfo)
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

  sourceAnalysis: function (source) {
    util.requestSourceAnalysis(source).then(res => {
      if (res.code == 0) {
        console.log('Source analysis succeed')
      }
      else {
        console.log('Source analysis failed')
      }
    })
  }
})
