import Filter from "../../../../utils/filter";

const app = getApp();

// filter.js
Component({
  /**
   * Component properties
   */
  properties: {
    topGap: {
      type: Number,
      value: 0
    },
    woowoFilter: {
      type: Object,
      value: {},

      observer: function (newVal, oldVal, changedPath) {
        console.log('this is filter')
        console.log(newVal);
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    filterWindowHeight: 0,
    filterWindowWidth: 0,
    bottomGapHeight: 0,
    filterDetailHeight: 0,

    filterList: [],

    price: {
      MIN_PRICE: 0,
      MAX_PRICE: 1999,
      priceValue: [0, 1999]
    },
    
    ifPriceIntervalChanged: false,

    filter: {
      
    }
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.bottomGapHeight = app.globalData.bottomGapHeight;
    data.filterWindowHeight = app.globalData.screenHeight - app.globalData.statusBarHeight 
      - app.globalData.defaultNavBarHeight - that.data.topGap;
    data.filterWindowWidth = app.globalData.screenWidth;

    // 50 is filter function bar height
    data.filterDetailHeight = data.filterWindowHeight - data.bottomGapHeight - 50;

    data.filterList = data.woowoFilter.filterList;

    if (data.woowoFilter.pricePerWeekLow > -1) {
      data.ifPriceIntervalChanged = true;
      data.price.priceValue[0] = data.woowoFilter.pricePerWeekLow;
    }
    if (data.woowoFilter.pricePerWeekHigh > -1) {
      data.ifPriceIntervalChanged = true;
      data.price.priceValue[1] = data.woowoFilter.pricePerWeekHigh;
    }
    
    that.setData(data)
  },

  /**
   * Component methods
   */
  methods: {
    chooseFilterContent: function (event) {
      let that = this;
      let data = that.data;

      let filterIndex = event.currentTarget.dataset.filterIndex;
      let contentIndex = event.currentTarget.dataset.contentIndex;

      data.filterList[filterIndex].choices[contentIndex].ifChosen = !data.filterList[filterIndex].choices[contentIndex].ifChosen;

      that.setData(data);

    },

    filterPriceChange: function (event) {
      let that = this;
      let data = that.data;
      
      data.ifPriceIntervalChanged = true;
      data.woowoFilter.pricePerWeekLow = Math.floor(event.detail.minValue);
      data.woowoFilter.pricePerWeekHigh = Math.floor(event.detail.maxValue);
      data.price.priceValue = [data.woowoFilter.pricePerWeekLow, data.woowoFilter.pricePerWeekHigh];
      
      console.log(data.price.priceValue)
      that.setData(data);
    },

    resetFilter: function () {
      let that = this;
      let data = that.data;

      for (let i = 0, len = data.filterList.length; i < len; ++i) {
        for (let j = 0, jLen = data.filterList[i].choices.length; j < jLen; ++j) {
          data.filterList[i].choices[j].ifChosen = false
        }
      }

      data.ifPriceIntervalChanged = false;
      data.woowoFilter.pricePerWeekLow = -1;
      data.woowoFilter.pricePerWeekHigh = -1;
      data.price.priceValue = [data.price.MIN_PRICE, data.price.MAX_PRICE];

      that.setData(data);
    },

    confirmFilter: function () {
      let that = this;
      let data = that.data;

      that.triggerEvent('filterconfirm', {
        filter: data.woowoFilter
      });
    }
  },

  
})
