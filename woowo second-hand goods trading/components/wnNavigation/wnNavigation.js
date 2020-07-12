const app = getApp();

// wnNavigation.js
Component({
  /**
   * Component properties
   */
  properties: {
    navTitle: {
      type: String,
      value: 'Woowo 二手市场'
    },

    ifCustom: {
      type: Boolean,
      value: false
    },

    ifTabPage: {
      type: Boolean,
      value: false
    },

    navBgColor: {
      type: String,
      value: 'rgb(246, 182, 45)'
    }
  },

  /**
   * Component initial data
   */
  data: {
    containerHeight: Number,
    windowWidth: Number,
    statusBarHeight: Number,
    navBarHeight: Number
  },

  /**
   * Component methods
   */
  methods: {
    goBackPreviousPage: function () {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  ready: function () {
    let that = this;

    that.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.defaultNavBarHeight,
      windowWidth: app.globalData.windowWidth
    })
  }
})
