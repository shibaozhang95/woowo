const app = getApp();

Component({
  properties: {
    ifShowModal: {
      type: Boolean,
      value: false
    },
    modalInfo: {
      type: Object,
      value: {
        confirmTxt: {
          type: String,
          value: '确认'
        },
        cancelTxt: {
          type: String,
          value: '取消'
        },
        tipsTxt: {
          type: String,
          value: ""
        },
        transactionId: {
          type: String,
          value: ""
        },
        transactionType: {
          type: String,
          value: 'delete'
        }
      }
    }
  },
  data: {
    iconUrl: '../../statics/images/icon_modal_tips@2x.png',
    windowWidth: Number,
    windowHeight: Number
  },
  methods: {
    confirmOpt: function () {
      let that = this;
      that.triggerEvent('confirm', {
        transactionType: that.properties.modalInfo.transactionType,
        transactionId: that.properties.modalInfo.transactionId
      })
    },
    cancelOpt: function () {
      let that = this;
      that.triggerEvent('cancel')
    }
  },

  ready: function () {
    let that = this;
    that.setData({
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth
    });
    // console.log(app.globalData)
  }
})