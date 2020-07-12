const util = require('../../../../utils/util.js');
const app = getApp();

// pages/businessGoodsList/components/goodsContent/goodsContent.js
Component({
  /**
   * Component properties
   */
  properties: {
    refreshTrigger: {
      type: Boolean,
      value: true,
      observer (newVal, oldVal) {
        let that = this;
        let data = that.data;
        
        if (data.ifLoading) return;

        that.emptyAndRequest();
      }
    },
    requestMoreTrigger: {
      type: Boolean,
      value: true,
      observer (newVal, oldVal) {
        let that = this;
        let data = that.data;
        
        if (data.ifLoading) return;

        that.requestMore();
      }
    },

    searchKeyword: {
      type: String,
      value: '',
      observer (newVal, oldVal) {
        let that = this;
        let data = that.data;

        let keyword = newVal;

        data.keyword = keyword;
        data.initializeFilter = data.initializeFilter + 1;

        that.setData(data);
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    initializeFilter: 0,
    
    filteredGoods: {
      ifShowAll: false,
      previousPage: 0,
      nextPage: 20,
      list: []
    },

    keyword: '',

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

  /**
   * Component methods
   */
  methods: {
    emptyAndRequest: function () {
      let that = this;
      let data = that.data;

      data.ifReachBottom = false,
      data.filteredGoods.ifShowAll = false,
      data.filteredGoods.previousPage = 0,
      data.filteredGoods.list = [];

      that.requestFilteredGoods();
    },

    requestMore: function () {
      let that = this;
      let data = that.data;

      if (data.ifReachBottom || data.ifLoading) {
        return ;
      }

      that.requestFilteredGoods();
    },

    changeFilters: function (event) {
      let that = this;
      let data = that.data;

      let filter = event.detail;
      console.log('changed the filter')

      data.ifReachBottom = false;
      data.filteredGoods.ifShowAll = false;
      data.filteredGoods.previousPage = 0;
      data.filteredGoods.list = [];

      data.filter = filter;

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
      
      data.ifLoading = true;
      data.ifNothing = false;
      data.ifReachBottom = false;
      that.setData(data);

      // Here is the only changes for bussiness goods
      formatedFilter.show_shop_product = 'shop';
  
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

  }
})
