// components/housemateCard/housemateCard.js
const app = getApp();
const util = require('../../utils/util')
import WoowoHousemate from '../../utils/woowoHousemate'
import WoowoUserInfo from '../../utils/woowoUser'

Component({
  /**
   * Component properties
   */
  properties: {
    housemateInfo: {
      type: Object,
      value: {}
    },

    ifOnLikePage: {
      type: Boolean,
      value: false
    },

    ifOnEditPage: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    woowoHousemate: WoowoHousemate,
    woowoUserInfo: WoowoUserInfo,
    ifLiked: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.woowoUserInfo = app.globalData.woowoUserInfo;

    data.woowoHousemate = new WoowoHousemate();
    data.woowoHousemate.formatDataFromServer(data.housemateInfo);

    data.ifLiked
      = data.woowoUserInfo.checkIfLiked('housemate', data.woowoHousemate.id);

    that.setData(data);
  },
  /**
   * Component methods
   */
  methods: {
    goToHousemateDetail: function () {
      let that = this;
      let data = that.data;

      app.globalData.woowoHousemateTemp = data.woowoHousemate;
      
      wx.navigateTo({
        url: '/pages/housemateDetail/housemateDetail?from=card'
      })
    },

    switchLikingAHousemate: function () {
      let that = this;
      let data = that.data;

      let housemateId = data.woowoHousemate.id;
      let userId = data.woowoUserInfo.user_id;

      let prevIfLiked = data.ifLiked;
      let action = prevIfLiked ? 'unlike' : 'like';

      let tips = prevIfLiked ? '取消收藏' : '收藏';

      wx.showLoading({
        title: tips + '中...',
        mask: true
      })

      util.requestLikeOrUnLikeAHousemate(userId, housemateId)
      .then(res => {
        wx.hideLoading();

        if (res.code == 0) {
          data.woowoUserInfo.updateLikingStatus('housemate', action, housemateId);

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

    goToHousemateEdit: function () {
      let that = this;
      let data = that.data;

      app.globalData.woowoHousemateDraft = data.woowoHousemate;

      wx.navigateTo({
        url: '/pages/postHousemate1/postHousemate1?editMode=true'
      })
    },

    tryToDeleteHousemate: function () {
      let that = this;

      wx.showModal({
        title: '提示',
        content: '你确定要删除吗？',
        success: res => {
          if (res.confirm == true) {
            that.deleteHousemate();
          }
        }
      })
    },

    deleteHousemate: function () {
      let that = this;
      let data = that.data;

      wx.showLoading({
        title: '删除中...',
        mask: true
      })

      let housemateId = data.woowoHousemate.id;
      util.requestChangeHousemateStatus(housemateId, 'delete')
      .then(res => {
        wx.hideLoading();

        if (res.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })

          // trigger event
          that.triggerEvent('deleteahousemate', {
            deleteId: housemateId
          })
        }
        else {
          wx.showToast({
            title: '删除失败，稍后再试',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
      })
    }
  }
})
