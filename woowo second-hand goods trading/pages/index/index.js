//index.js
const api = require('../../services/api.js');
const user = require('../../services/user.js');
const util = require('../../utils/util.js');
const AREAS = require('../../utils/areas.js');

const app = getApp();
  
Page({
  data: {
    scene: "",
    
    contentId: 0,
    // 0 == hottest, 1 == nearest
    area: "",

    hottestGoods: {
      ifLoading: false,
      ifReachBottom: false,
      ifNothing: false,

      ifShowAll: false,
      ifReachBottom: false,
      previousPage: 0,
      nextPage: app.globalData.loadItems,
      list: []
    },

    nearestGoods: {
      ifLoading: false,
      ifReachBottom: false,
      ifNothing: false,

      ifShowAll: false,
      ifReachBottom: false,
      previousPage: 0,
      nextPage: app.globalData.loadItems,
      list: []
    },

    newList: [],
    currentTopPos: 0,

    showLoginAuth: false,

    ifHotestReachBottom: false,
    ifNearestReachBottom: false,

    // for search 
    keyword: "",

    // for notification 
    unreadNotificationAccount: 0,

    // FOR MULTIPILE AREAS
    states: ["不限地区", "维多利亚州", "新南威尔士州", "堪培拉", "南澳大利亚州", "昆士兰州", "西澳大利亚州", "塔斯马尼亚州", "北领地"],
    statesValue: -1,

    // For banners
    ads: [
      {
        imgUrl: '/statics/images/banner_page_mofaguanjia.png',
        src: '/pages/activities/activities',
        openType: 'page',
        params: 'qingjie'
      }, 
      {
        imgUrl: '/statics/images/banner_article_merchant.png',
        src: '/pages/recruitment/recruitment',
        openType: 'page'
      }, 
      // {
      //   imgUrl: '/statics/images/banner_miniprogram_yangtuo.png',
      //   src: 'pages/login/login',
      //   openType: 'miniProgram',
      //   params: 'gofrom=wx8d5c44e08ac1dc3e',
      //   appId: 'wxc3e43cb4472891ef'
      // },
      {
        imgUrl: '/statics/images/banner_goto_zufang.png',
        src: 'pages/index/index',
        openType: 'miniProgram',
        appId: 'wx7bbbffe2b11138f8'
      },
      {
        imgUrl: '/statics/images/img_about_us@2x.png',
        src: '/pages/aboutUs/aboutUs',
        openType: 'page'
      }
    ],

  },

  clickOnBanner: function (event) {
    let that = this;
    let item = event.currentTarget.dataset.item;

    // this is for analysis
    if (item.params) {
      that.sourceAnalysis(item.params);
    }

    if (item.openType == 'miniProgram') {
      wx.navigateToMiniProgram({
        appId: item.appId,
        path: item.src + (item.params ? ('?' + item.params) : ''),
        envVersion: 'release',
        success: () => {
          console.log('跳转成功');
        },
        fail: () => {
          console.log('用户拒绝跳转');
        }
      })
    }
    else if (item.openType == 'page') {
      wx.navigateTo({
        url: item.src
      })
    }
    else if (item.openType == 'article') {
      wx.navigateTo({
        url: '/pages/article/article?url=' + item.src
      })
    }
    else if (item.openType == 'preview') {
      wx.previewImage({
        current: item.src,
        urls: [item.src]
      })
    }
  },

  statesChange: function (event) {
    let that = this;

    // Globally
    app.globalData.state = that.data.states[event.detail.value];
    
    // Locally
    that.setData({
      statesValue: event.detail.value,
      showLoginAuth: false
    })

    that.refreshGoodsList(that.data.contentId);
    AREAS.saveStateLocally(that.data.states[that.data.statesValue]);
  },

  cancelStatesChoose: function () {
    let that = this;
    if (that.data.statesValue < 0 || that.data.statesValue >= that.data.states.length) {
      that.remindToChooseState();
    }
  },

  remindToChooseState: function () {
    let that = this;

    wx.showModal({
      title: '提示',
      content: '从左上角选择地区后，才能针对性的为你服务哦~ 默认为不限地区。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#f6b62d',
      success: (result) => {
        if(result.confirm){
          that.statesChange({detail: { value: 0}})
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  goToNotify: function () {
    let that = this;
    that.setData({
      unreadNotificationAccount: 0
    });

    wx.navigateTo({
      url: '../../pages/myMessages/myMessages'
    })
  },

  goToActivityXmas: function (event) {

    var url = event.currentTarget.dataset.url;
 
    wx.navigateTo({
      url: '../activityXmas/activityXmas?url=' + url
    })
  },

  onShareAppMessage: function () {
    return {
      title: 'Woowo 二手市场',
      path: '/pages/index/index'
    }
  },

  goToSpecificGoods: function (goodsId, ifFromShare) {
    let url = '../goodsDetail/goodsDetail?goodsId=' + goodsId
    url += (ifFromShare ? '&fromShare=true' : '');
    wx.navigateTo({
      url: url
    })
  },

  goToSpecificShop: function (shopId) {
    wx.navigateTo({
      url: '../homepage/homepage?ifOnlyShopId=true&shopId=' + shopId
    })
  },

  onLoad: function (option) {
    let that = this;
    wx.hideTabBar();

    console.log(option);

    // source analysis
    if (option.source) {
      this.sourceAnalysis(option.source);
    }

    // FOR QRCode
    if (option.scene) {
      that.data.scene = option.scene;
      console.log('Enter from QRCode');
    }

    if (option.goodsId) {
      that.data.scene = option.goodsId;
      console.log('Enter from sharing');
    }

    // FOR MULTIPLE AREAS
    if (app.globalData.state != '') {
      for (let i = 0, len = that.data.states.length; i < len; ++i) {
        if (app.globalData.state == that.data.states[i]) {
          that.setData({
            statesValue: i
          })
        }
      }
    }

    user.checkIfRegistered().then(res => {
      if (res.ifLogedin) {
        
        // Go to Specific Goods / shops
        if (that.data.scene) {
          let scene = that.data.scene;

          if (scene.includes('shopId')) {
            let shopId = decodeURIComponent(scene).split('=')[1];

            that.goToSpecificShop(shopId);
          }
          else {
            that.goToSpecificGoods(that.data.scene, true);
          }
          
        }
        
        // Update user information and request goods at the same time
        that.requestHottestGoods();
      }
      else {
        that.setData({
          showLoginAuth: true
        })
      }
    })
    
    // wx.hideLoading();
  },

  onReachBottom: function () {
    let that = this;

    // for hottest goods
    if (that.data.contentId == 0) {
      if (!that.data.hottestGoods.ifReachBottom) {
        
        that.requestHottestGoods();
      }
    }

    // for nearest goods
    if (that.data.contentId == 1) {
      if (!that.data.nearestGoods.ifReachBottom && that.data.area != "") {

        that.requestNearestGoods();
      };
    }
  },

  onPullDownRefresh: function() {
    let that = this;
    console.log('pull down refresh')
    that.refreshGoodsList(that.data.contentId);

    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  refreshGoodsList: function (contentId) {
    let that = this;

    // request for hottest goodslist
    if (contentId == 0) {
      // initialize first
      that.setData({
        showLoginAuth: false,
        ['hottestGoods.ifShowAll']: false,
        ['hottestGoods.ifReachBottom']: false,
        ['hottestGoods.previousPage']: 0,
        ['hottestGoods.nextPage']: app.globalData.loadItems,
        ['hottestGoods.list']: []
      });

      that.requestHottestGoods();
    }

    // request for nearest goodslist
    else {
      if (that.data.area == "" || that.data.area == "Others") {
        wx.showToast({
          title: '无相关数据',
          mask: true,
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 3000)
          }
        })
      }
      else {
        // initialize first
        that.setData({
          ['nearestGoods.ifShowAll']: false,
          ['nearestGoods.ifReachBottom']: false,
          ['nearestGoods.previousPage']: 0,
          ['nearestGoods.nextPage']: app.globalData.loadItems,
          ['nearestGoods.list']: []
        });
        that.requestNearestGoods();
      }
    }
  },

  requestNearestGoods: function () {
    let that = this;
    let data = that.data;

    // if no area has been chosen
    if (!that.data.states[that.data.statesValue]) {
      that.remindToChooseState();
      return;
    }

    // if already show all the data, return
    if (data.nearestGoods.ifReachBottom || data.nearestGoods.ifLoading) return;

    data.nearestGoods.ifLoading = true;
    data.nearestGoods.ifReachBottom = false;
    data.nearestGoods.ifNothing = false;
    data.showLoginAuth = false;
    
    that.setData(data);
    
    let formattedFilter = util.formatData.filter(data.nearestGoods.previousPage, data.nearestGoods.nextPage, {
      'areas': [data.area]
    })

    util.requestFilteredGoods(formattedFilter)
    .then(res => {
      data.nearestGoods.ifLoading = false;

      if (res.code == 0) {
        data.nearestGoods.list = data.nearestGoods.list.concat(res.data);
        data.nearestGoods.previousPage += res.data.length;

        if (data.nearestGoods.list.length == 0) {
          data.nearestGoods.ifNothing = true;
          data.nearestGoods.ifReachBottom = false;
        }
        else if (res.data.length < data.nearestGoods.nextPage) {
          data.nearestGoods.ifReachBottom = true;
          data.nearestGoods.ifNothing = false;
        }
        
      }
      else {
        wx.showToast({
          title: '出错了',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
      }

      that.setData(data);
    })
  },

  requestHottestGoods: function () {
    let that = this; 
    let data = that.data;

    // if no area has been chosen
    if (!that.data.states[that.data.statesValue]) {
      that.remindToChooseState();
      return;
    }

    // if already show all the data, return
    if (data.hottestGoods.ifReachBottom || data.hottestGoods.ifLoading) return;

    data.hottestGoods.ifLoading = true;
    data.hottestGoods.ifNothing = false;
    data.hottestGoods.ifReachBottom = false;
    that.setData(data);

    // let hottestGoods = that.data.hottestGoods;
    util.requestHottestGoods(data.hottestGoods.previousPage, data.hottestGoods.nextPage)
    .then(res => {
      data.hottestGoods.ifLoading = false;

      if (res.code == 0) {
        let goodsList = res.data;

        data.hottestGoods.list = data.hottestGoods.list.concat(goodsList);
        data.hottestGoods.previousPage += goodsList.length;

        if (data.hottestGoods.list.length == 0) {
          data.hottestGoods.ifNothing = true;
          data.hottestGoods.ifReachBottom = false;    
        }
        else if (goodsList.length < data.hottestGoods.nextPage) {
          data.hottestGoods.ifReachBottom = true;
          data.hottestGoods.ifNothing = false;
        }
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
      
      that.setData(data);
    })
  },

  onShow: function () {
    let that = this;

    // set navigation bar
    wx.setNavigationBarTitle({
      title: "WooWo二手市场"
    })

    // initiate keyword
    that.setData({
      keyword: ""
    })
  },

  // Bind switch content event
  switchContent: function (event) {
    let that = this;

    // if it's a refresh 
    if (Number(event.currentTarget.dataset.cid) == that.data.contentId) {
      that.refreshGoodsList(that.data.contentId);
      return;
    }


    that.setData({
      contentId: parseInt(event.currentTarget.dataset.cid)
    })

    // just request when there's no data
    if (that.data.contentId == 0 && that.data.hottestGoods.list.length == 0) {
      that.requestHottestGoods();
    }

    // request for nearest goods
    else if (that.data.contentId == 1 && that.data.nearestGoods.list.length == 0) {
      
      wx.showLoading({title: '定位中...', mask: true})
      util.getCurrentLocation()
      .then(res => {
        console.log(res);
        wx.hideLoading();
        if (res.code == 0 && res.data.area != 'Others') {
          that.setData({
            area: res.data.area
          })
          that.requestNearestGoods();
        }
        else {
          that.setData({
            nearestGoods: {
              ifShowAll: true,
              ifReachBottom: true,
              previousPage: 0,
              nextPage: app.globalData.loadItems,
              list: []
            },
          })

          if (res.code == -1) {
            wx.showModal({
              title: '授权失败',
              content: '需授权开启定位后，才可使用该功能',
              cancelText: '拒绝',
              confirmText: '去授权',
              confirmColor: '#2C3E50',
              cancelColor: '#696969',
              success: function(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: () => {
                      console.log('open setting success')
                    },
                    fail: function() {
                      console.log('open setting fail')
                    }
                  })
                }
              }
            })
          }
          else {
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
        }
      })
      
      
    }
  },

  inputKeyword: function (event) {
    let that = this;
    
    that.setData({
      keyword: event.detail.value
    });

    // console.log(that.data.keywords);
  },

  goToSearch: function (event) {
    let that = this;

    console.log(event);
    let keyword = event.detail.keyword

    wx.navigateTo({
      url: "../goodsList/goodsList?keyword=" + keyword,
      success: function () {
        console.log()
      }
    })
  },


  reachBottom: function () {
    console.log('reach the bottom');
  },

  onPageScroll: function (event) {
    // console.log(event);
    let that = this;

    that.setData({
      currentTopPos: event.scrollTop
    })
  },

  unreadAccount: function (event) {
    let that = this;
    let account = event.detail.unreadNotificationAccount;
   
    that.setData({
      unreadNotificationAccount: account
    })

    console.log('get notifications:' + account);
  },

  loginSuccess: function (event) {
    let that = this;

    that.setData({
      showLoginAuth: false
    })

    // that.requestHottestGoods();

    if (that.data.scene) {
      let scene = that.data.scene;

      if (scene.includes('shopId')) {
        let shopId = decodeURIComponent(scene).split('=')[1];

        that.goToSpecificShop(shopId);
      }
      else {
        that.goToSpecificGoods(that.data, true)
      }
    }
  },

  refuseAuth: function (event) {
    let that = this;

    console.log('RefuseAuth')

    that.setData({
      showLoginAuth: false
    })
    that.requestHottestGoods();
  },


  collectFormId: function(event) {
    app.globalData.formIdList.push({
      'formId': event.detail.formId,
      'date': Date.now()
    })
  },

  sourceAnalysis: function (source) {
    util.requestSourceAnalysis(source).then(res => {
      if (res.code == 0) {
        console.log('Source analysis succeed')
      }
      else {
        console.log('Source analysis failed')
      }
    })
  }
})
