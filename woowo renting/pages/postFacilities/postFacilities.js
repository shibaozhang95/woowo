const app = getApp();

// postFacilities.js
Page({

  /**
   * Page initial data
   */
  data: {
    indoor: [{
      title: '空调',
      iconUrl: '/statics/icons/icon_indoor_facilities_aircon.png',
      ifChosen: false
    },{
      title: '烤箱',
      iconUrl: '/statics/icons/icon_indoor_facilities_oven.png',
      ifChosen: false
    }, {
      title: '洗碗机',
      iconUrl: '/statics/icons/icon_indoor_facilities_dishwasher.png',
      ifChosen: false
    }, {
      title: '微波炉',
      iconUrl: '/statics/icons/icon_indoor_facilities_microwave.png',
      ifChosen: false
    }],

    furniture: [{
      title: '洗衣机',
      iconUrl: '/statics/icons/icon_furniture_washingmachine.png',
      ifChosen: false
    }, {
      title: '烘干机',
      iconUrl: '/statics/icons/icon_furniture_dryer.png',
      ifChosen: false
    }, {
      title: '梳妆台',
      iconUrl: '/statics/icons/icon_furniture_makeup.png',
      ifChosen: false
    }, {
      title: '冰箱',
      iconUrl: '/statics/icons/icon_furniture_frige.png',
      ifChosen: false
    }, {
      title: '床',
      iconUrl: '/statics/icons/icon_furniture_bed.png',
      ifChosen: false
    }, {
      title: '床头柜',
      iconUrl: '/statics/icons/icon_furniture_bedsidetable.png',
      ifChosen: false
    }, {
      title: '衣柜',
      iconUrl: '/statics/icons/icon_furniture_closet.png',
      ifChosen: false
    }, {
      title: '浴缸',
      iconUrl: '/statics/icons/icon_furniture_bathtub.png',
      ifChosen: false
    }, {
      title: '电视',
      iconUrl: '/statics/icons/icon_furniture_tv.png',
      ifChosen: false
    }, {
      title: '沙发',
      iconUrl: '/statics/icons/icon_furniture_sofa.png',
      ifChosen: false
    }, {
      title: '学习桌',
      iconUrl: '/statics/icons/icon_furniture_desk.png',
      ifChosen: false
    }, {
      title: '椅子',
      iconUrl: '/statics/icons/icon_furniture_chair.png',
      ifChosen: false
    }, {
      title: '书柜',
      iconUrl: '/statics/icons/icon_furniture_bookcase.png',
      ifChosen: false
    }, {
      title: '吹风机',
      iconUrl: '/statics/icons/icon_furniture_hairdryer.png',
      ifChosen: false
    }],

    public: [{
      title: '监控',
      iconUrl: '/statics/icons/icon_building_facilities_cctv.png',
      ifChosen: false
    }, {
      title: '健身房',
      iconUrl: '/statics/icons/icon_building_facilities_gym.png',
      ifChosen: false
    }, {
      title: 'BBQ',
      iconUrl: '/statics/icons/icon_building_facilities_bbq.png',
      ifChosen: false
    }, {
      title: '游泳池',
      iconUrl: '/statics/icons/icon_building_facilities_pool.png',
      ifChosen: false
    }, {
      title: '空中花园',
      iconUrl: '/statics/icons/icon_building_facilities_garden.png',
      ifChosen: false
    }, {
      title: '桑拿房',
      iconUrl: '/statics/icons/icon_building_facilities_steaming.png',
      ifChosen: false
    }, {
      title: '瑜伽室',
      iconUrl: '/statics/icons/icon_building_facilities_yoga.png',
      ifChosen: false
    }, {
      title: '休闲娱乐',
      iconUrl: '/statics/icons/icon_building_facilities_entertainment.png',
      ifChosen: false
    }],

    nearby: [{
      title: '超市',
      iconUrl: '/statics/icons/icon_nearby_supermarket.png',
      ifChosen: false
    }, {
      title: '电车站',
      iconUrl: '/statics/icons/icon_nearby_tramstation.png',
      ifChosen: false
    }, {
      title: '火车站',
      iconUrl: '/statics/icons/icon_nearby_trainstation.png',
      ifChosen: false
    }, {
      title: '巴士站',
      iconUrl: '/statics/icons/icon_nearby_busstation.png',
      ifChosen: false
    }, {
      title: '加油站',
      iconUrl: '/statics/icons/icon_nearby_gasstation.png',
      ifChosen: false
    }, {
      title: '咖啡厅',
      iconUrl: '/statics/icons/icon_nearby_coffee.png',
      ifChosen: false
    }, {
      title: '健身房',
      iconUrl: '/statics/icons/icon_nearby_gym.png',
      ifChosen: false
    }, {
      title: '图书馆',
      iconUrl: '/statics/icons/icon_nearby_library.png',
      ifChosen: false
    }, {
      title: '公园',
      iconUrl: '/statics/icons/icon_nearby_garden.png',
      ifChosen: false
    }, {
      title: '篮球馆',
      iconUrl: '/statics/icons/icon_nearby_basketballcourt.png',
      ifChosen: false
    }, {
      title: '足球场',
      iconUrl: '/statics/icons/icon_nearby_footballfield.png',
      ifChosen: false
    }, {
      title: '医院',
      iconUrl: '/statics/icons/icon_nearby_hospital.png',
      ifChosen: false
    }],

    ifAllDataPass: false,

    bottomGapHeight: Number,
    ifHasFurnitureChosen: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    // FOR LAYOUT
    data.bottomGapHeight = app.globalData.bottomGapHeight;

    // INITIALISE DATA
    let initData = JSON.parse(options.fieldObj);
    let fieldsName = ['indoor', 'furniture', 'public', 'nearby'];

    for (let i = 0, len = fieldsName.length; i < len; ++i) {
      let fieldName = fieldsName[i];
      let chosenList = initData[fieldName].split(';');
      for (let k = 0, kLen = chosenList.length; k < kLen; ++k) {
        for (let p = 0, pLen = data[fieldName].length; p < pLen; ++p) {
          if (chosenList[k] == data[fieldName][p].title) {
            data[fieldName][p].ifChosen = true;
          }
        }
      }
    }

    // for the default furniture trigger block
    if (initData['furniture'].length > 0) {
      data.ifHasFurnitureChosen = true;

    }

    data.ifAllDataPass = that.facilitiesDataCheck(that.converData()).ifPass;

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
    console.log('unload facilities');

    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    postPage.saveEachField('facilities', that.converData());
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

  furnitureClear: function (event) {
    let that = this;

    let value = event.detail.value;

    // only
    if (value == true) return;

    let furniture = that.data.furniture;

    for (let i = 0, len = furniture.length; i < len; ++i) {
      furniture[i].ifChosen = false;
    } 

    that.setData({
      furniture: furniture
    })
  },

  chooseIcon: function (event) {
    let that = this;
    let data = that.data;

    let chosenField = event.currentTarget.dataset.chosenField;
    let index = event.currentTarget.dataset.chosenIndex;

    // let targetField = that.data[chosenField];

    // targetField[index].ifChosen = !targetField[index].ifChosen

    data[chosenField][index].ifChosen = !data[chosenField][index].ifChosen;

    data.ifAllDataPass = that.facilitiesDataCheck(that.converData()).ifPass;

    that.setData(data);
  },

  nextStep: function () {
    let that = this;

    let convertedData = that.converData();

    // verdificate the data first
    let dataResult = that.facilitiesDataCheck(convertedData);

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

  facilitiesDataCheck: function (data) {
    if (data.indoor.length == 0 
      && data.furniture.length == 0
      && data.public.length == 0
      && data.nearby.length == 0) {
      return {
        ifPass: false,
        errMsg: '你什么都没有选哦~ 添加相关设施能让吸引更多用户关注此房源。'
      }
    }
    
    else {
      return {
        ifPass: true
      }
    }
  },

  goToNextPage: function () {
    let pages = getCurrentPages();

    let postPage = pages[pages.length - 2];

    let fieldObjForNextPage = postPage.data['description'].fieldObj;

    // next is the post description
    let type = postPage.data['type'];

    wx.redirectTo({
      url: '../postDescription/postDescription?fieldObj=' 
        + JSON.stringify(fieldObjForNextPage) + '&type=' + type
    })
  },

  dataCheck: function () {

  },

  converData: function () {
    let that = this;

    let fieldObj = {};

    let fields = ['indoor', 'furniture', 'public', 'nearby']

    for (let k = 0, kLen = fields.length; k < kLen; ++k) {
      fieldObj[fields[k]] = [];
      for (let i = 0, len = that.data[fields[k]].length; i < len; ++i) {
        if (that.data[fields[k]][i].ifChosen) {
          fieldObj[fields[k]].push(that.data[fields[k]][i].title)
        }
      }
    }

    return {
      indoor: fieldObj['indoor'].join(';'),
      furniture: fieldObj['furniture'].join(';'),
      public: fieldObj['public'].join(';'),
      nearby: fieldObj['nearby'].join(';')
    }
    
  }
})