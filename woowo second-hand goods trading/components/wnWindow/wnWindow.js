const app = getApp();

// wnWindow.js
Component({
  /**
   * Component properties
   */
  properties: {
    ifShowTabBar: {
      type: Boolean,
      value: false
    },
    currentTopPos: {
      type: Number,
      value: 0,
      observer (newVal, oldVal) {
        let that = this;

        that.setData({
          currentTopPosition: newVal
        })

      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    screenHeight: Number,
    screenWidth: Number,

    windowHeight: Number,

    navBarHeight: Number,
    tabBarHeight: Number,

    scrollHeight: {
      type: Number,
      value: 0
    },

    currentTopPosition: 0,
    // currentTopPos: {
    //   type: Number,
    //   value: 0
    // },

    scrollToThere: String
  },

  /**
   * Component methods
   */
  methods: {
    // _onScrollToUpper: function() {
    //   let that = this;

    //   let timeInverval = setInterval(() => {
    //     if (that.data.currentTopPos > -5) {
    //       clearInterval(timeInverval);
    //       that.triggerEvent('wnScrollToUpper', {});
    //     }
    //   }, 1)
    // },

    // _onScrollToLower: function () {
    //   let that = this;

    //   that.triggerEvent('wnScrollToLower', {})
    // },

    // _onScroll: function (event) {

    //   let that = this;

    //   that.setData({
    //     currentTopPos: event.detail.scrollTop,
    //     scrollHeight: event.detail.scrollHeight
    //   })
    // },

    _onGoToTop: function () {
      let that = this;

      // that.setData({
      //   scrollToThere: 'top'
      // })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }

  },

  ready: function () {
    let that = this;

    let screenHeight = app.globalData.screenHeight;
    let screenWidth = app.globalData.screenWidth;
    let navBarHeight = app.globalData.statusBarHeight + app.globalData.defaultNavBarHeight;
    let tabBarHeight = app.globalData.wnTabBarHeight + app.globalData.bottomGapHeight;

    let windowHeight = screenHeight - navBarHeight;
    if (that.data.ifShowTabBar) {
      windowHeight -= tabBarHeight;
    }

    that.setData({
      screenHeight: screenHeight,
      screenWidth: screenWidth,
      navBarHeight: navBarHeight,
      tabBarHeight: tabBarHeight,
      windowHeight: windowHeight
    })
  }
})
