Component({
  options: {
    multipleSlots: true
  },

  properties: {
    ifReachBottom: {
      type: Boolean,
      value: false
    },
    banReachBottom: {
      type: Boolean,
      value: false
    },
    currentTopPos: {
      type: Number,
      value: -1
    },
    nothingMarkGapSize: {
      type: String,
      value: "large"           
      // large medium small
    },
    nothingMarkTips: {
      type: String,
      value: "空的，你懂我意思吧"
    },
    listLength: {
      type: Number,
      value: 0
    }
  },

  ready: function () {
    let that = this;
    if (that.data.banReachBottom) {
      that.setData({
        ifReachBottom: true
      })
    }
  }
})