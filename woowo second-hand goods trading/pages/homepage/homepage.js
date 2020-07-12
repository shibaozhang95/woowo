const util = require('../../utils/util');
const api = require('../../services/api');

const app = getApp();

Page({
  data: {
    navBgColor: 'rgb(246, 182, 45)',


    userInfo: {
      userId: Number,
      username: String,
      userAvatar: String,
      userUnionId: String,
      totalGoodsAccount: Number,
      sellingGoodsAccount: Number,
      showingGoodsList: []
    },

    ifOthersHomepage: false,

    ifFollowing: false,
    ifFollowingShop: false,

    navTitle: 'Woowo 二手市场',

    ifNothing: false,
    ifLoading: false,
    ifReachBottom: false,

    // for shop
    ifMerchant: false,
    bgImageUrl: '',
    description: '',

    // for creating shop cards
    ifShowShareImage: false
  },

  onLoad: function (option) { 
    let that = this;
    let data = that.data;

    console.log(option);
    
    if (option.ifOnlyShopId) {
      data.ifMerchant = true;

      that.setData(data);

      that.requestShopAndGoods(option.shopId);
    }
    else {
      data.userInfo.username = option.username;
      data.userInfo.userAvatar = option.userAvatarUrl;
      data.userInfo.userUnionId = option.userUnionId;
      data.ifOthersHomepage = !that.checkifSelf(option.userUnionId);

      if (option.ifMerchant == 'false') {
        data.userInfo.userId = option.userId;
        data.ifFollowing = util.checkIfFollowingUser(Number(option.userId));
      }

      // for shop
      if (option.ifMerchant == 'true') {
        data.ifMerchant = true;
        data.bgImageUrl = option.bgImageUrl;
        data.description = option.description;
        data.shopId = option.shopId;
        data.ifFollowingShop = util.checkIfFollowingShop(data.shopId);
      }

      that.setData(data);

      that.requestSellerAllGoods(data.userInfo.userUnionId)
    }
    
  },

  onShow: function () {
    let that = this;
    let data = that.data;

    data.ifShowShareImage = false;

    if (data.userInfo.userUnionId) {
      let showTxt = that.data.ifOthersHomepage ? that.data.userInfo.username : '我'
    
      data.navTitle = data.ifMerchant ? '店铺' : (showTxt + '的主页');

      // Here is for after updating shopInfo if it's self
      
      let woowoUserInfo = app.globalData.woowoUserInfo;

      if (that.checkifSelf(data.userInfo.userUnionId)) {
        let shopInfo = woowoUserInfo.shopInfo;

        if (shopInfo && shopInfo.name && shopInfo.image && shopInfo.description) {
          data.userInfo.userAvatar = shopInfo.image;
          data.userInfo.username = decodeURIComponent(shopInfo.name);

          data.description = decodeURIComponent(shopInfo.description);
          data.bgImageUrl = shopInfo.bgImage ? shopInfo.bgImage : ''
        }
      }

      // set the navigation color
      if (data.ifMerchant && data.bgImageUrl.length != 0) {
        data.navBgColor = 'rgb(255,255,255)'
      }

      that.setData(data);
    }
  },

  requestShopAndGoods: function (shopId) {
    let that = this;
    let data = that.data;

    wx.showLoading({
      title: '加载中...'
    })

    util.requestLikedShopsList([shopId]).then(res => {
      wx.hideLoading();

      if (res.code == 0) {
        data.userInfo.username = decodeURIComponent(res.data[0].name);
        data.userInfo.userAvatar = res.data[0].image;
        data.userInfo.userUnionId = res.data[0].wxUnionId;

        data.bgImageUrl = res.data[0].bgImage;
        data.description = decodeURIComponent(res.data[0].description);
        data.shopId = res.data[0].id;

        data.ifOthersHomepage = !that.checkifSelf(data.userInfo.userUnionId);
        data.ifFollowingShop = util.checkIfFollowingShop(data.shopId);

        if (data.ifMerchant && data.bgImageUrl.length != 0) {
          data.navBgColor = 'rgb(255,255,255)'
        }

        that.setData(data);

        that.requestSellerAllGoods(data.userInfo.userUnionId);
      }

      else {
        wx.showToast({
          title: '出错了，请稍后再试~',
          icon: 'none',
          success: () => {
            wx.navigateBack({
              delta: 1
            })
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }
    })
  },

  requestSellerAllGoods: function (userUnionId) {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestSellerAllGoods(userUnionId)
    .then(res => {
      data.ifLoading = false;

      if (res.code == 0) {
        let list = res.data;

        let showingGoodsList = [];
        let totalGoodsAccount = list.length;
        let sellingGoodsAccount = 0;
        for (let i = 0, len = list.length; i < len; ++i) {
          if (list[i]['status'] == 'check' || list[i]['status'] == 'confirm') {
            showingGoodsList.push(list[i]);
            sellingGoodsAccount++;
          }
        }

        data.userInfo.showingGoodsList = showingGoodsList;
        data.userInfo.totalGoodsAccount = totalGoodsAccount;
        data.userInfo.sellingGoodsAccount = sellingGoodsAccount;

        if (showingGoodsList.length == 0) {
          data.ifNothing = true;
          data.ifReachBottom = false;
        }
        else {
          data.ifReachBottom = true;
          data.ifNothing = false;
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

  checkifSelf: function (unionId) {
    let selfUionId = app.globalData.woowoUserInfo.wx_unionid;

    return (unionId == selfUionId ? true : false)
  },

  switchFollowUser: function () {
    let that = this;
    
    let userId = app.globalData.woowoUserInfo.user_id;
    let sellerId = that.data.userInfo.userId;

    wx.showLoading({
      title: that.data.ifFollowing ? "取消中" : "关注中"
    })
    util.requestSwitchFollowUser(userId, sellerId)
    .then(res => {
      console.log(res);
      if (res.code == 0) {
    
        that.setData({
          ifFollowing: !that.data.ifFollowing
        })
        util.updateFollowingUserLocally(sellerId, that.data.ifFollowing)
      }
      wx.hideLoading();
    })
    .catch(err => {
      console.log(err)
    })
  },

  switchFollowShop: function () {
    let that = this;
    let data = that.data;

    wx.showLoading({
      title: data.ifFollowingShop ? "取消中" : "关注中"
    })

    let shopId = data.shopId;
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

  editShopInfo: function () {
    let that = this;

    wx.navigateTo({
      url: '/pages/shopInfo/shopInfo'
    })
  },

  turnOffShareImage: function () {
    let that = this;
    let data = that.data;

    data.ifShowShareImage = false;

    that.setData(data);
  },

  createShopCard: function () {
    let that = this;
    let data = that.data;

    data.ifShowShareImage = true;

    that.setData(data);
  }
})