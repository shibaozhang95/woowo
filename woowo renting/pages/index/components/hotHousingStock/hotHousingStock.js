const util = require('../../../../utils/util');

// hotHousingStock.js
Component({
  /**
   * Component properties
   */
  properties: {
    blockTitle: {
      type: String,
      value: ''
    },

    blockType: {
      type: String,
      value: ''        // popular, newest
    },

    reLoadTrigger: {
      type: Number,
      value: 0,

      observer: function (newVal, oldVal) {
        let that = this;

        that.reLoadData();
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    topStocks: [],
    
    filterForPopular: {
      interOnly: false
    },

    filterForNewest: {
      interOnly: false
    },

    ifLoading: false,
    ifNothing: false,

    prevPage: 0,
    nextPage: 10
  },

  ready: function () {
    let that = this;
    let data = that.data;

    if (data.blockType == 'popular') {
      that.requestForHotStocks(data.filterForPopular);
    }
    else if (data.blockType == 'newest') {
      that.requestForHotStocks(data.filterForNewest);
    }
    
  },

  /**
   * Component methods
   */
  methods: {
    reLoadData: function () {
      let that = this;
      let data = that.data;

      data.topStocks = [];
      data.ifLoading = 0;
      data.ifNothing = 0;

      if (data.blockType == 'popular') {
        that.requestForHotStocks(data.filterForPopular);
      }
      else if (data.blockType == 'newest') {
        that.requestForHotStocks(data.filterForNewest);
      }
    },


    requestForHotStocks: function (filter) {
      let that = this;
      let data = that.data;

      data.ifLoading = true;
      that.setData(data);

      util.requestHousingList(data.prevPage, data.nextPage, filter)
      .then(res => {
        if (res.code == 0) {
          data.ifLoading = false;

          data.topStocks = res.data;

          if (data.topStocks.length == 0) {
            data.ifNothing = true;
          }
        } 
        else {
          data.ifNothing = true;
        }

        that.setData(data);
      })
    },

    goToHousingList: function () {
      let that = this;
      let data = that.data;

      let filter = {};

      if (data.blockType == 'popular') filter = data.filterForPopular;
      else if (data.blockType == 'newest') filter = data.filterForNewest;

      wx.navigateTo({
        url: '/pages/housingList/housingList?filter=' + JSON.stringify(filter)
      })

    }
  }
})
