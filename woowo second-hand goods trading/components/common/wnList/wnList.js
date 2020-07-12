// components/common/wnList/wnList.js
Component({
  /**
   * Component properties
   */
  properties: {
    ifShowNothingMark: {
      type: Boolean,
      value: false
    },
    nothingMarkTips: {
      type: String,
      value: '空的，你懂我什么意思吧'
    },

    ifShowLoading: {
      type: Boolean,
      value: false
    },
    loadingTips: {
      type: String,
      value: '数据加载中...'
    },

    ifShowReachBottom: {
      type: Boolean,
      value: false
    },
    reachBottomTips: {
      type: String,
      value: '到底啦，坐火箭回去吧~'
    },

    extraTopBlockHeight: {
      type: Number,
      value: 0
    },
    extraBottomBlockHeight: {
      type: Number,
      value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {

  }
})
