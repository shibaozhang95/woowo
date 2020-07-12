const app = getApp();

// chatInput.js
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    screenWidth: String,
    bottomGapHeight: String,
    inputContent: ''
  },

  /**
   * Component methods
   */
  methods: {
    inputSendingMsg: function (event) {
      let that = this;

      let value = event.detail.value;
      let filteredValue = value.replace("'", "").replace('"', '').replace('`', '')
        .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
        .replace('[', '').replace(']', '');

      that.setData({
        inputContent: filteredValue
      })
    },

    inputConfirm: function (event) {
      let that = this;

      that.triggerEvent('inputconfirm', {
        message: {
          msgType: 'text',
          msgContent: event.detail.value,
          msgDate: new Date().getTime()
        }
      })
      
      // Reset input 
      that.setData({
        inputContent: ''
      })
    },

    sendPicture: function () {
      let that = this;

      wx.chooseImage({
        count: 9,
        success: (res) => {
          for (let i = 0, len = res.tempFilePaths.length; i < len; ++i) {
            ((index) => {
              that.triggerEvent('inputconfirm', {
                message: {
                  msgType: 'image',
                  msgContent: res.tempFilePaths[index],
                  msgDate: new Date().getTime()
                }
              })
            })(i)
          }
        }
      })

    }
  },

  ready: function () {
    let that = this;

    let bottomGapHeight = app.globalData.bottomGapHeight;

    that.setData({
      screenWidth: app.globalData.screenWidth,
      bottomGapHeight: bottomGapHeight ? bottomGapHeight : 0
    })
  }
})
