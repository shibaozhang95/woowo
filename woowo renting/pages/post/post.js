const app = getApp();
const util = require('../../utils/util');

// post.js
Page({

  /**
   * Page initial data
   */
  data: {
    bottomGapHeight: Number,

    scrollListHeight: Number,

    ifPostDataValid: false,

    type: '',   // 整租 合租 短租

    // imageurls is different from others
    imageUrls: {
      fieldName: 'imageUrls',
      fieldObj: '',

      ifUploaded: false,

      ifValid: false,
      ifStillImagesUploding: false,
      errMsg: '',

      createShortcut: function () {
        return;
      },
      checkValidation: function () {
        if (!this.ifStillImagesUploding && this.fieldObj.length > 0) {
          this.ifValid = true;
        }
        else {
          if (this.ifStillImagesUploding == true) this.errMsg = '图片上传中，请稍后再试~'
          else this.errMsg = '至少要上传一张图片才能发布哦~'
          this.ifValid = false;
        }
      }
    },

    location: {
      title: '房屋位置',
      description: '',
      iconUrl: 'statics/post_menu_location@2x.png',
      fieldUrl: '../postLocation/postLocation',

      ifUploaded: false,

      ifValid: false,
      ifModified: false,
      errMsg: '请先完成 “房屋位置”',
      shortcut: '',

      fieldName: 'location',
      fieldObj: {
        street: '',
        suburb: '',
        state: '',
        postalCode: 0,
        unitNum: ''
      },
      createShortcut: function () {
        this.shortcut = this.fieldObj.street + ', ' + this.fieldObj.suburb
          + ' ' + this.fieldObj.state;
        
        if (this.fieldObj.postalCode) {
          this.shortcut += (' ' + this.fieldObj.postalCode.toString());
        }
        
        if (this.fieldObj.unitNum) {
          this.shortcut = this.fieldObj.unitNum + '/' + this.shortcut;
        }
      },
      checkValidation: function () {
        let fieldObj = this.fieldObj;
        if (fieldObj.street && fieldObj.suburb && fieldObj.state) {
          this.ifValid = true;
        }
        else {
          this.ifValid = false;
          this.shortcut = '';     // if data is invalid, reset shortcut
        }

        // update shortcut
        if (this.ifValid) this.createShortcut();
      }
    },

    facilities: {
      title: '设施服务',
      description: '与房屋配套的设施和周边的便利服务',
      iconUrl: 'statics/post_menu_facilities@2x.png',
      fieldUrl: '../postFacilities/postFacilities',

      ifUploaded: false,
      
      ifValid: false,
      ifModified: false,
      shortcut: '',
      errMsg: '请先完成 “设置服务”',

      fieldName: 'facilities',
      fieldObj: {
        indoor: '',
        furniture: '',
        public: '',
        nearby: ''
      },
      createShortcut: function () {
        let fieldObj = this.fieldObj;

        let shortcut = ''

        for (let key in fieldObj) {
          if (fieldObj.hasOwnProperty(key) && fieldObj[key]) {
            shortcut += (fieldObj[key] + ';');
          }
        }

        if (shortcut == '') shortcut = '你什么都没有选哦。'

        this.shortcut = shortcut;
      },
      checkValidation: function () {
        let fieldObj = this.fieldObj;

        if (this.ifModified == true) {
          this.ifValid = true;
        }
        else if (fieldObj.indoor || fieldObj.furniture || 
          fieldObj.public || fieldObj.nearby) {
          this.ifValid = true;
        }
        else {
          this.ifValid = false;
          this.shortcut = '';    // if data is invalid, reset shortcut
        }

        // update shortcut
        if (this.ifValid) this.createShortcut();
      }

    },

    description: {
      title: '房屋描述',
      description: '填写房屋的基本信息',
      iconUrl: 'statics/post_menu_description@2x.png',
      fieldUrl: '../postDescription/postDescription',

      ifUploaded: false,
      
      ifValid: false,
      ifModified: false,
      shortcut: '',
      errMsg: '请先完成 “房屋描述”',

      fieldName: 'description',
      fieldObj: {
        rentType: '',  // Filter: 房屋类型
        houseType: {       
          bedroomNum: -1,  // Filter
          bathroomNum: -1, // Filter
          parkingNum: -1,  // Filter
        }, 
        houseArea: 0,
        houseTitle: '',
        houseDetail: '',
        roomInfo: {
          ifBathroom: false,
          ifWindows: false
        }
      },
      createShortcut: function () {
        let fieldObj = this.fieldObj;

        let shortcut = '';
        shortcut += (fieldObj.rentType + ';');
        shortcut += (fieldObj.houseType.bedroomNum + '室' + fieldObj.houseType.bathroomNum + '卫'
          + fieldObj.houseType.parkingNum + '车位;');
        if (fieldObj >= 0) {
          shortcut += fieldObj.houseArea + '平米;'
        }
        
        this.shortcut = shortcut;
      },
      checkValidation: function () {
        let fieldObj = this.fieldObj;
        
        if (fieldObj.rentType && fieldObj.houseType.bedroomNum >= 0
          && fieldObj.houseType.bathroomNum >= 0
          && fieldObj.houseType.parkingNum >= 0
          && fieldObj.houseTitle
          && fieldObj.houseDetail) {
          this.ifValid = true;
        }
        else {
          this.ifValid = false;
          this.shortcut = '';    // if data is invalid, reset shortcut
        }

        // update shortcut
        if (this.ifValid) this.createShortcut();
      }
    },

    rules: {
      title: '规则说明',
      description: '对于租客的要求说明',
      iconUrl: 'statics/post_menu_rules@2x.png',
      fieldUrl: '../postRules/postRules',

      ifUploaded: false,
      
      ifValid: false,
      ifModified: false,
      shortcut: '',
      errMsg: '请先完成 “规则说明”',

      fieldName: 'rules',
      fieldObj: {
        avaliableDate: -1, // Filter
        expireDate: -1,    // Filter
        tenantRestrict: {
          ifMaleAllowed: false,
          ifFemaleAllowed: false,
          ifCookAllowed: false,
          ifSmookAllowed: false,
          ifPetsAllowed: false
        },
        others: ''
      },
      createShortcut: function () {
        let fieldObj = this.fieldObj;

        let avaliableDate = new Date(fieldObj.avaliableDate);
        let avaliableDateStr = avaliableDate.getFullYear() 
          + '-' + (avaliableDate.getMonth() + 1) 
          + '-' + avaliableDate.getDate();

        let expireDate = new Date(fieldObj.expireDate);
        let expireDateStr = expireDate.getFullYear() 
          + '-' + (expireDate.getMonth() + 1) 
          + '-' + expireDate.getDate();

        let shortcut = '从 ' + avaliableDateStr + ' 到 ' + expireDateStr;
        
        this.shortcut = shortcut;
      },
      checkValidation: function () {
        let fieldObj = this.fieldObj;

        if (fieldObj.avaliableDate >= 0 && fieldObj.expireDate >= 0) {
          this.ifValid = true;
        }
        else {
          this.ifValid = false;
          this.shortcut = '';     // if data is invalid, reset shortcut
        }

        // update shortcut
        if (this.ifValid) this.createShortcut();
      }
    },

    price: {
      title: '价格设置',
      description: '设置一个合理的价格',
      iconUrl: 'statics/post_menu_price@2x.png',
      fieldUrl: '../postPrice/postPrice',

      ifUploaded: false,
      
      ifValid: false,
      ifModified: false,
      shortcut: '',
      errMsg: '请先完成 “价格设置”',

      fieldName: 'price',
      fieldObj: {
        pricePerWeek: Number,  // Filter
        includedBills: ''
      },
      createShortcut: function () {
        let fieldObj = this.fieldObj;

        let shortcut = '';
        
        shortcut += ('$' + fieldObj.pricePerWeek + '/周;');
        if (fieldObj.includedBills) {
          shortcut += ('包含:' + fieldObj.includedBills.replace(';', '、'));
        }

        this.shortcut = shortcut;
      },
      checkValidation: function () {
        let fieldObj = this.fieldObj;

        if (fieldObj.pricePerWeek >= 0) {
          this.ifValid = true;
        }
        else {
          this.ifValid = false;
          this.shortcut = '';     // if data is invalid, reset shortcut
        }

        // update shortcut
        if (this.ifValid) this.createShortcut();
      }

    },

    contact: {
      title: '身份认证',
      description: '添加信息，让租客更方便联系',
      iconUrl: 'statics/post_menu_id@2x.png',
      fieldUrl: '../postId/postId',

      ifUploaded: false,
      
      ifValid: false,
      ifModified: false,
      shortcut: '',
      errMsg: '请先完成 “身份认证”',

      fieldName: 'contact',
      fieldObj: {
        phone: '',
        wechat: '',
        wechatCodeUrl: ''
      },
      createShortcut: function () {
        let fieldObj = this.fieldObj;

        let shortcut = '';
        shortcut = '已验证手机: ' + fieldObj.phone;

        this.shortcut = shortcut;
      },
      checkValidation: function () {
        let fieldObj = this.fieldObj;

        if (fieldObj.phone.length > 0) {
          this.ifValid = true;
        }
        else {
          this.ifValid = false;
          this.shortcut = '';     // if data is invalid, reset shortcut
        }

        // update shortcut
        if (this.ifValid) this.createShortcut();
      }
    },

    houseInfoFields: [],

    uploadingList: [],

    woowoHouseDraft: {},
    woowoUserInfo: {},

    ifEditMode: false,
    pageTitle: ''
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

    let addingPhotosHeight = 125;
    let confrimBtnHeight = 51;

    data.scrollListHeight = windowHeight 
      - data.bottomGapHeight - addingPhotosHeight - confrimBtnHeight;
    if (ifCustomNavigation) {
      data.scrollListHeight -= ( defaultNavBarHeight + statusBarHeight)
    }

    /**
     *  check if this from editing
     */
    if (options.edit) {
      data.ifEditMode = true;
    }

    /**
     *  For initialization, which might come from draft and from editing
     */
    data.woowoHouseDraft = app.globalData.woowoHouseDraft;

    data.type = data.woowoHouseDraft.type;
    data.imageUrls.fieldObj = data.woowoHouseDraft.imageUrls;
    data.location.fieldObj = data.woowoHouseDraft.location;
    data.facilities.fieldObj = data.woowoHouseDraft.facilities;
    data.description.fieldObj = data.woowoHouseDraft.description;
    data.rules.fieldObj = data.woowoHouseDraft.rules;
    data.price.fieldObj = data.woowoHouseDraft.price;
    data.contact.fieldObj = data.woowoHouseDraft.contact;

    /**
     *  For data
     */
    data.houseInfoFields = [data.location, data.facilities, data.description,
      data.rules, data.price, data.contact];

    data.uploadingList = [data.imageUrls].concat(data.houseInfoFields);

    /**
     *  For user
     */
    data.woowoUserInfo = app.globalData.woowoUserInfo;

    /**
     *  For page tilte
     */
    data.pageTitle = data.ifEditMode ? '编辑房源' : ('发布' + data.type + '房源');

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
    let that = this;
    let data = that.data;

    // check final data and also shortcut
    data.ifPostDataValid = that.postDataCheck().ifPass;

    for (let i = 0, len = data.uploadingList.length; i < len; ++i) {
      data.uploadingList[i].checkValidation();
    }

    that.setData(data);
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
    
    let pages = getCurrentPages();

    let indexPage = pages[pages.length - 2];

    // update from new adding
    app.globalData.woowoHouseDraft.updateFromPostPageData(that.data.uploadingList);
    // console.log(app.globalData.woowoHouseDraft);

    indexPage.setData({
      'backFrom': 'posting'
    })
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

  goToSpecificField: function (event) {
    let that = this;

    let fieldUrl = event.currentTarget.dataset.fieldUrl;
    let fieldName = event.currentTarget.dataset.fieldName;

    // clicking is seen as modified
    that.data[fieldName].ifModified = true;

    console.log(that.data[fieldName])
    wx.navigateTo({
      url: fieldUrl + '?fieldObj=' + JSON.stringify(that.data[fieldName].fieldObj)
        + '&type=' + that.data.type
    })
  },

  saveEachField: function (fieldName, fieldObj) {
    let that = this;
    let data = that.data;

    // compare if data changed
    let prevDataStr = JSON.stringify(data[fieldName].fieldObj);
    let currDataStr = JSON.stringify(fieldObj);

    console.log(data[fieldName].fieldObj == fieldObj);
    // data has not been changed
    if (prevDataStr == currDataStr) {
      // DO NOTHING
    }
    else {
      // update locally
      data[fieldName].fieldObj = fieldObj
      data.ifPostDataValid = that.postDataCheck().ifPass;
      that.setData(data);

      // update remotely
      that.uploadHouseInfo([fieldName]).then(res => {
        console.log(res);
      });
    }
    
  },

  uploadHouseInfo: function (fieldNameList) {
    return new Promise((resolve, reject) => {
      let that = this;
      let data = that.data;
      let houseId = data.woowoHouseDraft.houseId;
      let woowoUserInfo = data.woowoUserInfo;

      let numOfReq = fieldNameList.length;
      let numOfSuccessReq = 0;

      if (numOfReq == 0) {
        resolve({
          code: -1,
          errMsg: 'No fieldName provided'
        });
        return ;
      }

      for (let i = 0, len = fieldNameList.length; i < len; ++i) {
        // first set ifUploaded
        let currFieldName = fieldNameList[i];
        data[currFieldName].ifUploaded = false;

        (function (fieldName) {
          util.requestUpdateHouseInfo(houseId, fieldName, data[fieldName].fieldObj, woowoUserInfo)
          .then(res => {
            ++numOfSuccessReq;  // used to count
            if (res.code == 0) {
              console.log(fieldName + ' uploading succeed!');
              data[fieldName].ifUploaded = true;
            }

            // it means all uploding requests have finished
            if (numOfSuccessReq == numOfReq) {
              resolve({
                code: 0
              })
            }
          })
        })(currFieldName)
      }
    })
    
  },

  addNewPhotos: function (event) {
    let that = this;
    let data = that.data;

    let imageUrls = event.detail.imageUrls;
    let ifAllImageUploaded = event.detail.ifAllUploaded;

    data.imageUrls.fieldObj = imageUrls;
    data.imageUrls.ifStillImagesUploding = !ifAllImageUploaded;
    
    data.ifPostDataValid = that.postDataCheck().ifPass;

    that.setData(data);
  },

  deletePhotos: function (event) {
    let that = this;
    let data = that.data;

    data.imageUrls.fieldObj = event.detail.imageUrls;

    console.log(data.imageUrls);

    data.ifPostDataValid = that.postDataCheck().ifPass;

    that.setData(data);
  },

  nextStep: function () {
    let that = this;
    let data = that.data;

    let dataValificationResult = that.postDataCheck();

    // check if all data is verified
    if (dataValificationResult.ifPass == false) {
      if (data.imageUrls.ifValid == false) {
        wx.showModal({
          title: '提示',
          content: '未上传照片或照片上传中。 注意:当照片框右下角的提示点停止闪烁，则为上传成功。',
          showCancel: false
        })
      }

      else {
        wx.showToast({
          title: dataValificationResult.errMsg,
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }
    }

    // when all data if verified, uploading all of them first                                    
    else {
      that.finalUploadingAndPost();
    }
  },

  finalUploadingAndPost: function () {
    let that = this;
    let data = that.data;
    
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    let unuploadedList = that.getUnuploadedFieldNameList();

    // keep uploading
    if (unuploadedList.length > 0) {
      that.uploadHouseInfo(unuploadedList).then(res => {
        console.log('Uploaded all');
        that.finalUploadingAndPost();
      })
    }
    // post or update
    else {
      // only update
      if (data.ifEditMode) {
        wx.showToast({
          title: '更新成功！',
          icon: 'success',
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.hideToast();

              let pages = getCurrentPages();

              let prevPage = pages[pages.length - 2];

              prevPage.setData({
                ifReload: true
              })
              
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        })

        return;
      }

      // post
      let houseId = that.data.woowoHouseDraft.houseId;
      let fieldName = 'uploadTime';
      let fieldValue = new Date().getTime();
      let woowoUserInfo= that.data.woowoUserInfo;

      util.requestUpdateHouseInfo(houseId, fieldName, fieldValue, woowoUserInfo)
      .then(res => {

        wx.hideLoading();

        if (res.code == 0) {
          console.log('Posting succeeds!');

          if (res.data && res.data.companyDetail) {
            let companyDetail = res.data.companyDetail;

            if (typeof(companyDetail) == 'string') {
              companyDetail = JSON.parse(companyDetail);
            }

            if (companyDetail.name) {
              app.globalData.woowoHouseDraft.updateCompanyInfo(companyDetail, res.data.companyId)
            }
          }

          wx.redirectTo({
            url: '../afterPost/afterPost'
          })
        }
        else {
          wx.showToast({
            title: '发布失败，请稍后再试。',
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

  getUnuploadedFieldNameList: function () {
    let that = this;
    let data = that.data;

    let unuploadedList = [];

    for (let i = 0, len = data.uploadingList.length; i < len; ++i) {
      if (data.uploadingList[i].ifUploaded == false) {
        unuploadedList.push(data.uploadingList[i].fieldName);
      }
    }

    return unuploadedList;
  },  

  postDataCheck: function () {
    let that = this;
    let data = that.data;

    for (let i = 0, len = data.uploadingList.length; i < len; ++i) {
      data.uploadingList[i].checkValidation();
      if (data.uploadingList[i].ifValid == false) {
        return {
          ifPass: false,
          errMsg: data.uploadingList[i].errMsg
        }
      }
    }

    return {
      ifPass: true
    }
  }
})