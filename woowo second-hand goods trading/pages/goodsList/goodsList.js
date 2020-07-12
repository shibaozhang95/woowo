const util = require('../../utils/util.js');
const api = require('../../services/api.js');

const app = getApp();

Page({
  data: {
    screenWidth: Number,
    screenHeight: Number,
    navBarHeight: Number,
    sortBarHeight: 30,
    searchBarHeight: 47,
    
    currentTopPos: 0,

    // for search
    currentMainCat: String,
    keyword: String,

    initializeFilter: 0,
    
    filteredGoods: {
      ifShowAll: false,
      previousPage: 0,
      nextPage: 20,
      list: []
    },

    filter: {
      keyword: "",
      mainCat: "",
      subCat: "",
      priceSortWay: "",
      areas: [],
      lowestPrice: Number,
      highestPrice: Number,
      postDate: "",
      conditionLevel: [],
      shipWay: []
    },

    ifLoading: false,
    ifReachBottom: false,
    ifNothing: false
  },

  onLoad: function (option) {
    console.log(option);
    let that = this;

    // Initial current page
    that.setData({
      screenWidth: app.globalData.screenWidth,
      screenHeight: app.globalData.screenHeight,
      navBarHeight: app.globalData.statusBarHeight + app.globalData.defaultNavBarHeight,
      currentMainCat: option.mainCat ? option.mainCat : '',
      keyword: option.keyword ? option.keyword : ''
    });

    console.log(that.data.keyword)
    // First request filtered goods
    that.setData({
      ['filter.keyword']: that.data.keyword,
      ['filter.mainCat']: that.data.currentMainCat
    });
    that.requestFilteredGoods();
  },

  onShow: function () {
    // console.log(this.data.keywords);
  },

  onPageScroll: function (event) {
    let that = this;

    that.setData({
      currentTopPos: event.scrollTop
    })
  },

  onPullDownRefresh: function () {

    let that = this;
    that.setData({
      ifReachBottom: false,
      ['filteredGoods.ifShowAll']: false,
      ['filteredGoods.previousPage']: 0,
      ['filteredGoods.list']: [],
    });

    that.requestFilteredGoods();

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300)
  },

  onReachBottom: function () {
    let that = this;
    if (that.data.ifReachBottom || that.data.ifLoading) {
      console.log('do nothing, already reach bottom');
      return ;
    }

    that.requestFilteredGoods();
  },

  goToSearch: function (event) {
    let that = this;

    let keyword = event.detail.keyword;

    that.setData({
      keyword: keyword,
      initializeFilter: that.data.initializeFilter + 1
    })
  },

  changeFilters: function (event) {
    
    console.log(event);
    // initiate some data
    let that = this;
    that.setData({
      ifReachBottom: false,
      ['filteredGoods.ifShowAll']: false,
      ['filteredGoods.previousPage']: 0,
      ['filteredGoods.list']: [],

      // change filter
      filter: event.detail
    });

    that.requestFilteredGoods();
  },

  requestFilteredGoods: function () {
    let that = this;
    let data = that.data;

    let currentFilteredGoods = that.data.filteredGoods;
    let currentFilter = that.data.filter;
    
    // add keyword as one of filter
    currentFilter.keyword = that.data.keyword ? that.data.keyword : '';

    let formatedFilter = util.formatData.filter(currentFilteredGoods.previousPage, currentFilteredGoods.nextPage
      , currentFilter, app.globalData.state);

    console.log(JSON.stringify(currentFilter) + "-----------cur") 
    
    data.ifLoading = true;
    data.ifNothing = false;
    data.ifReachBottom = false;
    that.setData(data);

    util.requestFilteredGoods(formatedFilter)
    .then(res => {
      data.ifLoading = false;

      if (res.code == 0) {
        data.filteredGoods.list = data.filteredGoods.list.concat(res.data);
        data.filteredGoods.previousPage = data.filteredGoods.previousPage + res.data.length;

        if (data.filteredGoods.list.length == 0) {
          data.ifNothing = true;
          data.ifReachBottom = false; 
        }
        else if (res.data.length < data.filteredGoods.nextPage) {
          data.ifReachBottom = true;
          data.ifNothing = false;
        }
        
      }
      else {
        data.ifNothing = true;
        data.ifReachBottom = false;

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
  }
})