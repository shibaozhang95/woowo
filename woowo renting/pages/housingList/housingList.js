const app = getApp();
const LOAD_ITEM = 20;
const util = require('../../utils/util');

import Filter from "../../utils/filter";

// housingList.js
Page({

  /**
   * Page initial data
   */
  data: {
    priceSortWay: [{
      text: '价格排序',
      value: ''
    }, {
      text: '从低到高',
      value: 'priceLH'
    }, {
      text: '从高到低',
      value: 'priceHL'
    }],

    agentSort: ['混合房源', '中介房源', '个人房源'],
    agentSortValue: 0,

    currentPriceSortWay: 0,

    ifAnyFilter: true,

    // FOR FILTER WXSS
    searchBarHeight: 80,

    ifShowFilter: false,
    ifShowFilterBubble: false,

    pageTitle: 'Woowo 租房',

    woowoFilter: {},

    prevPos: 0,
    filterBubbleAnimation: {},

    navHeight: 0,

    housesInfo: {
      ifReachBottom: false,
      ifLoading: false,
      ifNothing: false,
      previousPage: 0,
      nextPage: LOAD_ITEM,
      list: []
    },

    areasFromSearchPage: '',  // it's json string
    prevAreasFromSearchPage: '',

    currentTopPos: Number,  // for go to top

    // for agents
    ifAgentsPage: false,
    currentAgentInfo: {},
    ifShowChoosingAgents: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.woowoFilter = new Filter();

    // come from index
    if (options.menu) {
      data.woowoFilter.initializeType(options.menu);
    }

    // first come from areasSearch
    if (options.areas) {
      let filterAreas = JSON.parse(options.areas);
      data.woowoFilter.updateFilterAreas(filterAreas);
      console.log(data.woowoFilter.areasText);
    }

    // From index, view more
    if (options.filter) {
      console.log('Come form index');
      let sort = JSON.parse(options.filter).orderStr;
      console.log(sort);
      if (sort) {
        data.woowoFilter.changeTheOrderWay(sort);
      }
    }

    // For agent
    if (options.agentsPage || options.companyId) {
      data.ifAgentsPage = true;

      data.pageTitle = '中介房源';

      data.woowoFilter.changeAgentSortValue(1)

      // click on a company from hot agent
      if (options.companyInfo) {
        let companyInfo = JSON.parse(options.companyInfo);
        data.currentAgentInfo = companyInfo;
        data.woowoFilter.addCompanyAsFilter(companyInfo.id);
      }

      // scan company qr code
      else if (options.companyId) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })

        // request housing list
        data.woowoFilter.addCompanyAsFilter(options.companyId);

        // request company info
        util.requestCompanyInfoById(options.companyId)
        .then(res => {
          wx.hideLoading();

          if (res.code == 0) {
            data.currentAgentInfo = res.data[0];
            console.log(res.data);
            that.setData(data);
          }

          else {
            wx.showToast({
              title: '出错了。',
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
    

    // FOR FILTER BUBBLE ANIMATION
    that.filterBubbleAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });

    that.triggerFilterBubbleAnimation('disappear');
    // FOR LAYOUT
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    let navHeight = app.globalData.defaultNavBarHeight + app.globalData.statusBarHeight;
    data.navHeight = ifCustomNavigation ? navHeight : 0;

    that.setData(data);

    that.reRequestHouses();
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

    // from areas search
    if (data.areasFromSearchPage) {
      data.woowoFilter.updateFilterAreas(JSON.parse(data.areasFromSearchPage));

      if (data.areasFromSearchPage != data.prevAreasFromSearchPage) {
        data.prevAreasFromSearchPage = data.areasFromSearchPage;

        that.reRequestHouses();
      }
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

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    let that = this;

    that.reRequestHouses();

    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    let that = this;
    let data = that.data;

    // if nomore, then nomore, or already requesting
    if (data.housesInfo.ifReachBottom || data.housesInfo.ifLoading) return;

    data.housesInfo.ifLoading = true;
    that.setData(data);

    that.requestHouses(data.housesInfo)
    .then(res => {
      data.housesInfo.ifLoading = false;

      if (res.code == 0) {
        let newList = that.eliminateRepeats(data.housesInfo.list, res.data);

        data.housesInfo.list = data.housesInfo.list.concat(newList);
        data.housesInfo.previousPage += LOAD_ITEM;
        
        if (newList.length < data.housesInfo.nextPage) {
          data.housesInfo.ifReachBottom = true;
        }
      }

      else {
        wx.showToast({
          title: '加载失败了，请稍后再试~',
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onPageScroll: function (event) {
    let that = this;
    let data = that.data;

    let currentScrollTop = event.scrollTop;

    that.setData({
      currentTopPos: currentScrollTop
    });
    
    if (data.prevPos - currentScrollTop < -50) {
      data.prevPos = currentScrollTop;

      // filter bubble disappears

      that.triggerFilterBubbleAnimation('disappear');
    }
    else if (data.prevPos - currentScrollTop > 50) {
      data.prevPos = currentScrollTop;
      
      // filter bubble appears

      that.triggerFilterBubbleAnimation('appear');
      
    }

    that.setData(data);
  },

  switchSortWay: function () {
    let that = this;
    let data = that.data;

    data.currentPriceSortWay = (data.currentPriceSortWay + 1) % 3;

    data.woowoFilter.changeTheOrderWay(data.priceSortWay[data.currentPriceSortWay].value);

    that.setData(data);

    // request new data
    that.reRequestHouses();
  },
  
  filterUpdated: function (event) {
    let that = this;
    let data = that.data;

    let filter = event.detail.filter;

    that.switchOnofOffFilter();

    data.woowoFilter.updateFromFilterComponent(filter);
    
    // show filter bubble
    that.triggerFilterBubbleAnimation('appear');

    that.setData(data);

    // request new data
    that.reRequestHouses();
  },

  switchOnofOffFilter: function () {
    let that = this;
    let data = that.data;

    data.ifShowFilter = !data.ifShowFilter;
    
    that.setData(data);
  },

  triggerFilterBubbleAnimation: function (direction) {
    let that = this;

    if (direction == 'appear') {
      console.log('appear');
      that.filterBubbleAnimation.top('100rpx').opacity(1).step();
    }
    else if (direction == 'disappear') {
      console.log('disappear');
      that.filterBubbleAnimation.top('70rpx').opacity(0).step();
    }
    
    that.setData({
      filterBubbleAnimation: that.filterBubbleAnimation.export()
    })
  },

  goToSearchAreaFromList: function () {
    let that = this;
    let areas = that.data.woowoFilter.areas;

    wx.navigateTo({
      url: '../areasSearch/areasSearch?areas=' + JSON.stringify(areas)
    })
  },

  // reRequest will empty the list first
  reRequestHouses: function () {
    let that = this;
    let data = that.data;

    data.housesInfo = {
      ifReachBottom: false,
      ifLoading: false,
      ifNothing: false,
      previousPage: 0,
      nextPage: LOAD_ITEM,
      list: []
    }

    data.housesInfo.ifLoading = true;

    that.setData(data);

    that.requestHouses(data.housesInfo).then(res => {
      data.housesInfo.ifLoading = false;
      if (res.code == 0) {
        data.housesInfo.list = that.eliminateRepeats(data.housesInfo.list, res.data);
        data.housesInfo.previousPage = LOAD_ITEM;

        if (data.housesInfo.list.length == 0) {
          data.housesInfo.ifNothing = true;
        }
        else if (data.housesInfo.list.length < data.housesInfo.nextPage) {
          data.housesInfo.ifReachBottom = true;
        }
      }
      else {
        data.housesInfo.ifNothing = true;
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
    });
  },

  // request will not empty the list
  requestHouses: function (housesInfo) {
    let that = this;
    let data = that.data;

    let formatFilterData = data.woowoFilter.formatFilter();

    console.log(housesInfo);
    return new Promise((resolve, reject) => {
      util.requestHousingList(housesInfo.previousPage, housesInfo.nextPage, formatFilterData)
      .then(res => {
        resolve(res);
      })
    })
    
  },

  switchAgentSort: function () {
    let that = this;
    let data = that.data;

    data.agentSortValue = (data.agentSortValue+1) % 3;

    data.woowoFilter.changeAgentSortValue(data.agentSortValue);
    that.setData(data);

    that.reRequestHouses();
  },

  chooseAgent: function () {
    let that = this;
    let data = that.data;

    data.ifShowChoosingAgents = true;

    that.setData(data);
  },

  agentChosenComplete: function (event) {
    let that = this;
    let data = that.data;

    data.ifShowChoosingAgents = false;

    if (event.detail.ifChosen) {
      data.currentAgentInfo = event.detail.companyInfo;
      
      data.woowoFilter.addCompanyAsFilter(data.currentAgentInfo.id);

      that.reRequestHouses();
    }

    that.setData(data);
  },

  eliminateRepeats: function (orgLs, newLs) {
    let filteredLs = [];

    for (let i = 0, len = newLs.length; i < len; ++i) {
      if (newLs[i]) {
        let ifRepeated = false;
        for (let p = 0, pLen = orgLs.length; p < pLen; ++p) {
          if (newLs[i].id == orgLs[p].id) {
            ifRepeated = true;
          }
        }

        if (!ifRepeated) {
          filteredLs.push(newLs[i])
        }
      }
    }

    return filteredLs;
  }
})