const util = require('../../utils/util.js');
const api = require('../../services/api.js');
const qiniuUploader = require('../../utils/qiniuUploader');
const AREAS = require('../../utils/areas');

const app = getApp();

Page({
  data: {
    phoneNumber: "",
    goodsInfo: Object,

    areas: [
      ["Victoria", "New South Wales", "Canberra", "Queensland", "South Australia", "Western Australia", "Tasmania", "Northern Territory", "Others"],
      []
    ],
    areasValue: [0, 0],
    location: "",
    locality: "",
    state: "",

    ifUploadedQR: false,
    wechatQRCodeUrl: "",
    wechatId: "",

    ifUpdatedInfo: true,
    ifSaveInfo: true,

    phoneValidateStatus: 'unvalidate',
    // unvalidate, validating, validated
    ifShowValidation: false,
    timer: Number,
    timerInterval: '',

    validateCode: String,

    // in case of posting several times
    onSellingRequest: false,
    editMode: false,
    editProductId: 0
  },

  onLoad: function(option) {
    let that = this;
    let data = that.data;

    if (option.editMode == 'true') {
      let tempData = JSON.parse(option.addition);

      data.editMode = true;
      data.location = tempData.product_area + ', ' + tempData.product_region;
      data.locality = tempData.product_area;
      data.state = tempData.product_region;
      data.editProductId = tempData.product_id;
    }

    data.goodsInfo = option;
    data.phoneNumber = app.globalData.woowoUserInfo.phone ? app.globalData.woowoUserInfo.phone : '';
    data.phoneValidateStatus = app.globalData.woowoUserInfo.phone && app.globalData.woowoUserInfo.phone != '0' ? 'validated' : 'unvalidate';
    data.wechatId = app.globalData.woowoUserInfo.wx_id ? app.globalData.woowoUserInfo.wx_id : '';
    data.location = app.globalData.woowoUserInfo.area ? app.globalData.woowoUserInfo.area : '';

    if (app.globalData.woowoUserInfo.wx_qr) {
      data.wechatQRCodeUrl = app.globalData.woowoUserInfo.wx_qr;
      data.ifUploadedQR = true;
    }

    if (data.location != '') {
      let temp = data.location.split(', ');
      data.locality = temp[0];
      data.state = temp[1];
    }

    that.setData(data);
  },

  onShow: function() {
    let that = this;

    that.setData(that.data);
    wx.setNavigationBarTitle({
      title: '发布二手',
      success: function(res) {
        // success
      }
    })
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  inputPhoneNumber: function(event) {
    let that = this;

    console.log(event.detail.value)
    that.setData({
      phoneNumber: event.detail.value.replace(/\D/g, ''),
      phoneValidateStatus: 'unvalidate'
    })

    if (!that.data.ifUpdatedInfo) {
      that.setData({
        ifUpdatedInfo: true
      })
    }

    if (that.data.phoneNumber != '0' && that.data.phoneNumber == app.globalData.woowoUserInfo.phone) {
      that.setData({
        phoneValidateStatus: 'validated'
      })
    }
  },

  inputWechatId: function(event) {
    let that = this;
    that.setData({
      wechatId: event.detail.value.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '')
    })

    if (!that.data.ifUpdatedInfo) {
      that.setData({
        ifUpdatedInfo: true
      })
    }
  },

  inputAddress: function(event) {
    let that = this;

    let option = util.paramObjToStr({
      'address': that.data.location.address
    })
    let url = '../areasSearch/areasSearch?' + option;

    wx.navigateTo({
      url: url
    })
  },

  changeAddress: function (oneAres) {
    // console.log(oneAres);
    let that = this;
    let data = that.data;

    data.locality = oneAres.locality;
    data.state = oneAres.state;
    data.location = data.locality + ', ' + data.state;

    console.log(data.location);
    that.setData(data);
  },

  confirmToSell: function() {
    let that = this

    // in case of sending a lot of requests and 
    if (that.data.onSellingRequest == true) {
      console.log(that.data.onSellingRequest)
      return;
    } else {
      that.setData({
        onSellingRequest: true
      })
    }

    // before sending request, validate seller info
    let validateResult = that.validateSellerInfo(that.data.phoneNumber, that.data.location)


    if (validateResult.ifPassed) {
      // update user information 
      that.updateUserInfo();

      let sellerInfo = {
        phoneNumber: that.data.phoneNumber,
        wechatQRCodeUrl: that.data.ifUploadedQR ? that.data.wechatQRCodeUrl : '',
        wechatId: that.data.wechatId ? that.data.wechatId : '',
        unionId: app.globalData.unionId
      }
      let goodsInfo = that.data.goodsInfo;

      // add region and area 
      goodsInfo.area = that.data.locality;
      goodsInfo.region = that.data.state;

      // if (that.data.location == 'Others') {
      //   goodsInfo.area = 'Others',
      //   goodsInfo.region = 'Others'
      // } else {
      //   goodsInfo.area = that.data.location.split(', ')[0];
      //   goodsInfo.region = that.data.location.split(', ')[1];
      // }

      let requestData = util.formatData.sellGoodsInfo(goodsInfo, sellerInfo)
      // console.log("----------------")
      // request Data all here
      requestData.product_id = that.data.editProductId;
      console.log(requestData);

      // when edit Mode open User Update the product's info
      if (that.data.editMode == true) {
        wx.showLoading({
          title: '更新中...'
        });
        util.request(api.EditProductInfo, requestData, 'POST')
          .then(res => {
            wx.hideLoading();
            
            if (res.data.code == 0) {
              console.log('Post goods successfull')
              let params = util.paramObjToStr({
                goodsId: res.data.product_id,
                goodsTitle: that.data.goodsInfo.title,
                goodsCover: that.data.goodsInfo.imgsUrl.split(';')[0]
              })
              util.updateShelfStatusLocally('', 'check')
              // console.log("----------------")
              // console.log(params)
              // wx.redirectTo({
              //   url: '../afterPosted/afterPosted?' + params
              // })
              wx.showToast({
                title: '更新成功',
                icon: 'success',
                mask: true,
                success: () => {
                  setTimeout(() => {
                    wx.hideToast();
                    wx.navigateBack({
                      delta: 2
                    })
                  }, 2000)
                }
              })

            } else {
              throw new Error('Something wrong, post failed')
            }
          })
          .catch(err => {
            console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '更新失败',
              mask: true,
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
                }, 2000)
              }
            })
          })
      } else {
        wx.showLoading({
          title: '发布中...'
        });
        util.request(api.InsertProduct, requestData, 'POST')
          .then(res => {
            console.log(res)
            if (res.data.code == 0) {
              console.log('Post goods successfull')
              let params = util.paramObjToStr({
                goodsId: res.data.product_id,
                goodsTitle: that.data.goodsInfo.title,
                goodsCover: that.data.goodsInfo.imgsUrl.split(';')[0],
                goodsPrice: that.data.goodsInfo.price
              })
              util.updateShelfStatusLocally('', 'check')
              
              wx.redirectTo({
                url: '../afterPosted/afterPosted?' + params
              })

              wx.hideLoading();
            } else {
              throw new Error('Something wrong, post failed')
            }
          })
          .catch(err => {
            console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '发布失败',
              mask: true,
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
                }, 2000)
              }
            })
          })
      }

    // when there are any data not fill or wrong fill ELSE
    } else {
      console.log(validateResult.reason);
      wx.showToast({
        title: validateResult.reason,
        icon: 'none',
        success: function() {
          setTimeout(() => {
            wx.hideToast();
          }, 3000)
        }
      })
    }
    that.setData({
      onSellingRequest: false
    })
  },

  updateUserInfo: function() {
    let that = this;
    if (that.data.ifUpdatedInfo && that.data.ifSaveInfo) {
      let newUserInfo = {
        'phone': that.data.phoneNumber,
        'wx_qr': that.data.ifUploadedQR ? that.data.wechatQRCodeUrl : '',
        'wx_id': that.data.wechatId ? that.data.wechatId : '',
        'area': that.data.location ? that.data.location : '',
        'wx_unionid': app.globalData.woowoUserInfo.wx_unionid
      }

      // store by request
      let newWoowoInfo = app.globalData.woowoUserInfo;
      newWoowoInfo.phone = that.data.phoneNumber;
      newWoowoInfo.wx_qr = that.data.ifUploadedQR ? that.data.wechatQRCodeUrl : '';
      newWoowoInfo.wx_id = that.data.wechatId ? that.data.wechatId : '';
      newWoowoInfo.area = that.data.location ? that.data.location : '';

      // update locally
      app.globalData.woowoUserInfo = newWoowoInfo;

      // then request remotely
      util.requestUpdateUserInfo(newUserInfo).then(res => {
        if (res.code == 0) {
          util.updateUserInfoLocally(res.data)
        } else {
          wx.showToast({
            title: '保存信息失败',
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
  },

  validateSellerInfo: function(phone, location) {
    // FOR TEST
    // return ({ifPassed: true})
    let that = this;

    let result = {
      ifPassed: false,
      reason: ''
    }
    console.log(that.data.phoneValidateStatus + "----phone");
    console.log(location + "----local");

    if (that.data.phoneValidateStatus != 'validated') {

      result.reason = "请先验证手机号码";
    } else if (location == "") {
      result.reason = "请选择闲品位置";
    } else {
      result.ifPassed = true;
    }
    return result
  },

  chooseQRCode: function() {
    let that = this;

    wx.chooseImage({
      count: 1,
      success: (res) => {
        that.uploadQRCode(res.tempFilePaths[0])
      },

      fail: () => {
        wx.showToast({
          title: '出错了！',
          mask: true,
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

    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    qiniuUploader.upload(path, (res) => {
      that.setData({
        ifUploadedQR: true,
        wechatQRCodeUrl: 'https://' + res.imageURL
      });
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

      that.setData({
        ifUpdatedInfo: true
      })
    }, (error) => {
      console.log('error: ' + error);
    }, {
      region: 'ECN',
      domain: 'media.woniu-xcx.xyz', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接

      uptokenURL: api.GetQiniuToken, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}

      // uptoken: "fgw_DQLEFNYRt3Kmd_aZ65twt-XtmDs90UV2T6K2:aGO6I55ltODcoble87lMeSCWcyw=:eyJzY29wZSI6Indvbml1IiwiZGVhZGxpbmUiOjE1MzI2MTcwNDd9"
    }, (res) => {

      console.log('上传进度', res.progress)
    })

  },

  checkQRCode: function() {
    let that = this;
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        console.log(res);
        that.setData({
          ifUploadedQR: true,
          wechatQRCodeUrl: 'data:image/png;base64,' + res.rawData
        });
      },
      fail: () => {
        wx.showToast({
          title: '请选择有效的二维码',
          icon: 'none',
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
      }
    })
  },

  getCurrentLocation: function() {
    let that = this;

    wx.showLoading({
      title: '定位中...',
      mask: true,
    })
    util.getCurrentLocation()
      .then(res => {

        console.log(res);
        wx.hideLoading();

        if (res.code == 0) {
          let location = res.data.region == 'Others' ? 'Others' : res.data.area + ', ' + res.data.region
          that.setData({
            location: location
          })
        } else {
          wx.showToast({
            // title: res.errMsg,
            title: '获取当前位置失败',
            mask: true,
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
      })
  },

  changeAreas: function(event) {

    let that = this;
    that.setData({
      areasValue: event.detail.value,
      location: that.data.areas[1][event.detail.value[1]] + ', ' + that.data.areas[0][event.detail.value[0]]
    })
    // console.log(that.data.location)

  },

  changeRegions: function(event) {
    let that = this;

    // if just changed areas, do nothing
    if (event.detail.column == 1) return;
    let areas = [];

    let region = that.data.areas[0][event.detail.value];
    switch (region) {
      case "Victoria":
        areas = AREAS.VIC.areas.split(',');
        break;
      case "New South Wales":
        areas = AREAS.NSW.areas.split(',');
        break;
      case "Canberra":
        areas = AREAS.ACT.areas.split(',');
        break;
      case "Queensland":
        areas = AREAS.QLD.areas.split(',');
        break;
      case "South Australia":
        areas = AREAS.SA.areas.split(',');
        break;
      case "Western Australia":
        areas = AREAS.WA.areas.split(',');
        break;
      case "Tasmania":
        areas = AREAS.TAS.areas.split(',');
        break;
      case "Northern Territory":
        areas = AREAS.NT.areas.split(',');
        break;
      case "Others":
        areas = ['Others'];
        break;
    }

    that.setData({
      'areas[1]': areas,
      areasValue: [event.detail.value, 0]
    })
    console.log(event)
  },

  switchSaveInfo: function() {
    let that = this;

    that.setData({
      ifSaveInfo: !this.data.ifSaveInfo
    })

    console.log(that.data.ifSaveInfo)
  },

  switchValidateStatus: function() {
    let that = this;

    let current = that.data.phoneValidateStatus;
    if (current == 'unvalidate') current = 'validating'
    else if (current == 'validating') current = 'validated'
    else if (current == 'validated') current = 'unvalidate'
    else current = 'unvalidate'
    that.setData({
      phoneValidateStatus: current
    })
  },

  requestValidation: function() {
    let that = this;

    that.setData({
      phoneValidateStatus: 'validating',
    })

    that.timerCountdown();

    wx.showLoading({
      title: '发送中...'
    })
    util.requestValidatePhoneNumber(that.data.phoneNumber)
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          that.setData({
            ifShowValidation: true,
            validateCode: res.data
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
          phoneValidateStatus: 'unvalidate'
        })
      } else {
        currentTimer--;
        that.setData({
          timer: currentTimer
        })
      }
    }, 1000)
  },

  confirmValidateCode: function(event) {
    let that = this;

    let inputValidateCode = event.detail.inputValidateCode;
    let validateCode = that.data.validateCode;
    console.log(inputValidateCode);
    console.log(validateCode);

    if (inputValidateCode == validateCode) {
      that.setData({
        ifShowValidation: false,
        phoneValidateStatus: 'validated'
      })
      clearInterval(that.data.timerInterval);
      wx.showToast({
        title: '验证成功',
        success: () => {
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }
      })
    } else {
      wx.showToast({
        title: '验证失败，请重新输入！',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }
      })
    }
  }
})