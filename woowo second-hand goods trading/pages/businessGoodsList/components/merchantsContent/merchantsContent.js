const util = require('../../../../utils/util');

const SHOP_NUM = 10;

// pages/businessGoodsList/components/merchantsContent/merchantsContent.js
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
        
        if (data.ifLoading) return;

        that.emptyAndRequest();
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    chosenCat: '全部',
    cats: [{
      title: '全部'
    }, {
      title: '家具电器'
    }, {
      title: '护肤美妆'
    }, {
      title: '服饰搭配'
    }, {
      title: '生活服务'
    }, {
      title: '二手书籍'
    }, {
      title: '3C数码'
    }, {
      title: '生活用品'
    }, {
      title: '二手车'
    }, {
      title: '动植物'
    }, {
      title: '其他'
    }],

    merchantsList: [],

    previousPage: 0,
    nextPage: SHOP_NUM,

    ifNothing: false,
    ifLoading: false,
    ifShowAll: false,
  },

  /**
   * Component methods
   */
  methods: {
    switchCat: function (event) {
      let that = this;
      let data = that.data;

      let cat = event.currentTarget.dataset.targetCat;

      data.chosenCat = cat;

      that.emptyAndRequest();
    },

    emptyAndRequest: function () {
      let that = this;
      let data = that.data;

      data.merchantsList = [],
      data.previousPage = 0;
      data.ifReachBottom = false;
      data.ifNothing = false;

      that.requestFilteredMerchants();
    },

    requestMore: function () {
      let that = this;
      let data = that.data;

      if (data.ifReachBottom || data.ifLoading) {
        return ;
      }

      that.requestFilteredMerchants();      
    },

    requestFilteredMerchants: function () {
      let that = this;
      let data = that.data;

      if (data.ifLoading) {
        wx.showToast({
          title: '请您慢点儿刷新哦～',
          icon: 'none',
          mask: false,
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        })
        return;
      }

      data.ifLoading = true;
      data.ifNothing = false;
      data.ifReachBottom = false;
      that.setData(data);

      // get the filter first
      let keyword = data.searchKeyword.length > 0 ? encodeURIComponent(data.searchKeyword) : '';
      let kind = data.chosenCat == '全部' ? '' : data.chosenCat;

      util.requestShopList(data.previousPage, data.nextPage, keyword, kind)
      .then(res => {
        data.ifLoading = false;

        if (res.code == 0) {
          data.merchantsList = data.merchantsList.concat(res.data);
          data.previousPage += res.data.length;

          if (data.merchantsList.length == 0) {
            data.ifNothing = true;
            data.ifReachBottom = false;
          }
          else if (res.data.length < data.nextPage) {
            data.ifReachBottom = true;
            data.ifNothing = false;
          }
        }

        else {
          data.ifNothing = true;
          data.ifReachBottom = false;

          wx.showToast({
            title: '出错了，请稍后再试～',
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
