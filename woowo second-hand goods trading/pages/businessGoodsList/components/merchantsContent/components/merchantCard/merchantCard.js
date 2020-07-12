const util = require('../../../../../../utils/util');
const user = require('../../../../../../services/user');
const app = getApp();

const TOP_NUM = 3;

// pages/businessGoodsList/components/merchantsContent/merchantCard/merchantCard.js
Component({
  /**
   * Component properties
   */
  properties: {
    merchantInfo: {
      type: Object,
      value: {

      },
      observer (newVal, oldVal) {
        let that = this;
        let data = that.data;

        if (newVal.name) newVal.name = decodeURIComponent(newVal.name);
        if (newVal.description) newVal.description = decodeURIComponent(newVal.description);

        data.merchantInfo = newVal;

        that.setData(data);
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    ifFollowing: false,
    ifSelf: false,
    goodsList: [],

    ifLoading: false,
    ifNothing: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    if (data.merchantInfo.name) {
      data.merchantInfo.name = decodeURIComponent(data.merchantInfo.name);
    }
    if (data.merchantInfo.description) {
      data.merchantInfo.description = decodeURIComponent(data.merchantInfo.description);
    }

    user.checkIfLogedin().then(res => {
      if (res.ifLogedin) {
        data.ifFollowing = util.checkIfFollowingShop(data.merchantInfo.id);
        data.ifSelf = data.merchantInfo.wxUnionId == app.globalData.woowoUserInfo.wx_unionid;
      }
      else {
        data.ifSelf = false;
        data.ifFollowing = false;
      }
    })
    

    that.setData(data);

    if (data.merchantInfo.id) {
      that.requestForTopThreeGoods(data.merchantInfo.id);
    }
  },

  /**
   * Component methods
   */
  methods: {
    switchFollowing: function() {

      user.checkIfLogedin().then(res => {
        if (res.ifLogedin) {
          let that = this;
          let data = that.data;

          wx.showLoading({
            title: data.ifFollowing ? "取消中" : "关注中"
          })

          let shopId = data.merchantInfo.id;
          let unionId = app.globalData.woowoUserInfo.wx_unionid;

          util.requestSwitchFollowShops(shopId, unionId).then(res => {
            wx.hideLoading();
            if (res.code == 0) {
              wx.showToast({
                title: (data.ifFollowing ? '取消' : '关注') + '成功',
                icon: 'success',
                success: () => {
                  setTimeout(() => {
                    wx.hideToast()
                  }, 2000)
                }
              })

              data.ifFollowing = !data.ifFollowing;
              util.updateLikedShopsLocally(shopId, data.ifFollowing);
              
              that.setData(data);
            }
            else {
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
          })
        }
        else {
          wx.showToast({
            title: '请先登录哦～',
            icon: 'none',
            mask: false,
            success: () => {
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }
          })
        }
      })
      
    },

    requestForTopThreeGoods: function (shopId) {
      let that = this;
      let data = that.data;

      data.ifLoading = true;
      that.setData(data);

      util.requestShopNewestGoods(0, TOP_NUM, shopId)
      .then(res => {
        data.ifLoading = false;

        if (res.code == 0) {
          data.goodsList = res.data;

          if (data.goodsList.length == 0) {
            data.ifNothing = true;
          }
        }
        else {
          data.ifNothing = true;

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
    },

    goToMerchant: function () {
      let that = this;
      let data = that.data;

      user.checkIfLogedin().then(res => {
        if (res.ifLogedin) {
          let params = {
            ifMerchant: true,
            username: data.merchantInfo.name,
            userAvatarUrl: data.merchantInfo.image,
            userUnionId: data.merchantInfo.wxUnionId,
            bgImageUrl: data.merchantInfo.bgImage,
            description: data.merchantInfo.description,
            shopId: data.merchantInfo.id
          }
    
          wx.navigateTo({
            url: '/pages/homepage/homepage?' + util.paramObjToStr(params)
          })
        }

        else {
          wx.showToast({
            title: '请先登录哦～',
            icon: 'none',
            mask: false,
            success: () => {
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }
          })
        }
      })
      
    }
  }
})
