// components/contactInfo/contactInfo.js
Component({
  /**
   * Component properties
   */
  properties: {
    contactInfoTitle: {
      type: String,
      value: '联系方式'
    },
    woowoHouse: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    contactSlideAnimation: {},
    contactBtnAnimation: {},
  },

  /**
   * Component methods
   */
  methods: {
    touchCopy: function (event) {
      let copyContent = event.currentTarget.dataset.content;
  
      if (!copyContent) return;
  
      wx.setClipboardData({
        data: copyContent
      })
    },

    showOrOffContact: function (event) {
      let that = this;
      let data = that.data;
  
      console.log(event);
      let ifShow = event.currentTarget.dataset.ifShow;
  
  
      let height = 0;
      let opacity = 1;
  
      if (ifShow) {
        // 212 is the height of QR Code
        height = 127 + (data.woowoHouse.contactWechatCodeUrl ? 212 : 0);
        opacity = 0;
      }
  
      that.triggerContactSlideAnimation(height);
      that.triggerContactBtnAnimation(opacity);
    },
  
    triggerContactSlideAnimation: function (height) {
      let that = this;
  
      if (height == 0) {
        that.contactSlideAnimation.opacity(0).step({
          duration: 50
        }).height(height*2 + 'rpx').step({
          duration: 200
        });
      }
      else {
        that.contactSlideAnimation.height(height*2 + 'rpx').step({
          duration: 200
        }).opacity(1).step({
          duration: 50
        });
      }
      
  
      that.setData({
        contactSlideAnimation: that.contactSlideAnimation.export()
      })
    },
  
    triggerContactBtnAnimation: function (opacity) {
      let that = this;
  
      that.contactBtnAnimation.opacity(opacity).step();
  
      that.setData({
        contactBtnAnimation: that.contactBtnAnimation.export()
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

  ready: function () {
    let that = this;
    let data = that.data;

    console.log(data.woowoHouse)
    // for animation 
    that.contactSlideAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    });
    that.contactBtnAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    });
  }
})
