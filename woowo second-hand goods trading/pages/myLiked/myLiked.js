const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    myLikedList: [],

    // for modal
    ifShowModal: false,
    modalInfo: {
      transactionId: "",
      transactionType: "",
      tipsTxt: "",
      confirmTxt: "",
      cancelTxt: ""
    },

    ifNothing: false,
    ifLoading: false,
    ifReachBottom: false
  },

  onLoad: function () {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);
    
    util.requestAllLikedGoods(app.globalData.woowoUserInfo.liked)
    .then(res => {
      if (res.code == 0) {
        data.ifLoading = false;
      
        data.myLikedList = res.data;
        
        if (data.myLikedList.length == 0) {
          data.ifNothing = true;
        }
        else {
          data.ifReachBottom = true;
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

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的收藏',
      success: function(res) {
        // success
      }
    })
  },

  unlikeGoods: function (event) {
    let that = this;
    // console.log(event.detail);
    util.triggerOnModal(that, 'unlike', event.detail.goodsId, {
      "tipsTxt": "真的要取消吗？",
      "confirmTxt": "确认",
      "cancelTxt": "取消"
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  
  modalconfirm: function (event) {
    let that = this;
    console.log(event.detail);
    
    util.triggerOffModal(that);

    wx.showLoading({title: '取消中...'});
    let goodsId = event.detail.transactionId;
    util.requestSwitchLikeGoods(Number(app.globalData.woowoUserInfo.user_id),goodsId)
    .then(res => {
      if (res.code == 0) {
        that.deleteGoodsFromShowingList(goodsId);
        util.updateLikedGoodsLocally(goodsId);
        wx.hideLoading();
      }
    })
    .catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },

  deleteGoodsFromShowingList: function (goodsId) {
    let that = this;
    let goodsIndex = -1;
    let goodsList = that.data.myLikedList;

    for (let i = 0, len = goodsList.length; i < len; ++i) {
      if (goodsList[i].goodsId == goodsId) {
        goodsIndex = i;
        break;
      }
    }

    if (goodsIndex > -1) goodsList.splice(goodsIndex, 1)

    that.setData({
      'myLikedList': goodsList
    })
  },
  modalCancel: function () {
    let that = this;
    // console.log(event.detail);
    util.triggerOffModal(that);
  }
})