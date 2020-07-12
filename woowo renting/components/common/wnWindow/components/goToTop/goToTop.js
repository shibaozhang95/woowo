const app = getApp();

Component({
  properties: {
    currentTopPos: Number
  },
  data: {
    "isIPX": false
  },
  methods: {
    goToTop: function () {
      // wx.pageScrollTo({
      //   scrollTop: 0,
      //   duration: 300
      // })
      let that = this;

      that.triggerEvent('goToTop', {})
    }
  },

  ready: function () {
    let that = this;

    that.setData({
      "isIPX": app.globalData.isIPX
    })
  }
})