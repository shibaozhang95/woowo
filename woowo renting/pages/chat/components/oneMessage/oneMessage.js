// oneMessage.js
Component({
  /**
   * Component properties
   */
  properties: {
    messageItem: {
      type: Object,
      value: {}
    },
    userInfo: {
      type: Object,
      value: {}
    },
    ifOwn: {
      type: Boolean,
      value: false
    },
    
  },

  /**
   * Component initial data
   */
  data: {
    showingMsgDate: '',
    ifShowFailedBtnBlock: false
  },

  ready: function () {
    let that = this;

    let showingMsgDate = new Date(that.data.messageItem.msgDate);
    let msgDateStr = showingMsgDate.toLocaleString();

    that.setData({
      showingMsgDate: msgDateStr
    })
  },

  /**
   * Component methods
   */
  methods: {
    resendMessage: function () {
      let that = this;

      that.triggerEvent('resendMessage', {
        message: that.data.messageItem
      })
    },

    deleteMessage: function () {
      let that = this;

      that.triggerEvent('deleteMessage', {
        message: that.data.messageItem
      })
    },

    showFailedBtnBlock: function () {
      let that = this;

      that.setData({
        ifShowFailedBtnBlock: true
      })
    },

    previewImages: function (event) {
      let that = this;
  
      let imgs = event.currentTarget.dataset.imgs;
      let currentImg = event.currentTarget.dataset.currentImg;
  
      wx.previewImage({
        current: currentImg,
        urls: imgs
      })
    }
  },

  
})
