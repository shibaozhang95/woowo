const app = getApp();

// postDescription.js
Page({

  /**
   * Page initial data
   */
  data: {
    rentTypes: ['公寓', '房屋', '工作间'],
    rentTypesValue: -1,

    houseTypes: [
      ['0室', '1室', '2室', '3室', '4室', '4室以上'],
      ['0卫', '1卫', '2卫', '3卫', '4卫', '4卫以上'],
      ['0车位', '1车位', '2车位', '3车位', '4车位', '4车位以上']
    ],
    houseTypesValue: [-1, -1, -1],

    type: '',

    fieldObj: {},
    ifAllDataPass: false, // default as false

    bottomGapHeight: Number
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    let fieldObj = JSON.parse(options.fieldObj);
    data.type = options.type;

    // INITIALISE RENTTYPE
    if (fieldObj.rentType) {
      for (let i = 0, len = data.rentTypes.length; i < len; ++i) {
        if (fieldObj.rentType == data.rentTypes[i]) {
          data.rentTypesValue = i;
        }
      }
    }

    // INITIALISE HOUSETYPE
    data.houseTypesValue[0] = fieldObj.houseType.bedroomNum;
    data.houseTypesValue[1] = fieldObj.houseType.bathroomNum;
    data.houseTypesValue[2] = fieldObj.houseType.parkingNum;
    
    data.bottomGapHeight = app.globalData.bottomGapHeight;

    // INITIALISE OTHER INFO
    data.fieldObj = fieldObj;

    data.ifAllDataPass = that.descriptionDataCheck(fieldObj).ifPass;

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
    console.log('unload description');

    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    postPage.saveEachField('description', that.data.fieldObj);
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

    let pickerMode = event.detail.result.type;
    let pickerRange = event.detail.result.range;
    let chosenValue = event.detail.result.value;

    let fieldName = event.currentTarget.dataset.fieldName;

    if (fieldName == 'rentType') {
      data.fieldObj.rentType = pickerRange[chosenValue]
    }
    else if (fieldName == 'houseType') {
    data.fieldObj.houseType = {
        bedroomNum: chosenValue[0],
        bathroomNum: chosenValue[1],
        parkingNum: chosenValue[2]
      }
    }

    data.ifAllDataPass = that.descriptionDataCheck(data.fieldObj).ifPass;
    
    that.setData(data);
  },

  inputChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let type = event.detail.type;
    let value = event.detail.value;

    if (type == 'number') value = Number(value);

    // this is for ROOMINFO
    let fieldNameLs = fieldName.split('.');
    if (fieldNameLs.length > 1) {
      data.fieldObj[fieldNameLs[0]][fieldNameLs[1]] = Boolean(value);
    }
    else {
      data.fieldObj[fieldName] = value;
    }

    data.ifAllDataPass = that.descriptionDataCheck(data.fieldObj).ifPass;

    that.setData(data);
    
    console.log(fieldName + ' has been changed');
    console.log(that.data.fieldObj);
  },

  nextStep: function () {
    let that = this;

    let dataResult = that.descriptionDataCheck(that.data.fieldObj);

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

  descriptionDataCheck: function (data) {
    console.log(data);
    if (data.rentType == '') {
      return {
        ifPass: false,
        errMsg: "'房屋类型'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }
    if (!(data.houseType.bedroomNum >= 0
      && data.houseType.bathroomNum >= 0
      && data.houseType.parkingNum >= 0)) {
      return {
        ifPass: false,
        errMsg: "'房屋户型'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }
    if (data.houseTitle == '') {
      return {
        ifPass: false,
        errMsg: "'房屋名称'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }
    if (data.houseDetail == '') {
      return {
        ifPass: false,
        errMsg: "'房屋介绍'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }

    return {
      ifPass: true
    }
  },

  goToNextPage: function () {
    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    let fieldObjForNextPage = postPage.data['rules'].fieldObj;

    wx.redirectTo({
      url: '../postRules/postRules?fieldObj=' 
        + JSON.stringify(fieldObjForNextPage)
    })
  },
})