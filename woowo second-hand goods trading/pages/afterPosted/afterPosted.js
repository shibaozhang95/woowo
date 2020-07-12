Page({
  data: {
    sharingList: [
      // {
      //   iconUrl: "../../statics/images/icon_sharing_wechat@2x.png",
      //   title: "微信"
      // }, 
      {
        iconUrl: "../../statics/images/icon_sharing_moments@2x.png",
        title: "生成商品二维码"
      }
      // , {
      //   iconUrl: "../../statics/images/icon_sharing_qq@2x.png",
      //   title: "QQ"
      // }, {
      //   iconUrl: "../../statics/images/icon_sharing_weibo@2x.png",
      //   title: "新浪微博"
      // }
    ],

    goodsId: Number,
    goodsTitle: String,
    goodsCover: String,

    ifShowShareImage: false,
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '发布成功',
      success: function(res) {
        // success
      }
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  
  onShareAppMessage: function () {
    let that = this;
    return {
      title: "我在Woowo发布的二手商品 "+ that.data.goodsTitle + " 快来买吧！",
      path: '/pages/goodsDetail/goodsDetail?goodsId=' + that.data.goodsId,
      imageUrl: that.data.goodsCover.replace('http:', 'https:')
    }
  },

  onLoad: function (option) {
    console.log(option)
    let that = this;

    that.setData({
      goodsId: Number(option.goodsId),
      goodsTitle: option.goodsTitle,
      goodsCover: option.goodsCover,
      goodsPrice: option.goodsPrice
    })
  },

  goToGoodsDetail: function () {
    let that = this;

    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goFurther=false&goodsId=' + that.data.goodsId
    })
  },

  goToIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },

  shareToOthers: function (event) {
    let that = this;
    let shareTitle = event.currentTarget.dataset.title;

    if (shareTitle == '微信') {
      wx.showShareMenu({
        withShareTicket: true,
      });
    }
    else if (shareTitle == '朋友圈') {
      that.setData({
        ifShowShareImage: true
      })
    }
    else {
      wx.showToast({
        title: '暂未开通',
        mask: true,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 3000)
        }
      })
    }
  },

  turnOffShareImage: function () {
    let that = this;

    that.setData({
      ifShowShareImage: false
    })
  },

  onUnload: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})