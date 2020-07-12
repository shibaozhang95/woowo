import Filter from "../../../../utils/filterForHm";

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
    
    housemateFilter: {
      type: Filter,
      value: {},
      observer (newVal, oldVal) {
        console.log(newVal);
        console.log(oldVal);
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

    price: {
      MIN_PRICE: 0,
      MAX_PRICE: 1999,
      priceValue: [0, 1999]
    },
    
    ifPriceIntervalChanged: false,

    // used to reset
    selectionResetCount: 0,
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

    
    // initialize the price
    if (data.housemateFilter.pricePerWeekLow > -1) {
      data.ifPriceIntervalChanged = true;
      data.price.priceValue[0] = data.housemateFilter.pricePerWeekLow;
    }
    if (data.housemateFilter.pricePerWeekHigh > -1) {
      data.ifPriceIntervalChanged = true;
      data.price.priceValue[1] = data.housemateFilter.pricePerWeekHigh;
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

      let ifChosen = data.housemateFilter.filterList[filterIndex].choices[contentIndex].ifChosen
      data.housemateFilter.filterList[filterIndex].choices[contentIndex].ifChosen = !ifChosen;

      console.log(data.housemateFilter)
      that.setData(data);

    },

    filterPriceChange: function (event) {
      let that = this;
      let data = that.data;
      
      data.ifPriceIntervalChanged = true;
      
      let lowPrice = Math.floor(event.detail.minValue);
      let highPrice = Math.floor(event.detail.maxValue);

      data.price.priceValue = [lowPrice, highPrice];

      data.housemateFilter.pricePerWeekLow = lowPrice;
      data.housemateFilter.pricePerWeekHigh = highPrice;
   
      that.setData(data);
    },

    selectionChanged: function (event) {
      let that = this;
      let data = that.data;

      let fieldName = event.currentTarget.dataset.fieldName;
      let selectionType = event.detail.result.selectionType;
      let value = event.detail.result.value;

      data.housemateFilter[fieldName] = value[0];

      console.log(data.housemateFilter[fieldName])
      that.setData(data);
    },

    resetFilter: function () {
      let that = this;
      let data = that.data;

      for (let i = 0, len = data.housemateFilter.filterList.length; i < len; ++i) {
        for (let j = 0, jLen = data.housemateFilter.filterList[i].choices.length; j < jLen; ++j) {
          data.housemateFilter.filterList[i].choices[j].ifChosen = false;
        }
      }

      data.housemateFilter.pricePerWeekLow = -1;
      data.housemateFilter.pricePerWeekHigh = -1;
      data.ifPriceIntervalChanged = false;
      data.price.priceValue = [data.price.MIN_PRICE, data.price.MAX_PRICE];

      data.housemateFilter.ifCookValue = '不限';
      data.housemateFilter.ifSmokeValue = '不限';
      data.housemateFilter.ifPetValue = '不限';

      data.selectionResetCount += 1;

      that.setData(data);
    },

    confirmFilter: function () {
      let that = this;
      let data = that.data;

      that.triggerEvent('confirmfilter', data.housemateFilter)
    }
  },

  
})
