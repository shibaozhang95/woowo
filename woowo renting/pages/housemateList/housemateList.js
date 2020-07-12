// pages/housemateList/housemateList.js
const util = require('../../utils/util');
const LOAD_ITEM = 20;

import WoowoHousemate from '../../utils/woowoHousemate'
import HousemateFilter from '../../utils/filterForHm'

Page({

  /**
   * Page initial data
   */
  data: {
    pageTitle: '寻找室友',

    ifShowFilter: false,

    housemateList: [],
    prevPage: 0,
    nextPage: LOAD_ITEM,
    ifLoading: false,
    ifReachBottom: false,
    ifNothing: false,

    areasFromSearchPage: '',  // it's json string
    prevAreasFromSearchPage: '',

    sortGenderTxt: '性别',
    sortAreaBlockTxt: '学区',

    hosueamteFilter: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.housemateFilter = new HousemateFilter();
    console.log(data.housemateFilter);

    that.requestForHousemateList(0, LOAD_ITEM, {})
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
      data.housemateFilter.updateWithFieldName(
        'area', JSON.parse(data.areasFromSearchPage)
      );

      if (data.areasFromSearchPage != data.prevAreasFromSearchPage) {
        data.prevAreasFromSearchPage = data.areasFromSearchPage;

        that.reRequestHousemates();
      }

      that.setData(data);
    }
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

  switchFilter: function () {
    let that = this;
    let data = that.data;

    data.ifShowFilter = !data.ifShowFilter;

    that.setData(data);
  },

  reRequestHousemates: function () {
    let that = this;
    let data = that.data;

    data.housemateList = [];
    data.prevPage = 0;
    data.nextPage = LOAD_ITEM;
    data.ifLoading = false;
    data.ifReachBottom = false;
    data.ifNothing = false;

    let filter = data.housemateFilter.formatFilter();
    console.log(filter);

    that.requestForHousemateList(data.prevPage
      , data.nextPage, filter);
  },

  requestForHousemateList: function (prevPage, nextPage, filter) {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestHousemateWithFilter(prevPage, nextPage, filter)
    .then(res => {
      data.ifLoading = false;

      if (res.code == 0) {
        data.housemateList = data.housemateList.concat(res.data);
        data.prevPage += LOAD_ITEM;

        if (data.housemateList.length == 0) {
          data.ifNothing = true;
        }
        else if (res.data.length < LOAD_ITEM) {
          data.ifReachBottom = true;
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

  goToSearchAreasFromList: function () {
    let that = this;
    let data = that.data;

    let areas = data.housemateFilter.area;

    wx.navigateTo({
      url: '../areasSearch/areasSearch?areas=' + JSON.stringify(areas)
    })
  },

  chooseGnder: function () {
    let that = this;
    let data = that.data;

    wx.showActionSheet({
      itemList: data.housemateFilter.sexOpts,
      success (res) {
        console.log(res.tapIndex)
        let newGender = data.housemateFilter.sexOpts[res.tapIndex];
        if (newGender != data.sortGenderTxt) {
          data.sortGenderTxt = newGender;
          data.housemateFilter.updateWithFieldName('sexValue', newGender);

          that.reRequestHousemates();
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  confirmFilter: function (event) {
    let that = this;
    let data = that.data;

    that.switchFilter();

    let newFilterObj = event.detail;
    console.log(event)
    // update filter first
    data.housemateFilter.updateTheWholeFilter(newFilterObj);

    that.reRequestHousemates();
  },

  changeSchoolAreas: function (event) {
    let that = this;
    let data = that.data;

    let chosenValue = event.detail.value;
    
    data.sortAreaBlockTxt = data.housemateFilter.schoolsRange[chosenValue];
    data.housemateFilter.updateWithFieldName('schoolValue', chosenValue);

    console.log(data.housemateFilter.schoolValue)
    that.reRequestHousemates();
  }
})