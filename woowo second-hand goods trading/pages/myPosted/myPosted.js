const util = require('../../utils/util');
const user = require('../../services/user');
const app = getApp();

Page({
  data: {
    currentPage: 0,
    // 0: selling
    // 1: unsell
    sellingList: [],
    unsellList: [],

    ifLoading: false,
    ifNothingForSellingList: false,
    ifNothingForUnsellList: false,
    ifReachBottomForSellingList: false,
    ifReachBottomForUnsellList: false,

    // for modal
    ifShowModal: false,
    modalInfo: {
      transactionId: "",
      transactionType: "",
      tipsTxt: "",
      confirmTxt: "",
      cancelTxt: ""
    },

    stuffs: Number,
    limitation: Number,

    windowHeight: Number,
    navHeight: Number

  },

  onLoad: function () {
    let that = this;
    let data = that.data;

    data.windowHeight = app.globalData.windowHeight;
    data.navHeight = app.globalData.navHeight;
    data.stuffs = app.globalData.woowoUserInfo.user_stuffs;
    data.limitation = app.globalData.woowoUserInfo.user_right == 'business' ? 
      app.globalData.businessLimitaion : app.globalData.normalLimitation;
    
    
    that.setData(data)

    that.requestAllPostedGoods();
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的发布',
      success: function(res) {
        // success
      }
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  
  switchPostedContent: function(event) {
    let that = this;
    that.setData({
      currentPage: event.currentTarget.dataset.cid
    })
  },
  swipPostedContent: function(event) {
    let that = this;
    that.setData({
      currentPage: event.detail.current
    })
  },

  unsellGoods: function(event) {
    let that = this;
    // console.log(event.detail);
    util.triggerOnModal(that, 'unsell', event.detail.goodsId, {
      "tipsTxt": "真的要下架啦？",
      "confirmTxt": "确认",
      "cancelTxt": "取消"
    })
  },
  resellGoods: function(event) {
    let that = this;
    
    // check if reach the limitation 
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    user.checkLimitation().then(res => {
      wx.hideLoading();
      if (res.code == 0) {
        util.triggerOnModal(that, 'resell', event.detail.goodsId, {
          "tipsTxt": "是否确认重新上架？",
          "confirmTxt": "确认",
          "cancelTxt": "取消"
        })
      }
      else {
        wx.showToast({
          title: res.errMsg,
          mask: true,
          icon: 'none',
          success: function() {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
      }
    })
    
  },

  deleteGoods: function (event) {
    let that = this;
    // console.log(event.detail);
    util.triggerOnModal(that, 'delete', event.detail.goodsId, {
      "tipsTxt": "真的要删除掉他吗？",
      "confirmTxt": "确认",
      "cancelTxt": "取消"
    })
  },

  modalconfirm: function (event) {
    let that = this;
    console.log(event.detail);

    let goodsId = Number(event.detail.transactionId);
    let userId = Number(app.globalData.woowoUserInfo.user_id);
    let status = '';

    if (event.detail.transactionType == 'unsell') status = 'private';
    else if (event.detail.transactionType == 'resell') status = 'check';
    else if (event.detail.transactionType == 'delete') status = 'delete';

    wx.showLoading({title: '请求中...'})

    util.requestChangeGoodsStatus(goodsId, userId, status)
    .then(res => {
      if (res.code == 0) {
        that.updateShowingGoods(goodsId, status);

        if (status == 'private') {
          util.updateShelfStatusLocally('check', '');
        }
        else if (status == 'check' || status == 'confirm') {
          util.updateShelfStatusLocally('', 'check');
        }
      }
      wx.hideLoading();
    }) 
    .catch(err => {
      console.log(err);
      wx.hideLoading();
    })
    util.triggerOffModal(that);
  },

  modalCancel: function () {
    let that = this;
    // console.log(event.detail);
    util.triggerOffModal(that);
  },

  updateShowingGoods: function (goodsId, status) {
    let that = this;
    let data = that.data;

    // let sellingList = that.data.sellingList;
    // let unsellList = that.data.unsellList;

    if (status == 'private') {
      let unsellGoodsIndex = -1;
      for (let i = 0, len = data.sellingList.length; i < len; ++i) {
        if (goodsId == data.sellingList[i]['goodsId']) {
          data.unsellList.push(data.sellingList[i]);
          unsellGoodsIndex = i;
          break;
        }
      }
      if (unsellGoodsIndex > -1) {
        data.sellingList.splice(unsellGoodsIndex, 1);
      }
    }
    else if (status == 'confirm' || status == 'check') {
      let resellGoodsIndex = -1;
      for (let i = 0, len = data.unsellList.length; i < len; ++i) {
        if (goodsId == data.unsellList[i]['goodsId']) {
          data.sellingList.push(data.unsellList[i]);
          resellGoodsIndex = i;
          break;
        }
      }
      if (resellGoodsIndex > -1) {
        data.unsellList.splice(resellGoodsIndex, 1);
      }
    }
    else if (status == 'delete') {
      let resellGoodsIndex = -1;
      for (let i = 0, len = data.unsellList.length; i < len; ++i) {
        if (goodsId == data.unsellList[i]['goodsId']) {
          resellGoodsIndex = i;
          break;
        }
      }
      if (resellGoodsIndex > -1) {
        data.unsellList.splice(resellGoodsIndex, 1);
      }
    }

    if (data.sellingList.length == 0) {
      data.ifNothingForSellingList = true;
      data.ifReachBottomForSellingList = false;
    }
    else {
      data.ifReachBottomForSellingList = true;
      data.ifNothingForSellingList = false;
    }

    if (data.unsellList.length == 0) {
      data.ifNothingForUnsellList = true;
      data.ifReachBottomForUnsellList = false;
    }
    else {
      data.ifReachBottomForUnsellList = true;
      data.ifNothingForUnsellList = false;
    }

    that.setData(data);
  },

  requestAllPostedGoods: function () {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    util.requestSellerAllGoods(app.globalData.woowoUserInfo.wx_unionid)
    .then(res => {
      data.ifLoading = false;

      if (res.code == 0) {
        data.sellingList = [];
        data.unsellList = [];

        let goodsList = res.data;

        for (let i = 0, len = goodsList.length; i < len; i++) {
          if (goodsList[i]['status'] == 'check' || goodsList[i]['status'] == 'confirm') {
            data.sellingList.push(goodsList[i]);
          }
          else if (goodsList[i]['status'] == 'private') {
            data.unsellList.push(goodsList[i]);
          }
        }

        if (data.sellingList.length == 0) {
          data.ifNothingForSellingList = true;
          data.ifReachBottomForSellingList = false;
        }
        else {
          data.ifReachBottomForSellingList = true;
          data.ifNothingForSellingList = false;
        }

        if (data.unsellList.length == 0) {
          data.ifNothingForUnsellList = true;
          data.ifReachBottomForUnsellList = false;
        }
        else {
          data.ifReachBottomForUnsellList = true;
          data.ifNothingForUnsellList = false;
        }
      }
      
      else {
        data.ifNothingForSellingList = true;
        data.ifNothingForUnsellList = true;
        
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

  }
})