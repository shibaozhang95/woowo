const app = getApp();
const util = require('../../utils/util');
const api = require('../../services/api');
const qiniuUploader = require('../../utils/qiniuUploader');

// pages/shopInfo/shopInfo.js
Page({

  /**
   * Page initial data
   */
  data: {
    name: '',
    description: '',
    image: '',
    bgImage: '',
    unionId: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;
    let woowoUserInfo = app.globalData.woowoUserInfo;
    let shopInfo = woowoUserInfo.shopInfo;

    // data initialization
    data.unionId = woowoUserInfo.wx_unionid;

    data.name = shopInfo && shopInfo.name 
      ? decodeURIComponent(shopInfo.name) : '';
    data.description = shopInfo && shopInfo.description
      ? decodeURIComponent(shopInfo.description) : '';
    data.image = shopInfo && shopInfo.image
      ? shopInfo.image : '';
    data.bgImage = shopInfo && shopInfo.bgImage
      ? shopInfo.bgImage : '';

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

  inputChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let value = event.detail.value;

    data[fieldName] = value;

    that.setData(data);
  },

  chooseAndUpdateImage: function (event) {
    let that = this;
    let data = that.data;
    let fieldName = event.currentTarget.dataset.fieldName;

    that.chooseImage().then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '上传成功!',
          icon: 'success',
          success: function () {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        });

        data[fieldName] = res.data;
        that.setData(data);
      }
      else {
        let tips = res.errMsg;
        wx.showToast({
          title: tips,
          icon: 'none',
          success: function () {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        })
      }
    })
  },

  uploadBgImage: function () {
    let that = this;
    let data = that.data;

    that.chooseImage().then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '上传成功!',
          icon: 'success',
          success: function () {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        });

        data.image = res.data;
        that.setData(data);
      }
      else {
        let tips = res.errMsg;
        wx.showToast({
          title: tips,
          icon: 'none',
          success: function () {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        })
      }
    })
  },

  chooseImage: function () {
    let that = this;

    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          let imagePath = res.tempFilePaths[0];
  
          wx.showLoading({
            title: '上传中...',
            mask: true
          })
          that.uploadImage(imagePath).then(res => {
            wx.hideLoading();
            if (res.code == 0) {
              resolve({
                code: 0,
                data: res.data
              })
            }
            else {
              resolve({
                code: -1,
                errMsg: '上传图片失败!'
              })
              
            }
          })
        },
        fail: (err) =>{
          resolve({
            code: -1,
            errMsg: '获取照片失败:' + err
          })
        }
      })
    })
  },

  uploadImage: function (filePath) {
    return new Promise((resolve, reject) => {
      qiniuUploader.upload(filePath, (res) => {
        resolve({
          code: 0,
          data: 'https://' + res.imageURL
        })
      }, (error) => {
        resolve({
          code: -1,
          errMsg: 'error: ' + error
        })
      }, {
        region: 'ECN',
        domain: 'media.woniu-xcx.xyz', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接

        uptokenURL: api.GetQiniuToken, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
        
        // uptoken: "fgw_DQLEFNYRt3Kmd_aZ65twt-XtmDs90UV2T6K2:aGO6I55ltODcoble87lMeSCWcyw=:eyJzY29wZSI6Indvbml1IiwiZGVhZGxpbmUiOjE1MzI2MTcwNDd9"
      }, (res) => {
        console.log('上传进度', res.progress)
      });
    })
  },

  updateShopInfo: function () {
    let that = this;
    let data = that.data;

    let result = that.validateShopInfo();

    if (result.ifPassed) {
      util.requestUpdateShopInfo(data.unionId, {
        name: data.name,
        description: data.description,
        image: data.image,
        bgImage: data.bgImage
      }).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '更新成功!',
            icon: 'success',
            success: function () {
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }
          });
          console.log(res);
          let newUserInfo = app.globalData.woowoUserInfo;
          newUserInfo.shopInfo = res.data[0];

          util.updateUserInfoLocally(newUserInfo);
          
          wx.navigateBack({
            delta: 1
          })
        }
        else {
          wx.showToast({
            title: '更新失败:' + res.errMsg,
            icon: 'none',
            success: function () {
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }
          });
        }
      })
    }
    else {
      wx.showModal({
        title: '提醒',
        content: result.reason,
        showCancel: false
      })
    }
  },

  validateShopInfo: function () {
    let that = this;
    let data = that.data;

    let result = {
      ifPassed: false,
      reason: ''
    }

    if (data.image.length == 0) {
      result.reason = "商家头像为必填字段。"
    }
    else if (data.name.length == 0) {
      result.reason = "店铺名字为必填字段。"
    }
    else if (data.description.length == 0) {
      result.reason = "店铺描述为必填字段。"
    }
    else {
      result.ifPassed = true;
    }

    return result;
  }
})