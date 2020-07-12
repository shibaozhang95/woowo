const app = getApp();
const util = require('../../utils/util.js');
const eviltransform = require('../../utils/transform');
const format = require('../../utils/format');

// postLocation.js
Page({

  /**
   * Page initial data
   */
  data: {
    bottomGapHeight: Number,
    mapWidth: Number,
    mapHeight: Number,
    posTop: Number,
    posBottom: Number,
    containerHeight: Number,

    ifRequesting: false,
    ifShowSuggestion: false,

    suggestionLocations: [],

    timer: '',   // used to count

    fieldObj: {},
    ifAllDataPass: false,

    // for showing the map
    latitude: -23.697510,
    longitude: 133.878876,
    scale: 5,
    markers: [],

    formatAddress: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    // FOR LAYOUT
    let windowWidth = app.globalData.windowWidth;
    let windowHeight = app.globalData.windowHeight;
    let navHeight = app.globalData.navHeight;
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    
    data.bottomGapHeight = app.globalData.bottomGapHeight;
    data.mapWidth = windowWidth;
    data.posTop = 51 + 51;
    data.posBottom =  51;
    data.mapHeight = windowHeight - data.bottomGapHeight 
      - data.posTop - data.posBottom;

    data.containerHeight = windowHeight - data.bottomGapHeight;

    if (ifCustomNavigation) {
      data.mapHeight -= navHeight;
      data.containerHeight -= navHeight;
    }
    // FOR INITIALIZATION
    data.fieldObj = JSON.parse(options.fieldObj);

    if (data.fieldObj.street) {
      data.formatAddress = data.fieldObj.street + ', '
      + data.fieldObj.suburb + ' ' + data.fieldObj.state;
    
      let coordinates = data.fieldObj.latlng;
      let gcjCor = eviltransform.wgs2gcj(coordinates[0], coordinates[1]);

      data.latitude = gcjCor.lat;
      data.longitude = gcjCor.lng;
      data.scale = 16;
    }
    
    

    data.ifAllDataPass = that.locationDataCheck(data.fieldObj).ifPass;

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
  
    console.log('unload location');

    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2]; 

    postPage.saveEachField('location', data.fieldObj);

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

  addressInputChanged: function (event) {
    let that = this;

    let searchKeyword = event.detail.value;
    
    if (searchKeyword.length > 2) {
      if (that.data.timer) {
        clearTimeout(that.data.timer);
      }
  
      that.data.timer = setTimeout(() => {
        // that.autocompleteAddress(searchKeyword);
        that.autocompleteAddressBing(searchKeyword);
      }, 500)
    }
  },


  // autocompleteAddress: function (keyword) {
  //   let that = this;

  //   that.setData({
  //     ifRequesting: true
  //   })
    
  //   util.requestAutocompleteAddress(keyword)
  //   .then(res => {

  //     let formatResults = [];

  //     if (res.code == 0) {
  //       for (let i = 0, len = res.predictions.length; i < len; ++i) {
  //         if (res.predictions[i].terms.length != 5) {
  //           continue;
  //         }

  //         let oneValidAddress = {};

  //         oneValidAddress.street = res.predictions[i].terms[0] + ' '
  //           + res.predictions[i].terms[1];
  //         oneValidAddress.suburb = res.predictions[i].terms[2];
  //         oneValidAddress.state = res.predictions[i].terms[3];
  //         oneValidAddress.formatAddress = oneValidAddress.street + ', '
  //           + oneValidAddress.suburb + ' ' + oneValidAddress.state;

  //         formatResults.push(oneValidAddress);
  //       }
  //     }

  //     console.log(formatResults);
  //     that.setData({
  //       ifRequesting: false,
  //       suggestionLocations: formatResults
  //     })
      
  //   })
  // },

  autocompleteAddressBing: function (keyword) {
    let that = this;

    that.setData({
      ifRequesting: true,
      ifShowSuggestion: true,
      suggestionLocations: []
    })

    util.requestAutoSuggesteBing(keyword, 'Address')
    .then(res => {
      let formatResults = [];

      if (res.code == 0) {
        for (let i = 0, len = res.predictions.length; i < len; ++i) {
          if (!res.predictions[i].address.houseNumber) {
            continue;
          }

          let oneValidAddress =  {};

          oneValidAddress.street = res.predictions[i].address.addressLine;
          oneValidAddress.suburb = res.predictions[i].address.locality;
          oneValidAddress.state = format.formatState(res.predictions[i].address.adminDistrict);
          oneValidAddress.formatAddress = oneValidAddress.street + ', '
           + oneValidAddress.suburb + ' ' + oneValidAddress.state;

           formatResults.push(oneValidAddress);
        }
      }

      that.setData({
        ifRequesting: false,
        suggestionLocations: formatResults
      })
    })
  },

  houseNumChanged: function (event) {
    let that = this;
    let data = that.data;

    let newNum = event.detail.value;

    data.fieldObj.unitNum = newNum;

    that.setData(data);
  },

  nextStep: function () {
    let that = this;
    let data = that.data;

    let dataResult = that.locationDataCheck(data.fieldObj);

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

  locationDataCheck: function (fieldObj) {
    if (!fieldObj.street || !fieldObj.suburb 
      || !fieldObj.state || !fieldObj.latlng) {
      return {
        ifPass: false,
        errMsg: '地址需要从输入框中填写，然后再从列表中选择。'
      }
    }

    return {
      ifPass: true
    }
  },

  confirmAnAddress: function (event) {
    let that = this;
    let data = that.data;

    let location = event.currentTarget.dataset.location;
    let address = location.formatAddress;

    wx.showLoading({
      title: '确认地址中...',
      mask: true
    })

    util.requestSearchLocationBing(address)
    .then(res => {
      wx.hideLoading();
      
      if (res.code == 0) {
        let coordinates = res.result.point.coordinates;

        let gcjCor = eviltransform.wgs2gcj(coordinates[0], coordinates[1]);

        data.ifShowSuggestion = false;

        data.latitude = gcjCor.lat;
        data.longitude = gcjCor.lng;
        data.scale = 16;

        data.markers = [{
          latitude: gcjCor.lat,
          longitude: gcjCor.lng,
        }]

        data.formatAddress = address;

        data.fieldObj.street = location.street;
        data.fieldObj.suburb = location.suburb;
        data.fieldObj.state = location.state;
        data.fieldObj.latlng = data.latitude + ',' + data.longitude;

        data.ifAllDataPass = that.locationDataCheck(data.fieldObj);

        that.setData(data);
      }
    })

  },

  getCurrentLocation: function () {
    let that = this;
    let data = that.data;

    wx.showLoading({
      title: '定位中...',
      mask: true
    })

    util.wxGetCurrentLatlng().then(res => {
      if (res.code == 0) {

        util.requestLocationByPointBing(res.data, 'Address')
        .then(res => {

          wx.hideLoading();

          let formatResults = [];
          
          if (res.code == 0) {
            for (let i = 0, len = res.data.length; i < len; ++i) {
    
              let oneValidAddress =  {};
    
              oneValidAddress.street = res.data[i].address.addressLine;
              oneValidAddress.suburb = res.data[i].address.locality;
              oneValidAddress.state = format.formatState(res.data[i].address.adminDistrict);
              oneValidAddress.formatAddress = oneValidAddress.street + ', '
               + oneValidAddress.suburb + ' ' + oneValidAddress.state;
    
               formatResults.push(oneValidAddress);
            }

            data.ifShowSuggestion = true;
            data.ifRequesting = false;
            data.suggestionLocations = formatResults;

            console.log(data.suggestionLocations)
            
            that.setData(data);
          }

          else {
            wx.showToast({
              title: '出错了，请稍后再试~',
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  wx.hideToast()
                }, 2000)
              }
            })
          }

        })
      }

      // failed to get authority
      else if (res.code == -1) {
        
        wx.hideLoading();

        wx.showModal({
          title: '获取权限失败',
          content: '前往设置页面，打开位置信息的权限才能使用该功能哦',
          showCancel: true,
          cancelText: '取消',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.getSetting();
            }
            else if (res.cancel) {

            }
          }
        })
      }
    })
  },

  goToNextPage: function () {
    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    let fieldObjForNextPage = postPage.data['facilities'].fieldObj;

    wx.redirectTo({
      url: '../postFacilities/postFacilities?fieldObj=' 
        + JSON.stringify(fieldObjForNextPage)
    })
  },
})