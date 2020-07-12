const app = getApp();
const eviltransform = require('../../utils/transform');

// pages/maps/maps.js
Page({

  /**
   * Page initial data
   */
  data: {
    longitude: Number,
    latitude: Number,
    sacle: Number,
    markers: [],

    mapsHeight: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    let windowHeight = app.globalData.windowHeight;
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    let defaultNavBarHeight = app.globalData.defaultNavBarHeight;
    let statusBarHeight = app.globalData.statusBarHeight;

    data.mapsHeight = windowHeight;
    if (ifCustomNavigation) {
      data.mapsHeight -= (defaultNavBarHeight + statusBarHeight)
    }

    console.log(options);
    let latlng = options.latlng;

    let wgsLat = Number(latlng.split(',')[0]);
    let wgsLng = Number(latlng.split(',')[1]);

    let result = eviltransform.wgs2gcj(wgsLat, wgsLng);
    console.log(latlng);
    console.log(result);

    data.latitude = result.lat;
    data.longitude = result.lng;

    data.markers = [{
      latitude: result.lat,
      longitude: result.lng
    }]

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

  }
})