const app = getApp();

// wnNavigation.js
Component({
  /**
   * Component properties
   */
  properties: {
    navTitle: {
      type: String,
      value: 'Woowo二手市场'
    },

    ifCustom: {
      type: Boolean,
      value: false
    },

    ifTabPage: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    containerHeight: Number,
    windowWidth: Number,
    statusBarHeight: Number,
    navBarHeight: Number,
    navBackgroundColor: 'rgb(86, 182, 213)',
    navTitleColor: 'rgb(255, 255, 255)'
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
      windowWidth: app.globalData.windowWidth,

      navBackgroundColor: app.globalData.navigationBarBackgroundColor,
      navTitleColor: app.globalData.navigationTitleColor
    })
  }
})
