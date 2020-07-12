import woowoHouse from "../../utils/woowoHouse";
const app = getApp();
const util = require('../../utils/util');

// oneApt.js
Component({
  /**
   * Component properties
   */
  properties: {
    houseInfo: {
      type: Object,
      value: {}
    },

    ifOnLikePage: {
      type: Boolean,
      value: false
    },

    ifNotGoFurther: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    woowoHouse: {},
    ifShowLoginAuth: false,
    ifLiked: false,

    ifAgent: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.woowoHouse = new woowoHouse(data.houseInfo).formatToShowingData();

    // console.log(data.woowoHouse);

    data.ifLiked = app.globalData.woowoUserInfo.checkIfLikedHouse(data.woowoHouse.houseId);

    data.ifAgent = data.woowoHouse.ifAgent;

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

      let url = '../../pages/houseDetail/houseDetail?from=aptcard';
      if (that.data.ifNotGoFurther == true) {
        url += '&ifNotGoFurther=true'
      }
      
      app.globalData.woowoHouseTemp = that.data.houseInfo;

      wx.navigateTo({
        url: url
      })
    },

    loginSuccess: function () {
      let that = this;

      that.goToHouseDetail();
    },

    switchLikingAHouse: function () {
      let that = this;
      let data = that.data;

      let houseId = data.woowoHouse.houseId;
      let userId = app.globalData.woowoUserInfo.user_id;

      let prevIfLiked = data.ifLiked;
      let action = prevIfLiked ? 'unlike' : 'like';

      let tips = prevIfLiked ? '取消收藏' : '收藏';

      wx.showLoading({
        title: tips + '中...',
        mask: true
      })

      util.requestLikeOrUnLikeAHouse(userId, houseId, action)
      .then(res => {
        wx.hideLoading();

        if (res.code == 0) {
          app.globalData.woowoUserInfo.updateLikedHouse(action, houseId);

          data.ifLiked = !prevIfLiked;
          
        }
        else {
          wx.showToast({
            title: '请求失败，请稍后再试。',
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
