const app = getApp();

// components/phoneVerification/phoneVerification.js
Component({
  /**
   * Component properties
   */
  properties: {
    ifShowError: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    containerWidth: 0,
    containerHeight: 0,
    containerTopPos: 0,
    phoneVeriCode: ''
  },

  ready: function () {
    let that = this;
    let data = that.data;

    let windowWidth = app.globalData.windowWidth;
    let windowHeight = app.globalData.windowHeight;
    let statusBarHeight = app.globalData.statusBarHeight;
    let defaultNavBarHeight = app.globalData.defaultNavBarHeight;

    let ifCustomNavigation = app.ifCustomNavigation;

    data.containerHeight = windowHeight;
    data.containerWidth = windowWidth;
    data.containerTopPos = 0;

    if (ifCustomNavigation == true) {
      data.containerTopPos = statusBarHeight + defaultNavBarHeight;
      data.containerHeight =  data.containerHeight - data.containerTopPos;
    }

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    phoneVeriCodeInput: function (event) {
      let that = this;

      let value = event.detail.value;

      that.setData({
        phoneVeriCode: value
      })
    },

    verificationConfirm: function () {
      let that = this;

      let code = that.data.phoneVeriCode;

      that.triggerEvent('verificationconfirm', {
        value: code
      })
    },

    verificationCancel: function () {
      let that = this;

      that.triggerEvent('verificationcancel')
    }
  }
})
