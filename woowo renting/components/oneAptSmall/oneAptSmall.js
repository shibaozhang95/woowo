const app = getApp();
import WoowoHouse from '../../utils/woowoHouse';

// components/oneAptSmall/oneAptSmall.js
Component({
  /**
   * Component properties
   */
  properties: {
    houseInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    woowoHouse: {},
    ifShowLoginAuth: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.woowoHouse = new WoowoHouse(data.houseInfo).formatToShowingData();

    that.setData(data);
  },
  /**
   * Component methods
   */
  methods: {
    goToHouseDetail: function () {
      let that = this;
      let data = that.data;

      if (!app.globalData.woowoUserInfo.ifLogedin) {
        data.ifShowLoginAuth = true;
        that.setData(data);
        return;
      }

      app.globalData.woowoHouseTemp = that.data.houseInfo;

      wx.navigateTo({
        url: '../../pages/houseDetail/houseDetail?from=aptcard'
      })
    },

    loginSuccess: function () {
      let that = this;

      that.goToHouseDetail();
    }
  }
})
