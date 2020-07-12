const app = getApp();

// postPrice.js
Page({

  /**
   * Page initial data
   */
  data: {
    bills: [{
      title: 'WiFi',
      iconUrl: '/statics/icons/icon_bill_wifi.png',
      ifChosen: false
    }, {
      title: '水费',
      iconUrl: '/statics/icons/icon_bill_water.png',
      ifChosen: false
    }, {
      title: '电费',
      iconUrl: '/statics/icons/icon_bill_electricity.png',
      ifChosen: false
    }, {
      title: '煤气费',
      iconUrl: '/statics/icons/icon_bill_gas.png',
      ifChosen: false
    }],

    fieldObj: {},
    ifIncludesBills: false,
    ifAllDataPass: false,
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

    // FOR INITIALISE DATA
    data.fieldObj = JSON.parse(options.fieldObj);

    data.ifIncludesBills = data.fieldObj.includedBills ? true : false;
    
    let billsLs = data.fieldObj.includedBills.split(';');

    for (let k = 0, kLen = billsLs.length; k < kLen; ++k) {
      for (let i = 0, len = data.bills.length; i < len; ++i) {
        if (billsLs[k] == data.bills[i].title) {
          data.bills[i].ifChosen = true;
        }
      }
    }

    data.ifAllDataPass = that.priceDataCheck(data.fieldObj).ifPass;

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
    let data = that.data;

    console.log('unload price');

    let pages = getCurrentPages();
    let postPage = pages[pages.length - 2];

    data.fieldObj.includedBills = that.convertBillsToStr(data.bills);

    console.log(data.fieldObj);

    postPage.saveEachField('price', data.fieldObj);
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

  nextStep: function () {
    let that = this;
    let data = that.data;

    data.fieldObj.includedBills = that.convertBillsToStr(data.bills);

    // verdificate the data first
    let dataResult = that.priceDataCheck(data.fieldObj);

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

  priceDataCheck: function (fieldObj) {
    if (!(fieldObj.pricePerWeek >= 0)) {
      return {
        ifPass: false,
        errMsg: "'价格'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }

    return {
      ifPass: true
    }
  },

  goToNextPage: function () {
    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    let fieldObjForNextPage = postPage.data['contact'].fieldObj;

    wx.redirectTo({
      url: '../postId/postId?fieldObj=' 
        + JSON.stringify(fieldObjForNextPage)
    })
  },

  billsBlockChanged: function (event) {
    let that = this;
    let data = that.data;

    let value = event.detail.value;

    if (value == true) return;

    for (let i = 0, len = data.bills.length; i < len; ++i) {
      data.bills[i].ifChosen = false;
    }

    data.ifAllDataPass = that.priceDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  },

  priceChanged: function (event) {
    let that = this;
    let data = that.data;

    let value = Number(event.detail.value);

    data.fieldObj.pricePerWeek = value;

    data.ifAllDataPass = that.priceDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  },

  chooseBillsIcon: function (event) {
    let that = this;
    let data = that.data;

    let index = event.currentTarget.dataset.index;

    data.bills[index].ifChosen = !data.bills[index].ifChosen;

    that.setData(data);
  },

  convertBillsToStr: function (bills) {
    let billsLs = [];
    let billsStr = '';

    for (let i = 0, len = bills.length; i < len; ++i) {
      if (bills[i].ifChosen) {
        billsLs.push(bills[i].title);
      }
    }

    billsStr = billsLs.join(';');

    return billsStr;
  }
})