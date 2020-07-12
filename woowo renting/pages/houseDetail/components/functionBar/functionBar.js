const app = getApp();
const util = require('../../../../utils/util');

// pages/houseDetail/functionBar/functionBar.js
Component({
  /**
   * Component properties
   */
  properties: {
    houseId: {
      type: String,
      value: '',

      observer (newVal, oldVal) {
        let that = this;
        let data = that.data;

        // console.log(data.woowoUserInfo.userID);
        // if (data.woowoUserInfo) {
        //   data.ifLiked = app.globalData.woowoUserInfo.checkIfLikedHouse(newVal);
         
        //   that.setData(data);
        // }

        data.ifLiked = app.globalData.woowoUserInfo.checkIfLikedHouse(newVal);
         
        that.setData(data);
      }
    },

    ifShared: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    bottomGapHeight: 0,

    woowoUserInfo: {},
    ifLiked: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.bottomGapHeight = app.globalData.bottomGapHeight;
    data.woowoUserInfo = app.globalData.woowoUserInfo;

    if (data.houseId) {
      data.ifLiked = data.woowoUserInfo.checkIfLikedHouse(data.houseId);
      console.log('if liked: ' + data.ifLiked)
    }
 
    that.setData(data);
  },
  /**
   * Component methods
   */
  methods: {
    switchLikingAHouse: function () {
      let that = this;
      let data = that.data;

      let houseId = data.houseId;
      let userId = data.woowoUserInfo.user_id;

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
          data.woowoUserInfo.updateLikedHouse(action, houseId);

          data.ifLiked = !prevIfLiked;
          
          that.triggerEvent('updatelikingstatus', {
            data: action
          })

          wx.showToast({
            title: tips + '成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 1000)
            }
          })
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
    },

    tryToShare: function () {
      let that = this;
      let data = that.data;

      data.ifShared = true;

      that.setData(data);
      
      that.triggerEvent('openshare', {});
    },

    callHouseholder: function () {
      let that = this;

      that.triggerEvent('callbtnpressed');
    }
  }
})
