const app = getApp();

Component({
  properties: {
    backgroundColor: {
      type: String,
      value: 'rgba(44, 62, 80, 0.3)'
    }
  },
  data: {
    windowWidth: Number,
    windowHeight: Number,
    totallNavHeight: Number,
    ifCustomNav: Boolean
  },

  methods: {
    doNothing: function () {
      // console.log('do nothing ')
      return;
    }
  },

  ready: function () {
    let that = this;

    let windowHeight = app.globalData.windowHeight;
    let windowWidth = app.globalData.windowWidth;
    let totallNavHeight = app.globalData.statusBarHeight + app.globalData.defaultNavBarHeight;
    let ifCustomNav = app.globalData.ifCustomNav;

    if (ifCustomNav) {
      windowHeight -= totallNavHeight;
    }

    that.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      totallNavHeight: totallNavHeight,
      ifCustomNav: ifCustomNav
    });
    
    console.log(that.data)
  }
})