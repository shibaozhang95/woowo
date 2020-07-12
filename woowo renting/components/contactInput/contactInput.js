const app = getApp();
const util = require('../../utils/util');
const qiniuUploader = require('../../utils/qiniuUploader');
const API = require('../../services/api');

// components/contactInput/contactInput.js
Component({
  /**
   * Component properties
   */
  properties: {
    fieldObj: {
      type: Object,
      value: {
        phone: '',
        wechat: '',
        wechatCodeUrl: ''
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    woowoUserInfo: {},

    ownFieldObj: {
      phone: '',
      wechat: '',
      wechatCodeUrl: ''
    },

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

  ready: function () {
    let that = this;
    let data = that.data;

    /**
     *  For user information
     */
    data.woowoUserInfo = app.globalData.woowoUserInfo;

    data.ownFieldObj.phone = data.fieldObj.phone;
    data.ownFieldObj.wechat = data.fieldObj.wechat;
    data.ownFieldObj.wechatCodeUrl = data.fieldObj.wechatCodeUrl;

    // if user saved thier data
    if (!data.ownFieldObj.phone && 
        data.woowoUserInfo.phone && data.woowoUserInfo.phone != '0') {
      data.ownFieldObj.phone = data.woowoUserInfo.phone;
    }
    if (!data.ownFieldObj.wechat
        && data.woowoUserInfo.wx_id) {
      data.ownFieldObj.wechat = data.woowoUserInfo.wx_id;
    }
    if (!data.ownFieldObj.wechatCodeUrl 
      && data.woowoUserInfo.wx_qr) {
      data.ownFieldObj.wechatCodeUrl = data.woowoUserInfo.wx_qr;
    }

    if (data.ownFieldObj.phone.length > 0) {
      data.phoneNumber = data.ownFieldObj.phone;
      data.phoneVerificationStatus = 'verified';
    } 
    if (data.ownFieldObj.wechatCodeUrl.length > 0) {
      data.qrCodeUploadingStatus = 'uploaded'
    }

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    triggerSaveInfo: function () {
      let that = this;
      let data = that.data;
  
      data.ifSaveInfo = !data.ifSaveInfo;

      that.triggerEvent('savecontactinfo', {
        ifSaveInfo: data.ifSaveInfo
      })
  
      that.setData(data);
    },

    phoneNumberChanged: function (event) {
      let that = this;
      let data = that.data;
  
      data.phoneNumber = event.detail.value.replace("'", "").replace('"', '').replace('`', '')
        .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
        .replace('[', '').replace(']', '').replace(' ', '');
  
      // every time change phoneNumber, set status as unverified

      data.phoneVerificationStatus = 'unverified';
      // data.ownFieldObj.phone = '';
      
      that.triggerEvent('contactinfochanged', {
        fieldName: 'phone',
        value: ''
      })
  
      that.setData(data);
    },

    wechatChanged: function (event) {
      let that = this;
      let data = that.data;
  
      data.ownFieldObj.wechat = event.detail.value.replace("'", "").replace('"', '').replace('`', '')
        .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
        .replace('[', '').replace(']', '').replace(' ', '');
  
      data.ifShowSaveInfo = true;
      
      that.triggerEvent('contactinfochanged', {
        fieldName: 'wechat',
        value: data.ownFieldObj.wechat
      })
      
      that.setData(data);
    },

    verificationConfirm: function (event) {
      let that = this;
      let data = that.data;
  
      let code = event.detail.value;
      let phoneVerificationCode = data.phoneVerificationCode;
  
      if (phoneVerificationCode == code) {
        data.ownFieldObj.phone = data.phoneNumber;
        
        data.ifShowVerification = false;
        data.phoneVerificationStatus = 'verified';
        data.ifShowSaveInfo = true;

        that.triggerEvent('contactinfochanged', {
          fieldName: 'phone',
          value: data.ownFieldObj.phone
        })

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
  
      data.ownFieldObj.wechatCodeUrl = '';
  
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
        data.ownFieldObj.wechatCodeUrl = 'https://' + res.imageURL;
  
        that.triggerEvent('contactinfochanged', {
          fieldName: 'wechatCodeUrl',
          value: data.ownFieldObj.wechatCodeUrl
        })
        that.setData(data);
  
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
        console.log(error)
        wx.showToast({
          title: '上传失败，请稍后再试',
          icon: 'none',
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
  }
})
