const app = getApp();
const util = require('../../utils/util');
const qiniuUploader = require('../../utils/qiniuUploader');
const API = require('../../services/api');

// postId.js
Page({

  /**
   * Page initial data
   */
  data: {
    woowoUserInfo: {},
    fieldObj: {},
    ifAllDataPass: false,

    bottomGapHeight: Number,

    phoneVerificationStatus: 'unverified',
    // unverified, verifying, verified
    ifShowVerification: false,
    ifShowVerificationError: false,
    timer: 0,
    timerInterval: {},

    phoneVerificationCode: '',

    phoneNumber: '',   // location,

    // for qr code
    qrCodeUploadingStatus: 'unuploaded',
    // unuploaded, unploading, uploaded

    ifShowSaveInfo: false,
    ifSaveInfo: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    /**
     *  For userinformation
     */
    data.woowoUserInfo = app.globalData.woowoUserInfo;

    /**
     *  FOR LAYOUT
     */
    data.bottomGapHeight = app.globalData.bottomGapHeight;
    
    /**
     *  FOR INITIALIZATION
     */
    data.fieldObj = JSON.parse(options.fieldObj);

    // if user saved thier data
    if (data.woowoUserInfo.phone && data.woowoUserInfo.phone != '0') {
      data.fieldObj.phone = data.woowoUserInfo.phone;
    }
    if (data.woowoUserInfo.wx_id) {
      data.fieldObj.wechat = data.woowoUserInfo.wx_id;
    }
    if (data.woowoUserInfo.wx_qr) {
      data.fieldObj.wechatCodeUrl = data.woowoUserInfo.wx_qr;
    }

    if (data.fieldObj.phone.length > 0) {
      data.phoneNumber = data.fieldObj.phone;
      data.phoneVerificationStatus = 'verified';
    } 
    if (data.fieldObj.wechatCodeUrl.length > 0) {
      data.qrCodeUploadingStatus = 'uploaded'
    }

    data.ifAllDataPass = that.contactDataCheck(data.fieldObj).ifPass;

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
    console.log('unload contact');

    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    postPage.saveEachField('contact', that.data.fieldObj);
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

  triggerSaveInfo: function () {
    let that = this;
    let data = that.data;

    data.ifSaveInfo = !data.ifSaveInfo;

    that.setData(data);
  },

  phoneNumberChanged: function (event) {
    let that = this;
    let data = that.data;

    data.phoneNumber = event.detail.value.replace("'", "").replace('"', '').replace('`', '')
      .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
      .replace('[', '').replace(']', '').replace(' ', '');

    // every time change phoneNumber, set status as unverified
    data.ifShowSaveInfo = true;
    data.phoneVerificationStatus = 'unverified';
    data.fieldObj.phone = '';
    data.ifAllDataPass = that.contactDataCheck(data.fieldObj).ifPass;

    that.setData(data);
  },

  wechatChanged: function (event) {
    let that = this;
    let data = that.data;

    data.fieldObj.wechat = event.detail.value.replace("'", "").replace('"', '').replace('`', '')
      .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
      .replace('[', '').replace(']', '').replace(' ', '');

    data.ifShowSaveInfo = true;
    data.ifAllDataPass = that.contactDataCheck(data.fieldObj).ifPass;
    
    that.setData(data);
  },

  verificationConfirm: function (event) {
    let that = this;
    let data = that.data;

    let code = event.detail.value;
    let phoneVerificationCode = data.phoneVerificationCode;

    if (phoneVerificationCode == code) {
      data.fieldObj.phone = data.phoneNumber;
      data.ifAllDataPass = that.contactDataCheck(data.fieldObj).ifPass;
      
      data.ifShowVerification = false;
      data.phoneVerificationStatus = 'verified';
      that.setData(data);

      wx.showToast({
        title: '手机验证成功',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 2000)
        }
      })
    }

    else {
      that.setData({
        ifShowVerificationError: true
      })
    }
  },

  verificationCancel: function () {
    let that = this;

    that.setData({
      ifShowVerification: false
    })

    
  },

  requestVerificationCode: function () {
    let that = this;

    wx.showLoading({
      title: '发送中...',
      mask: true
    })

    let phoneNumber = that.data.phoneNumber;

    util.requestVerifyingPhoneNumber(phoneNumber)
    .then(res => {

      // the count part
      that.setData({
        phoneVerificationStatus: 'verifying',
      })
      that.timerCountdown();

      // other part
      wx.hideLoading();
      if (res.code == 0) {
        that.setData({
          ifShowVerification: true,
          phoneVerificationCode: res.data
        })
      } else {
        wx.showToast({
          title: '发送验证码失败，请稍后再试',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
      }
    })
  },

  timerCountdown: function() {
    let that = this;

    that.setData({
      timer: 60
    })

    let currentTimer = that.data.timer

    that.data.timerInterval = setInterval(() => {
      if (currentTimer == 0) {
        clearInterval(that.data.timerInterval);
        that.setData({
          phoneVerificationStatus: 'unverified',
          timerInterval: that.data.timerInterval
        })
      } else {
        currentTimer--;
        that.setData({
          timer: currentTimer
        })
      }
    }, 1000)
  },

  chooseQRCode: function() {
    let that = this;
    let data = that.data;

    data.fieldObj.wechatCodeUrl = '';
    that.setData(data);

    wx.chooseImage({
      count: 1,
      success: (res) => {
        that.uploadQRCode(res.tempFilePaths[0])
      },

      fail: () => {
        wx.showToast({
          title: '出错了！',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
      }
    })
  },

  uploadQRCode: function(path) {
    let that = this;
    let data = that.data;

    data.qrCodeUploadingStatus = 'uploading';
    that.setData(data);

    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    qiniuUploader.upload(path, (res) => {
      data.ifShowSaveInfo = true;
      data.qrCodeUploadingStatus = 'uploaded';
      data.fieldObj.wechatCodeUrl = 'https://' + res.imageURL;
      data.ifAllDataPass = that.contactDataCheck(data.fieldObj).ifPass;

      that.setData(data);
      console.log(data);

      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 2000)

        }
      })
    }, (error) => {
      wx.showToast({
        title: '上传失败，请稍后再试',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 2000)
        }
      })

      data.qrCodeUploadingStatus = 'unuploaded';
      
      that.setData(data);
    }, {
      region: 'ECN',
      domain: 'media.woniu-xcx.xyz', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接

      uptokenURL: API.GetQiniuToken, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}

      // uptoken: "fgw_DQLEFNYRt3Kmd_aZ65twt-XtmDs90UV2T6K2:aGO6I55ltODcoble87lMeSCWcyw=:eyJzY29wZSI6Indvbml1IiwiZGVhZGxpbmUiOjE1MzI2MTcwNDd9"
    }, (res) => {

      console.log('上传进度', res.progress)
    })

  },

  contactDataCheck: function (fieldObj) {
    if (fieldObj.phone == '') {
      return {
        ifPass: false,
        errMsg: "'手机号'为必填字段。所有的必填字段填完才可以发布哦~"
      }
    }

    return {
      ifPass: true
    }
  },

  nextStep: function () {
    let that = this;

    let dataResult = that.contactDataCheck(that.data.fieldObj);

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
    let that = this;
    let data = that.data;

    if (data.ifSaveInfo) {
      that.updateUserInfo().then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '信息保存成功！',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }
        else {
          wx.showToast({
            title: '信息保存失败，请稍后再试！',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })

          data.ifSaveInfo = false;

          that.setData(data);
        }
      })
    }
    else {
      wx.navigateBack({
        delta: 1
      })
    }
    
  },

  updateUserInfo: function () {
    let that = this;
    let data = that.data;

    return new Promise((resolve, reject) => {
      if (data.fieldObj.phone && data.phoneVerificationStatus == 'verified') {
        data.woowoUserInfo.phone = data.fieldObj.phone;
      }

      // these two data don't need to be verified
      data.woowoUserInfo.wx_id = data.fieldObj.wechat;
      data.woowoUserInfo.wx_qr = data.fieldObj.wechatCodeUrl;

      util.requestUpdateUserInfo(data.woowoUserInfo).then(res => {
        resolve(res);
      })
    })
  }
})