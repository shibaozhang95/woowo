const util = require('../../utils/util');
const qrCodeCreater = require('../../utils/qrCodeCreater');

const SCALE = 2;

// components/shareImage/shareImage.js
Component({
  /**
   * Component properties
   */
  properties: {
    ifHidden: {
      type: Boolean,
      value: false
    },

    houseInfo: {
      type: Object,
      value: {}
    },

    userInfo: {
      type: Object,
      value: {}
    },

    ifShowShareImage: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        let that = this;

        // do not request again
        if (that.data.imageUrl.length != 0) return;

        if (newVal == true) {
          wx.showLoading({
            title: '生成中...',
            mask: true
          })

          qrCodeCreater.createSharingImage(that.data.canvasId, that
            , that.data.houseInfo, that.data.userInfo)
          .then(res => {
            that.setData({
              imageUrl: res.imageUrl
            })

            that.triggerEvent('createimagedone', {
              data: res.imageUrl
            })

            wx.hideLoading();

            wx.showToast({
              title: '生成成功',
              success: function() {
                setTimeout(() => {
                  wx.hideToast()
                }, 2000)
              }
            })
          })
        }
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    canvasId: 'imageCanvas',
    imageUrl: ""
  },

  /**
   * Component methods
   */
  methods: {
    saveShareImage : function () {
      let that = this;

      wx.saveImageToPhotosAlbum({
        filePath: that.data.imageUrl,
        success(res) {
          console.log(res);
          wx.showModal({
            title: '存图成功',
            content: '图片成功保存到相册了，快去分享吧~',
            showCancel: false,
            confirmText: '确认',
            // confirmColor:'#2C3E50',
            success: function(res) {
              if (res.confirm) {
                  that.triggerEvent('completeshare', {success: true})
              }
            }
          })
        }

      })
    },

    cancelShareImage: function () {
      let that = this;

      that.triggerEvent('cancelshare', {})
    },
  },
})
