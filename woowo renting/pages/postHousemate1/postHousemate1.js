const app = getApp();
import OneArea from '../../utils/area';
import woowoHousemate from '../../utils/woowoHousemate';

// pages/postHousemate1/postHousemate1.js
Page({

  /**
   * Page initial data
   */
  data: {
    bottomGapHeight: Number,
    scrollListHeight: Number,

    typesOpts: ['合租', '整租', '短租'],
    rentTypesOpts: ['房屋', '公寓', '工作室'],
    ifCookOpts: ['是', '否'],
    ifSmokeOpts: ['是', '否'],
    ifPetsOpts: ['是', '否'],

    type: [],
    rentType: [],
    ifCook: [],
    ifSmoke: [],
    ifPet: [],
    description: '',

    priceLow: Number,
    priceHigh: Number,

    ifPostDataValid: false,
    imageUrls: '',
    ifStillImageUploading: false,
    availableDate: Number,
    availableDateStr: '',

    areas: [],
    areasFromSearchPage: '',
    areasShortcut: '',

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

    let addingPhotosHeight = 125;
    let confrimBtnHeight = 51;

    data.scrollListHeight = windowHeight 
      - data.bottomGapHeight - addingPhotosHeight - confrimBtnHeight;
    if (ifCustomNavigation) {
      data.scrollListHeight -= (defaultNavBarHeight + statusBarHeight)
    }

    // i dont know
    // data.scrollListHeight -= 20;

    /**
     *  Edit initialization
     */
    data.woowoHousemate = app.globalData.woowoHousemateDraft;

    if (options.editMode) {
      console.log('edit')
      data.ifEditMode = true;

      data.imageUrls = data.woowoHousemate.imgList;
      console.log(data.imageUrls)

      data.availableDate = data.woowoHousemate.availableDate;
      let aDate = new Date(data.availableDate);
      let currentDate = aDate.getDate();
      let month = aDate.getMonth();
      let year = aDate.getFullYear();
      data.availableDateStr = year + '-' + (month + 1) + '-' + currentDate;

      data.areas = data.woowoHousemate.getAreasList();
      that.updateAreasShortcut(data.areas);

      data.priceLow = data.woowoHousemate.priceLow;
      data.priceHigh = data.woowoHousemate.priceHigh;

      data.type = data.woowoHousemate.type.split(';');
      data.rentType = data.woowoHousemate.rentType.split(';');

      data.ifCook = [data.woowoHousemate.ifCook ? '是' : '否'];
      data.ifSmoke = [data.woowoHousemate.ifSmoke ? '是' : '否'];
      data.ifPet = [data.woowoHousemate.ifPet ? '是' : '否'];

      data.description = data.woowoHousemate.description;
    }

    console.log(data.woowoHousemate);

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
    let that = this;
    let data = that.data;

    if (data.areasFromSearchPage) {
      let unformattedAreas = JSON.parse(data.areasFromSearchPage);
      data.areas = [];

      for (let i = 0, len = unformattedAreas.length; i < len; ++i) {
        data.areas.push(new OneArea(
          unformattedAreas[i].locality,
          unformattedAreas[i].state,
          unformattedAreas[i].country,
          unformattedAreas[i].postCode));
      }
    }

    data.areasShortcut = that.updateAreasShortcut(data.areas);
    
    // check data
    data.ifPostDataValid = that.dataCheck().ifPass;

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

  goToPostHousemate2: function () {
    let that = this;
    let data = that.data;

    let dataResult = that.dataCheck();

    // for test
    // dataResult.ifPass = true;

    if (dataResult.ifPass == true) {
      that.updateWoowoHousemateInfo();

      wx.navigateTo({
        url: '/pages/postHousemate2/postHousemate2' 
          + (data.ifEditMode ? '?editMode=true' : '')
      })
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

  updateWoowoHousemateInfo: function () {
    let that = this;
    let data = that.data;

    data.woowoHousemate.updateWithFieldName(
      'imgList', data.imageUrls
    );
    data.woowoHousemate.updateWithFieldName(
      'availableDate', data.availableDate
    )
    
    let areasStrLs = []
    for (let i = 0, len = data.areas.length; i < len; ++i) {
      areasStrLs.push(data.areas[i].formatAddrForHousemate())
    }
    data.woowoHousemate.updateWithFieldName(
      'area', areasStrLs.join(';')
    )

    data.woowoHousemate.updateWithFieldName(
      'priceLow', data.priceLow
    )
    data.woowoHousemate.updateWithFieldName(
      'priceHigh', data.priceHigh
    )

    data.woowoHousemate.updateWithFieldName(
      'type', data.type.join(';')
    )
    data.woowoHousemate.updateWithFieldName(
      'rentType', data.rentType.join(';')
    )

    data.woowoHousemate.updateWithFieldName(
      'ifCook', data.ifCook == '是' ? '1' : '0'
    )
    data.woowoHousemate.updateWithFieldName(
      'ifSmoke', data.ifSmoke == '是' ? '1' : '0'
    )
    data.woowoHousemate.updateWithFieldName(
      'ifPet', data.ifPet == '是' ? '1' : '0'
    )

    data.woowoHousemate.updateWithFieldName(
      'description', data.description
    )
  },

  updatePhotos: function (event) {
    let that = this;
    let data = that.data;

    data.imageUrls = event.detail.imageUrls;
    data.ifStillImageUploading = !event.detail.ifAllUploaded;

    // check data
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  availableDateChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let value = event.detail.result.value;
    let type = event.detail.result.type;
    let range = event.detail.result.range;

    data.availableDate = new Date(value).getTime();

    // check data
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  selectionChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let selectionType = event.detail.result.selectionType;
    let value = event.detail.result.value;

    data[fieldName] = value;

    // check data
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  descriptionChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let type = event.detail.type;
    let value = event.detail.value;

    data[fieldName] = value;

    // check data
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  goToAreasSearch: function () {
    let that = this;
    let data = that.data;

    let areasStr = JSON.stringify(data.areas);

    wx.navigateTo({
      url: '/pages/areasSearch/areasSearch?areas=' + areasStr
    })
  },

  updateAreasShortcut: function (areasArry) {
    let localityArry = [];

    for (let i = 0, len = areasArry.length; i < len; ++i) {
      localityArry.push(areasArry[i].locality);
    }

    return localityArry.join(',');
  },

  priceChanged: function (event) {
    let that = this;
    let data = that.data;

    let fieldName = event.currentTarget.dataset.fieldName;
    let value = event.detail.value;

    data[fieldName] = Number(value);

    // check data
    data.ifPostDataValid = that.dataCheck().ifPass;

    that.setData(data);
  },

  dataCheck: function () {
    let that = this;
    let data = that.data;

    let checkResult = {
      ifPass: true,
      errMsg: ''
    }

    if (!(data.availableDate >= 0)) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'入住时间' 为必填字段。"  
    }

    else if (data.areas.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'求租地点' 为必填字段。"  
    }

    else if (!(data.priceLow >= 0)) {
      checkResult.ifPass = false,
      checkResult.errMsg = "请输入有效的' 最低价位'。"  
    }

    else if (!(data.priceHigh >= 0)) {
      checkResult.ifPass = false,
      checkResult.errMsg = "请输入有效的' 最高价位'。"  
    }

    else if (!(data.priceHigh >= data.priceLow)) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'最高价位' 必须要大于或等于 '最低价位'。"  
    }

    else if (data.type.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'求租类型' 为必选字段。"  
    }

    else if (data.rentType.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'所需户型' 为必选字段。"  
    }

    else if (data.ifCook.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'是否做饭' 为必选字段。"  
    }

    else if (data.ifSmoke.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'是否抽烟' 为必选字段。"  
    }

    else if (data.ifPet.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "'是否养宠物' 为必选字段。"  
    }

    else if (data.description.length == 0) {
      checkResult.ifPass = false,
      checkResult.errMsg = "请输入' 想说的话'。"  
    }

    else if (data.ifStillImageUploading == true) {
      checkResult.ifPass = false,
      checkResult.errMsg = "图片上传中，请稍等。"
    }

    return checkResult;
  }
})