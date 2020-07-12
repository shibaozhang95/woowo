const app = getApp();

// postRules.js
Page({

  /**
   * Page initial data
   */
  data: {
    fieldObj: {},
    avaliableDateStr: '',
    expireDateStr: '',

    ifAllDataPass: false, // default as false

    bottomGapHeight: Number
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    // FOR LAYOUT
    data.bottomGapHeight = app.globalData.bottomGapHeight;

    // INITIALIZE DATA
    data.fieldObj = JSON.parse(options.fieldObj);
    
    // For initial avaliabledate and expire date
    if (data.fieldObj.avaliableDate > 0) {
      let avaliableDate = new Date(data.fieldObj.avaliableDate);
      let currentDate = avaliableDate.getDate();
      let month = avaliableDate.getMonth();
      let year = avaliableDate.getFullYear();

      data.avaliableDateStr = year + '-' + (month + 1) + '-' + currentDate;
    }
    if (data.fieldObj.expireDate > 0) {
      let expireDate = new Date(data.fieldObj.expireDate);
      let currentDate = expireDate.getDate();
      let month = expireDate.getMonth();
      let year = expireDate.getFullYear();

      data.expireDateStr = year + '-' + (month + 1) + '-' + currentDate;
    }

    data.ifAllDataPass = that.rulesDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    let that = this;
    console.log('unload rules');

    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    postPage.saveEachField('rules', that.data.fieldObj);
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  pickerResultCallback: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let value = event.detail.result.value;
    let type = event.detail.result.type;
    let range = event.detail.result.range;

    let changedDate = new Date(value).getTime();

    data.fieldObj[fieldName] = changedDate;

    // check date
    data.ifAllDataPass = that.rulesDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  },

  nextStep: function () {
    let that = this;

    let dataResult = that.rulesDataCheck(that.data.fieldObj);

    if (dataResult.ifPass) {
      that.goToNextPage();
    }
    else {
      wx.showModal({
        title: '提示',
        content: dataResult.errMsg,
        cancelText: '继续填写',
        confirmText: '稍后再填',
        success: (res) => {
          if (res.confirm) {
            that.goToNextPage();
          }
        }
      })
    }
  },

  goToNextPage: function () {
    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    let fieldObjForNextPage = postPage.data['price'].fieldObj;

    wx.redirectTo({
      url: '../postPrice/postPrice?fieldObj=' 
        + JSON.stringify(fieldObjForNextPage)
    })
  },

  rulesDataCheck: function (data) {
    if (!(data.avaliableDate >= 0)) {
      return {
        ifPass: false,
        errMsg: "'可入住时间'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }

    if (!(data.expireDate >= 0)) {
      return {
        ifPass: false,
        errMsg: "'到期时间'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }

    return {
      ifPass: true
    }
  },

  tenantRestrictChanged: function (event) {
    let that = this;
    let data = that.data;

    let value = event.detail.value;
    let fieldName = event.currentTarget.dataset.fieldName;

    data.fieldObj.tenantRestrict[fieldName] = value;

    // check date
    data.ifAllDataPass = that.rulesDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  },

  inputChanged: function (event) {
    let that = this;
    let data = that.data;

    let value = event.detail.value;
    let fieldName = event.currentTarget.dataset.fieldName;

    data.fieldObj[fieldName] = value;

    // check date
    data.ifAllDataPass = that.rulesDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  }
})