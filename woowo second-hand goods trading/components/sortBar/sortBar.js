const util = require('../../utils/util');
const areas = require('../../utils/areas');
const app = getApp();

Component({
  properties: {
    posTop: {
      type: Number,
      value: 50
    },
    currentMainCat: {
      type: String,
      value: ""
    },
    initializeFilter: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        let that = this;
        that.clearAllFilters();
        that.submitChanges();
      }
    }
  },

  data: {
    choosingMainCat: String,
    choosingSubCat: String,  // as default
    confirmedMainCat: String,
    confirmedSubCat: String,
    chosenCatTxt: "分类",

    ifShowCatagory: false,
    ifShowFilter: false,
    ifShowPriceSort: false,

    priceSortWay: ["价格", "从低到高", "从高到低"],
    currentPriceSortWay: 0,

    screenWidth: Number,
    screenHeight: Number,
    navBarHeight: Number,
    bottomGapHeight: 0,
    sortBarHeight: 30,
    searchBarHeight: 47,

    catObj: {
      "二手书籍": ["金融类", "医护类", "IT类", "教育类", "法律类", "艺术类", "工科类", "漫画", "小说", "其他", "全部"],
      "家具电器": ["沙发", "柜子", "床", "桌椅板凳", "灯具照明", "电视", "洗衣机", "冰箱", "厨房电器", "其他家居家具", "其他家具电器", "全部"],
      "3C数码": ["手机", "电脑", "相机", "游戏机", "手机配件", "电脑配件", "相机镜头/配件", "游戏机配件", "其他", "全部"],
      "动植物": ["植物", "猫咪", "狗狗", "兔子", "其他", "全部"],
      "服饰搭配": ["服装", "包包", "鞋子", "饰品", "服饰配件", "其他", "全部"],
      "护肤美妆": ["洁面", "防晒", "护肤", "唇部", "彩妆", "香水", "口服", "指甲彩妆", "其他", "全部"],
      "生活用品": ["厨具", "办公用品", "保健护理", "其他", "全部"],
      "二手车": ["汽车", "自行车", "电动车", "摩托车", "车配件", "其他", "全部"],
      "生活服务": ["搬家", "清洁", "娱乐", "接送", "美容", "其他", "全部"],
      "闲品互换": ["小玩具置换", "其他", "全部"],
      "其他": ["其他"]
    },

    otherArea: "",

    postDate: {
      current: "",
      list: ["最新", "三天内", "七天内", "两周内"]
    },
    conditionLevel: {
      current: [],
      // list: ["全新", "九成新", "五成新"],
      list: [{
        value: "全新",
        ifChosen: false
      }, {
        value: "几乎全新",
        ifChosen: false
      }, {
        value: "成色较新",
        ifChosen: false
      }, {
        value: "成色一般",
        ifChosen: false
      }, {
        value: "成色旧",
        ifChosen: false
      }]
    },
    shipWay: {
      current: [],
      // list: ["自取", "邮寄"],
      list: [{
        value: "自取",
        ifChosen: false
      }, {
        value: "邮寄",
        ifChosen: false
      }]
    },
    currentArea: {
      value: "",
      ifChosen: false
    },
    popAreas: {
      current: [],
      list: []
    },
    lowestPrice: Number,
    highestPrice: Number,

    // FOR ANIMATION
    catagoryAnimation: {},
    filterAnimation: {},

    // rpx
    MAINCATHEIGHT: 66,
    MAINCATNUMBER: 11,
    SUBCATHEIGHT: 64,
    FILTERWIDTH: 560
  },

  methods: {
    chooseMainCat: function (event) {
      let mainCat = event.currentTarget.dataset.mainCatItem;

      let that = this;

      that.setData({
        choosingMainCat: mainCat,
        // when re-choose a main cat, re-set sub cat
        choosingSubCat: ""
      });

      // add animation here
      let minCatHeight = that.data.MAINCATHEIGHT * that.data.MAINCATNUMBER;
      let subHeight = that.data.catObj[mainCat].length * that.data.SUBCATHEIGHT;
      that.triggeCatagoryAnimation(subHeight > minCatHeight ? subHeight : minCatHeight);

      console.log(that.data.catObj[mainCat])
    },

    chooseSubCat: function (event) {
      let that = this;
      let subCat = event.currentTarget.dataset.subCatItem;
      // that.setData({
      //   currentSubCat: that.data.subCat[that.data.currentMainCat][index],
      //   confirmedMainCat: that.data.mainCat[that.data.currentMainCat],
      //   confirmedSubCat: that.data.subCat[that.data.currentMainCat][index]
      // })
      that.setData({
        choosingSubCat: subCat,
        confirmedMainCat: that.data.choosingMainCat,
        confirmedSubCat: subCat
      })
      // after chose a subcat, trigger off catagory block
      that.updateChosenCat();
      that.triggerCatagory();

      that.submitChanges();
    },

    updateChosenCat: function () {
      let that = this;
      let data = that.data;
      let newCatTxt = "";
      if (data.confirmedMainCat == '其他') {
        newCatTxt = '其他'
      }
      else if (data.confirmedSubCat == '其他') {
        newCatTxt = '其他' + data.confirmedMainCat;
      }
      else if (data.confirmedSubCat == '全部' || data.confirmedSubCat == '') {
        newCatTxt = data.confirmedMainCat;
      }
      else {
        newCatTxt = data.confirmedSubCat;
      }

      that.setData({
        chosenCatTxt: newCatTxt
      })
    },
    

    chooseOneFilter: function (event) {
      let that = this;
      let target = event.currentTarget.dataset.section;
      let index = event.currentTarget.dataset.index;
      
      // tap the same one
      let newValue = "";

      if (that.data[target].current == that.data[target].list[index]) {
        newValue = "";
      }
      else {
        newValue = that.data[target].list[index];
      }

      // console.log(data);

      that.setData({
        [target + '.current']: newValue
      });
      // console.log(that.data)
    },

    chooseMultFilter: function (event) {
      let that = this;
      let target = event.currentTarget.dataset.section;
      let index = event.currentTarget.dataset.index;

      let data = that.data[target];
      data.list[index].ifChosen = !data.list[index].ifChosen;

      let newCurrent = [];
      for (let i = 0, len = data.list.length; i < len; ++i) {
        if (data.list[i].ifChosen) {
          newCurrent.push(data.list[i].value);
        }
      }
      that.setData({
        [target + '.list']: data.list,
        [target + '.current']: newCurrent
      })
      
    },

    multChoseDetect: function () {
      console.log('this is multchose detact')
      return true;
    },

    resetFilter: function () {
      let that = this;

      let conditionLevelList = that.data.conditionLevel.list;
      for (let i = 0, len = conditionLevelList.length; i < len; ++i) {
        conditionLevelList[i].ifChosen = false;
      }
      let shipWayList = that.data.shipWay.list;
      for (let i = 0, len = shipWayList.length; i < len; ++i) {
        shipWayList[i].ifChosen = false;
      }
      let popAreasList = that.data.popAreas.list;
      for (let i = 0, len = popAreasList.length; i < len; ++i) {
        popAreasList[i].ifChosen = false;
      }

      that.setData({
        ["otherArea"]: "",
        ["postDate.current"]: "",
        ["lowestPrice"]: Number,
        ["highestPrice"]: Number,
        ["conditionLevel.list"]: conditionLevelList,
        ["conditionLevel.current"]: [],
        ["shipWay.list"]: shipWayList,
        ["shipWay.current"]: [],
        ["popAreas.list"]: popAreasList,
        ["popAreas.current"]: [],

        ["currentArea.value"]: "",
        ["currentArea.ifChosen"]: false
      })
      
    },

    confirmFilter: function () {
      let that = this;

      that.triggerFilter();
      that.submitChanges();
    },

    triggerCatagory: function () {
      let that = this;

      if (that.data.ifShowCatagory) {
        // turn off
        that.triggeCatagoryAnimation(0);
        that.triggeFilterAnimation(-that.data.FILTERWIDTH);
        that.setData({
          ifShowCatagory: false,
          ifShowFilter: false,
          ifShowPriceSort: false
        })
      }

      else {
        // turn on
        that.setData({
          ifShowCatagory: true,
          ifShowFilter: false,
          ifShowPriceSort: false
        })
        that.triggeCatagoryAnimation(that.data.MAINCATHEIGHT * that.data.MAINCATNUMBER);
        that.triggeFilterAnimation(-that.data.FILTERWIDTH);
      }
      
    },

    triggerFilter: function () {
      let that = this;

      if (that.data.ifShowFilter) {
        // turn off
        that.triggeFilterAnimation(-that.data.FILTERWIDTH);
        that.triggeCatagoryAnimation(0);
        that.setData({
          ifShowFilter: false,
          ifShowCatagory: false,
          ifShowPriceSort: false
        })
      }
      else {
        // turn on
        that.setData({
          ifShowFilter: true,
          ifShowCatagory: false,
          ifShowPriceSort: false
        });
        that.triggeFilterAnimation(0);
        that.triggeCatagoryAnimation(0);
      }
    },

    triggerOnPriceSortWay: function () {
      let that = this;

      if (that.data.ifShowPriceSort) return ;

      that.setData({
        ifShowFilter: false,
        ifShowCatagory: false,
        ifShowPriceSort: true
      })
    },

    switchPriceSortWay: function () {
      let that = this;
      that.triggerOnPriceSortWay();
      that.setData({
        currentPriceSortWay: (that.data.currentPriceSortWay + 1) % 3
      });

      that.submitChanges();
    },

    inputOtherArea: function (event) {
      let that = this;
      that.setData({
        otherArea: event.detail.value
      });
    },
    inputLowestPrice: function (event) {
      let that = this;
      that.setData({
        lowestPrice: event.detail.value.replace(/[^0-9]/ig, "")
      })
    },
    inputHighestPrice: function (event) {
      let that = this;
      that.setData({
        highestPrice: event.detail.value.replace(/[^0-9]/ig, "")
      })
    },

    submitChanges: function () {
      let that = this;
      let filteredAreas = that.data.popAreas.current;
      if (that.data.otherArea) filteredAreas.push(that.data.otherArea);
      if (that.data.currentArea.ifChosen) filteredAreas.push(that.data.currentArea.value)

      that.triggerEvent('changeFilters', {
        mainCat: that.data.confirmedMainCat,
        subCat: that.data.confirmedSubCat,
        priceSortWay: that.data.priceSortWay[that.data.currentPriceSortWay],
        areas: filteredAreas,
        lowestPrice: parseInt(that.data.lowestPrice),
        highestPrice: parseInt(that.data.highestPrice),
        postDate: that.data.postDate.current,
        conditionLevel: that.data.conditionLevel.current,
        shipWay: that.data.shipWay.current
      })
    },

    clearAllFilters: function () {
      let that = this;
      that.setData({
        choosingMainCat: String,
        choosingSubCat: String,  // as default
        confirmedMainCat: String,
        confirmedSubCat: String,

        ifShowCatagory: false,
        ifShowFilter: false,
        ifShowPriceSort: false,
        chosenCatTxt: "分类",

        currentPriceSortWay: 0,
      });
      that.resetFilter();
    },

    getCurrentArea: function () {
      let that = this;
      let currentArea = that.data.currentArea;

      if (currentArea.ifChosen) {
        currentArea.ifChosen = false;
        that.setData({
          currentArea: currentArea
        })
      }
      else if (!currentArea.ifChosen && currentArea.value != "") {
        currentArea.ifChosen = true;
        that.setData({
          currentArea: currentArea
        })
      }
      else if (currentArea.value == "") {
        wx.showLoading({title: '定位中...', mask: true});
        util.getCurrentLocation()
        .then(res => {
          wx.hideLoading();
          if (res.code == 0 && res.data.area != 'Others') {
            currentArea.ifChosen = true;
            currentArea.value = res.data.area
          }
          else {
            currentArea.ifChosen = false;
            wx.showToast({
              // title: res.errMsg ? res.errMsg : '当前地区无商品',
              title: '附近没有商品',
              mask: true,
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  wx.hideToast()
                }, 2000)
              }
            })
          }
          that.setData({
            currentArea: currentArea
          })
        })
      }
    },

    /***************************************************
                    FOR ANIMATION
    ****************************************************/
    triggeCatagoryAnimation: function (height) {
      let that = this;

      that.catagoryAnimation.height(height + 'rpx').step();

      that.setData({
        catagoryAnimation: that.catagoryAnimation.export()
      })
    },

    triggeFilterAnimation: function (right) {
      let that = this;

      that.filterAnimation.right(right + 'rpx').step();

      that.setData({
        filterAnimation: that.filterAnimation.export()
      })
    },

    /***************************************************
                    FOR MULTIPLE AREAS
    ****************************************************/
    loadPopularAreas: function () {
      let that = this;

      let stateCn = app.globalData.state;

      let popAreas = [];

      let stateABR = areas.statesCnToAbr(stateCn);

      if (stateABR != "") {
        popAreas = areas[stateABR].popularAreas.split(',');
      }
      else {
        popAreas = ["Melbourne", "Sydney"];
      }

      console.log(popAreas)
      let areasList = [];

      for (let i = 0, len = popAreas.length; i < len; ++i) {
        areasList.push({
          value: popAreas[i],
          ifChosen: false
        })
      }

      that.setData({
        'popAreas.list': areasList
      })
    }
  },

  ready: function () {
    let that = this;

    that.loadPopularAreas();

    that.catagoryAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.filterAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    
    that.setData({
      screenWidth: app.globalData.screenWidth,
      screenHeight: app.globalData.screenHeight,
      bottomGapHeight: app.globalData.bottomGapHeight,
      navBarHeight: app.globalData.statusBarHeight + app.globalData.defaultNavBarHeight,
    });

    if (that.data.currentMainCat) {
      that.setData({
        confirmedMainCat: that.data.currentMainCat,
        confirmedSubCat: "全部"   // enter from menu
      });

      that.updateChosenCat();
    }
  }
})