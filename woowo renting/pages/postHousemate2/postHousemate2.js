const app = getApp();
const util = require('../../utils/util');

// pages/postHousemate2/postHousemate2.js
Page({

  /**
   * Page initial data
   */
  data: {
    bottomGapHeight: Number,
    scrollListHeight: Number,

    woowoUserInfo: {},

    genderRanges: ['男', '女', '双人（男女）', '双人（男男）', '双人（女女）', '性别保密'],
    genderRangesValue: -1,
    agesRanges: ['70后', '80后', '90后', '00后', '年龄保密'],
    agesRangesValue: -1,
    careerRanges: ['学生', '金融', '教育', '其他职业', '职业保密'],
    careerRangesValue: -1,

    gender: '',
    ages: '',
    career: '',

    // use for initialization
    initContactInfo: {
      phone: '',
      wechat: '',
      wechatCodeUrl: ''
    },

    phone: '',
    wechat: '',
    wechatCodeUrl: '',

    ifSaveInfo: false,
    ifPostDataValid: false,

    ifEditMode: false,

    woowoHousemate: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    /**
     *  For layout
     */
    let windowHeight = app.globalData.windowHeight;
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    let defaultNavBarHeight = app.globalData.defaultNavBarHeight;
    let statusBarHeight = app.globalData.statusBarHeight;

    data.bottomGapHeight = app.globalData.bottomGapHeight;

    let personalInfoHeight = 197;
    let confrimBtnHeight = 51;

    data.scrollListHeight = windowHeight 
      - data.bottomGapHeight - personalInfoHeight - confrimBtnHeight;
    if (ifCustomNavigation) {
      data.scrollListHeight -= ( defaultNavBarHeight + statusBarHeight)
    }

    /**
     *  For editing initialization
     */
    data.woowoUserInfo = app.globalData.woowoUserInfo;
    data.woowoHousemate = app.globalData.woowoHousemateDraft;

    data.ifEditMode = options.editMode ? true : false;

    if (data.ifEditMode) {
      data.phone = data.woowoHousemate.phone;
      data.wechat = data.woowoHousemate.wx_id;
      data.wechatCodeUrl = data.woowoHousemate.wx_qr;

      for (let i = 0, len = data.genderRanges.length; i < len; ++i) {
        if (data.woowoHousemate.sex == data.genderRanges[i]) {
          data.genderRangesValue = i;
          data.gender = data.genderRanges[i];
          break;
        }
      }

      for (let i = 0, len = data.agesRanges.length; i < len; ++i) {
        if (data.woowoHousemate.age == data.agesRanges[i]) {
          data.agesRangesValue = i;
          data.ages = data.agesRanges[i];
          break;
        }
      }

      for (let i = 0, len = data.careerRanges.length; i < len; ++i) {
        if (data.woowoHousemate.career == data.careerRanges[i]) {
          data.careerRangesValue = i;
          data.career = data.careerRanges[i];
          break;
        }
      }
    }
    else {
      data.phone = data.woowoUserInfo.phone == '0' ? '' : data.woowoUserInfo.phone;
      data.wechat = data.woowoUserInfo.wx_id;
      data.wechatCodeUrl = data.woowoUserInfo.wx_qr
    }
    
    // initialize contact info
    data.initContactInfo.phone = data.phone;
    data.initContactInfo.wechat = data.wechat;
    data.initContactInfo.wechatCodeUrl = data.wechatCodeUrl;

    // data check
    data.ifPostDataValid = that.dataCheck().ifPass;

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

  pickerChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let pickerMode = event.detail.result.type;
    let pickerRange = event.detail.result.range;
    let chosenValue = event.detail.result.value;

    data[fieldName] = pickerRange[chosenValue];

    // data check
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  saveContactInfo: function (event) {
    console.log(event);
    let that = this;
    let data = that.data;

    data.ifSaveInfo = event.detail.ifSaveInfo;

    that.setData(data);
  },

  contactInfoChanged: function (event) {
    console.log(event);
    let that = this;
    let data = that.data;

    let fieldName = event.detail.fieldName;
    data[fieldName] = event.detail.value;

    // data check
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  updateUserInfo: function () {
    let that = this;
    let data = that.data;

    return new Promise((resolve, reject) => {
      if (data.phone && data.phone == '0') {
        data.woowoUserInfo.phone = data.phone;
      }

      // these two data don't need to be verified
      data.woowoUserInfo.wx_id = data.wechat;
      data.woowoUserInfo.wx_qr = data.wechatCodeUrl;
      

      util.requestUpdateUserInfo(data.woowoUserInfo).then(res => {
        resolve(res);
      })
    })
  },

  updateWoowoHousemateInfo: function () {
    let that = this;
    let data = that.data;

    data.woowoHousemate.updateWithFieldName(
      'sex', data.gender
    )
    data.woowoHousemate.updateWithFieldName(
      'age', data.ages
    )
    data.woowoHousemate.updateWithFieldName(
      'career', data.career
    )

    data.woowoHousemate.updateWithFieldName(
      'phone', data.phone
    )
    data.woowoHousemate.updateWithFieldName(
      'wx_id', data.wechat
    )
    data.woowoHousemate.updateWithFieldName(
      'wx_qr', data.wechatCodeUrl
    )
  },

  postHousemate: function () {
    let that = this;
    let data = that.data;

    let dataResult = that.dataCheck();
   
    // for test
    // dataResult.ifPass = true

    if (dataResult.ifPass == true) {

      that.updateWoowoHousemateInfo();
      
      // update woowoInfo synchronously
      if (data.ifSaveInfo) {
        that.updateUserInfo().then(res => {
          if (res.code == 0) {
            console.log('update woowoInfo succeed!')
          }
          else {
            console.log('update woowoInfo failed')
          }
        })
      }

      if (data.ifEditMode) {
        wx.showLoading({
          title: '更新中...',
          mask: true
        })
        util.requestUpdateHousemate(data.woowoHousemate)
        .then(res => {
          wx.hideLoading();
         
          if (res.code == 0) {
            // wx.navigateTo({
            //   url: '/pages/afterPostHousemate/afterPostHousemate?editMode=true'
            // })
            wx.showToast({
              title: '更新成功！',
              icon: 'success',
              mask: true,
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
    
                  let pages = getCurrentPages();
                  console.log(pages);
                  let prevPage = pages[pages.length - 3];
    
                  prevPage.setData({
                    ifReloadHousemate: true
                  })
                  
                  wx.navigateBack({
                    delta: 2
                  })
                }, 2000)
              }
            })
          }
          else {
            wx.showToast({
              title: '更新失败，请稍后再试',
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
      else {
        wx.showLoading({
          title: '发布中...',
          mask: true
        })
        util.requestCreateHousemate(data.woowoHousemate)
        .then(res => {
          wx.hideLoading();
  
          if (res.code == 0) {
            // post succeed 
            data.woowoHousemate.updateWithFieldName(
              'id', res.data.id
            )
            wx.navigateTo({
              url: '/pages/afterPostHousemate/afterPostHousemate'
            })
            
          }
          else {
            wx.showToast({
              title: '发布失败，请稍后再试',
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
    }
    else {
      wx.showModal({
        title: '提示',
        content: dataResult.errMsg,
        showCancel: false,
        confirmText: '确认'
      })
    }
  },

  dataCheck: function () {
    let that = this;
    let data = that.data;

    let checkResult = {
      ifPass: true,
      errMsg: ''
    };

    if (data.gender == '') {
      checkResult.ifPass = false;
      checkResult.errMsg = "'性别' 为必选字段。"
    }

    else if (data.ages == '') {
      checkResult.ifPass = false;
      checkResult.errMsg = "'年龄段' 为必选字段。"
    }

    else if (data.career == '') {
      checkResult.ifPass = false;
      checkResult.errMsg = "'职业' 为必选字段。"
    }

    else if (data.phone == '' || data.phone == '0') {
      checkResult.ifPass = false;
      checkResult.errMsg = "请输入有效的 '澳洲手机号'。"
    }

    return checkResult;
  }
})