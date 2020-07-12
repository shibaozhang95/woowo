// pages/index/components/popularGoods/popularGoods.js
const util = require('../../../../utils/util');

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    popularGoods: []
  },

  ready: function () {
    let that = this;
    let data = that.data;

    util.requestAllPopularGoods().then(res => {
      if (res.code == 0) {
        data.popularGoods = res.data;

        that.setData(data);
      }
    })
  },

  /**
   * Component methods
   */
  methods: {

  }
})
