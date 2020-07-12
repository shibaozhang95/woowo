const util = require('../../utils/util');
const api = require('../../services/api');
const user = require('../../services/user');

const app = getApp();

Page({
  data: {
    seller: {
      "sellerAvatarUrl": "",
      "sellerName": "Artemis ye",
      "sellerUnionId": "",
      "sellerId": "",
      "ifFollowing": false,
      "phone": "0410333333",
      "wechat": "kdjfalskdj022",
      "otherGoodsList": []
    },

    goodsDetail: {
      "sellerName": String,
      "sellerAvatarUrl": String,
      "sellerWechatId": String,
      "sellerWechatQR": String,
      "sellerUnionId": String,
      "sellerPhoneNumber": String,
      "sellerId": String,

      "goodsId": Number,
      "goodsTitle": String,
      "goodsPrice": Number,
      "goodsDes": String,
      "goodsArea": String,
      "goodsRegion": String,
      "goodsCondition": String,
      
      "goodsPicsUrl": Array,
      "goodsMainCat": String,
      "goodsSubCat": String,
      "goodsLikedAccount": Number,
      "goodsShipWays": Array,

      "postDate": Number,
      "status": String,

      "formatedPostDate": String
    },

    goodsId: Number,
    goFurther: false,

    ifLikedGoods: false,
    ifFollowingUser: false,
    showLoginAuth: false,
    ifShowReportModal: false,
    ifReported: false,

    ifOwnGoods: false,

    ifShowShareImage: false,
    ifShared: false,

    isIPX: false,

    IMAGE_STYLE: String,

    ifMerchant: false,
    shopInfo: {},
    ifFollowingShop: false
  },

  onLoad: function (option) {
    let that = this;

    // For adjusting IPhoneX screen;  
    that.setData({
      isIPX: app.globalData.isIPX,
      IMAGE_STYLE: app.globalData.IMAGE_STYLE ? app.globalData.IMAGE_STYLE : ''
    })
    
    console.log(option)
    // console.log(JSON.stringify(option) + "------")
    if (option.scene != undefined){
      var scene = decodeURIComponent(option.scene)
      that.setData({
        goodsId: Number(scene),
        goFurther: true,
        ifLikedGoods: util.checkIfLikedGoods(Number(scene)),
      });
    } else{
      that.setData({
        goodsId: Number(option.goodsId),
        goFurther: option.goFurther == "false" ? false : true,
        ifLikedGoods: util.checkIfLikedGoods(Number(option.goodsId)),
      });
    }
  
    // load goods detail
    wx.showLoading({title: '数据加载中...', mask: true});
    that.requestGoodsDetail(that.data.goodsId)
    .then(res => {
      wx.hideLoading();

      let goodsDetail = util.formatData.goodsInfo(res);

      // formate post data
      goodsDetail[0].formatedPostDate = util.formatTime(new Date(goodsDetail[0].postDate));

      that.setData({
        goodsDetail: goodsDetail[0]
      })
      
      
      // shopInfo here
      let data = that.data;
      if (that.data.goodsDetail.shopId) {
        data.ifMerchant = true;
        data.shopInfo = data.goodsDetail.shopDetail;
        data.shopInfo.name = decodeURIComponent(data.shopInfo.name);
        data.shopInfo.description = decodeURIComponent(data.shopInfo.description);

        data.ifFollowingShop = util.checkIfFollowingShop(data.shopInfo.id);

        that.setData(data);
      }
    
      if (that.data.goodsDetail.status != 'check') {
        wx.showModal({
          title: '提示',
          content: '该商品已被下架或者删除，去看看其他的吧~',
          showCancel: false,
          success: (res) => {
            wx.navigateBack({
              delta: 1
            })
          },
          fail: () => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
    .then(res => {
      that.requestViewAddUpCount(that.data.goodsId, option.fromShare || false);
    })
    .then(() => {
      that.setData({
        ['seller.ifFollowing']: util.checkIfFollowingUser(that.data.goodsDetail.sellerId),
        ifOwnGoods: util.checkIfOwnGoods(that.data.goodsDetail.sellerId)
      })
      console.log('load others goods')
      that.requestSellerOtherGoods(that.data.goodsDetail.sellerUnionId)
      .then(res => {
        // elimite the same one as showing in current goods detail page
        let otherGoodsList = [];
        let currentGoodsId = that.data.goodsDetail.goodsId;
        for (let i = 0, len = res.length; i < len; ++i) {
          if (currentGoodsId != res[i].goodsId) {
            otherGoodsList.push(res[i]);
          }
        }

        that.setData({
          ['seller.otherGoodsList']: otherGoodsList
        })
      })
    })
    .catch(err => {
      console.log(err);
      wx.hideLoading();
    })
    
  },

  onShareAppMessage: function () {
    let that = this;
    return {
      title: "我在Woowo淘到的二手商品 "+ that.data.goodsDetail.goodsTitle + " 快来买吧！",
      path: '/pages/index/index?goodsId=' + that.data.goodsDetail.goodsId
    }
  },

  turnOnShareImage: function () {
    let that = this;

    that.setData({
      'ifShowShareImage': true
    })
  },

  turnOffShareImage: function (event) {
    let that = this;
  
    that.setData({
      'ifShowShareImage': false,
      'ifShared': event.detail.success ? true : false
    })
  },

  requestGoodsDetail: function (goodsId) {
    return new Promise((resolve, reject) => {
      util.request(api.GetCertainProduct, {
        product_id: goodsId
      }, 'POST')
      .then(res => {
        if (res.data.code == 0) {
          resolve(res.data.data);
        }
        else {
          throw new Error('Something wrong, when request goods detail');
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
    })
  },

  requestViewAddUpCount: function (goodsId, ifShared) {
    console.log(ifShared)
    return new Promise((resolve, reject) => {
      let params = {
        product_id: goodsId
      }

      if (ifShared) {
        params.shareCode = "userShare"
      }

      util.request(api.ViewCountAddUp, {
        ...params
      }, 'POST')
        .then(res => {
          if (res.data.code == 0) {
            // resolve(res.data.data);
          }
          else {
            throw new Error('Something wrong, when request goods detail');
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  },

  requestSellerOtherGoods: function (sellerUnionId) {
    return new Promise((resolve, reject) => {

      let filter = {
        sellerUnionId: sellerUnionId
      }

      let formatedFilter = util.formatData.filter(0, 6, filter);
      
      util.request(api.GetFilteredProduct, formatedFilter, 'POST')
      .then(res => {
        if (res.data.code == 0) {
          resolve(util.formatData.goodsInfo(res.data.data));
        }
        else {
          throw new Error('Something wrong, when request other goods list');
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
    })
  },

  callSeller: function (event) {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.goodsDetail.sellerPhoneNumber,
      success: function() {
        console.log('call successfully')
      }
    })
  },

  touchCopy: function (event) {
    console.log(event);

    wx.setClipboardData({
      data: event.currentTarget.dataset.content
    })
  },

  refuseLoginAuth: function () {
    wx.navigateBack({});
  },

  goToHomepage: function () {
    let that = this;
    let param = {
      'userUnionId': that.data.goodsDetail.sellerUnionId,
      'username': that.data.goodsDetail.sellerName,
      'userAvatarUrl': that.data.goodsDetail.sellerAvatarUrl,
      'userId': that.data.goodsDetail.sellerId
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
      username: data.shopInfo.name,
      userUnionId: data.shopInfo.wxUnionId,
      userAvatarUrl: data.shopInfo.image,
      bgImageUrl: data.shopInfo.bgImage,
      description: data.shopInfo.description,
      shopId: data.shopInfo.id
    }

    console.log(params);

    wx.navigateTo({
      url: '/pages/homepage/homepage?' + util.paramObjToStr(params)
    })
  },

  goToIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  
  switchLikeGoods: function () {
    let that = this;

    console.log(app.globalData);

    let userId = Number(app.globalData.woowoUserInfo.user_id);
    let goodsId = Number(that.data.goodsId);

    wx.showLoading({
      title: that.data.ifLikedGoods ? '取消中...' : '收藏中...',
      mask: true
    })
    util.requestSwitchLikeGoods(userId, goodsId)
    .then(res => {
      console.log(res)
      if (res.code != 0) {
        throw new Error('Something wrong');
      }

      that.updateLocalData(!that.data.ifLikedGoods, goodsId);

      that.setData({
        ifLikedGoods: !that.data.ifLikedGoods
      })

      wx.hideLoading();
    })
    .catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },

  switchFollowShops: function () {
    let that = this;
    let data = that.data;

    wx.showLoading({
      title: data.ifFollowingShop ? "取消中" : "关注中"
    })

    let shopId = data.shopInfo.id;
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

  updateLocalData: function (ifLikedGoods, goodsId) {
    // ifLikedGoods is the status after swicthed

    let that = this;

    // update like account
    let goodsLikedAccount = that.data.goodsDetail.goodsLikedAccount
    goodsLikedAccount = ifLikedGoods ? (goodsLikedAccount + 1) : (goodsLikedAccount - 1);
    that.setData({
      ['goodsDetail.goodsLikedAccount']: goodsLikedAccount
    })

    // update app.globalData.woowoUserInfo
    util.updateLikedGoodsLocally(goodsId, ifLikedGoods)

    console.log(app.globalData.woowoUserInfo);
  },

  switchFollowUser: function () {
    let that = this;
    
    let userId = app.globalData.woowoUserInfo.user_id;
    let sellerId = that.data.goodsDetail.sellerId;

    wx.showLoading({
      title: that.data.seller.ifFollowing ? "取消中" : "关注中"
    })
    util.requestSwitchFollowUser(userId, sellerId)
    .then(res => {
      console.log(res);
      if (res.code == 0) {
    
        that.setData({
          ['seller.ifFollowing']: !that.data.seller.ifFollowing
        })
        util.updateFollowingUserLocally(sellerId, that.data.seller.ifFollowing)
      }
      wx.hideLoading();
    })
    .catch(err => {
      console.log(err)
    })
  },

  turnOnReportModal: function () {
    let that = this;
    that.setData({
      ifShowReportModal: true
    })
  },

  turnOffReportModal: function () {
    let that = this;
    that.setData({
      ifShowReportModal: false
    })
  },

  reportGoods: function (event) {
    wx.showLoading({
      title: '举报中...'
    })
    let that = this;
    let type = event.detail.type;
    let content = event.detail.content;
    let goodsId = that.data.goodsDetail.goodsId;

    util.requsetReportGoods(type, goodsId, content)
    .then(res => {

      wx.hideLoading();
      that.turnOffReportModal();

      let toastTitle = "";
      if (res.code == 0) {
        toastTitle = '举报成功！';
        that.setData({
          ifReported: true
        })
      }
      else {
        toastTitle = '出错了，稍后再试'
      }

      wx.showToast({
        title: toastTitle,
        mask: true,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }
      })
    })
  },

  previewImage: function (event) {
    let that = this;
    
    let goodsPicsUrl = [];
    // changing http to https
    for (let i = 0, len = that.data.goodsDetail.goodsPicsUrl.length; i < len; ++i) {
      goodsPicsUrl.push(that.data.goodsDetail.goodsPicsUrl[i].replace('http:', 'https:'));
    }

    console.log(goodsPicsUrl);

    wx.previewImage({
      current: event.currentTarget.dataset.current.replace('http:', 'https:'),
      urls: goodsPicsUrl
    })
  },

  previewQRCode: function (event) {
    let that = this;

    wx.previewImage({
      urls: [event.currentTarget.dataset.url.replace('http:', 'https:')]
    })
  }
})