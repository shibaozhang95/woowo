const util = require('../../../../utils/util');

const app = getApp();

// pages/myFollowings/components/userCard/userCard.js
Component({
  /**
   * Component properties
   */
  properties: {
    userInfo: {
      type: Object,
      value: {

      }
    }

    

  },

  /**
   * Component initial data
   */
  data: {
    ifFollowingUser: false,
    ifFollowingShop: false,

    ifMerchant: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    if (data.userInfo.id) {
      data.ifMerchant = true;
      data.ifFollowingShop = util.checkIfFollowingShop(data.userInfo.id);

      data.userInfo.name = decodeURIComponent(data.userInfo.name);
      data.userInfo.description = decodeURIComponent(data.userInfo.description);
    }
    else {
      data.ifMerchant = false;
      data.ifFollowingUser = util.checkIfFollowingUser(data.userInfo.userId);
      
    }

    console.log(data.userInfo);

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    switchFollowShop: function () {
      let that = this;
      let data = that.data;
  
      wx.showLoading({
        title: data.ifFollowingShop ? "取消中" : "关注中"
      })
  
      let shopId = data.userInfo.id;
      let unionId = app.globalData.woowoUserInfo.wx_unionid;
  
      util.requestSwitchFollowShops(shopId, unionId).then(res => {
        wx.hideLoading();
  
        if (res.code == 0) {
          wx.showToast({
            title: (data.ifFollowingShop ? '取消' : '关注') + '成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
  
          data.ifFollowingShop = !data.ifFollowingShop;
          util.updateLikedShopsLocally(shopId, data.ifFollowingShop);
          
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
    },

    switchFollowUser: function () {
      let that = this;
      let data = that.data;
  
      let userId = app.globalData.woowoUserInfo.user_id;
      let sellerId = data.userInfo.userId;
  
      wx.showLoading({
        title: data.ifFollowingUser ? "取消中" : "关注中"
      })
  
      util.requestSwitchFollowUser(userId, sellerId)
      .then(res => {
        wx.hideLoading();
    
        if (res.code == 0) {
          wx.showToast({
            title: (data.ifFollowingUser ? '取消' : '关注') + '成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
  
          data.ifFollowingUser = !data.ifFollowingUser;
          util.updateFollowingUserLocally(sellerId, data.ifFollowingUser);
          
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
    },

    goToHomepage: function () {
      let that = this;
      let data = that.data;

      let param = {
        'userUnionId': data.userInfo.userUnionId,
        'username': data.userInfo.username,
        'userAvatarUrl': data.userInfo.userAvatarUrl,
        'userId': data.userInfo.userId
      }
  
      wx.navigateTo({
        url: '../homepage/homepage?' + util.paramObjToStr(param)
      })
    },
  
    goToShop: function () {
      let that = this;
      let data = that.data;
  
      let params = {
        ifMerchant: data.ifMerchant,
        username: data.userInfo.name,
        userUnionId: data.userInfo.wxUnionId,
        userAvatarUrl: data.userInfo.image,
        bgImageUrl: data.userInfo.bgImage,
        description: data.userInfo.description,
        shopId: data.userInfo.id
      }
  
      console.log(params);
  
      wx.navigateTo({
        url: '/pages/homepage/homepage?' + util.paramObjToStr(params)
      })
    },
  },
})
