const util = require('../../utils/util');
const app = getApp();

Component({
  properties: {
    "goodsInfo": {
      type: Object,
      value: {
        "sellerName": String,
        "sellerAvatarUrl": String,
        "sellerWechatId": String,
        "sellerWechatQR": String,
        "sellerUnionId": String,
        "sellerPhoneNumber": String,

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
        "Status": String
      }
    },
    showingType: String,
    // 0: liked
    // 1: selling
    // 2: unsell
  },

  data: {
    ifOutLimitation: false,
    IMAGE_STYLE: String
  },

  methods: {
    editProduct: function (event) {
      let that = this;

      let goodsId = event.currentTarget.dataset.goodsId;
      console.log(event)
      let option = "kind=edit&productId=" + goodsId
      wx.navigateTo({
        url: '../sale/sale?' + option,
      })

    },
    unsellGoods: function (event) {
      let that = this;
      
      that.triggerEvent('unsell', {
        goodsId: event.currentTarget.dataset.goodsId
      })
    },
    resellGoods: function (event) {
      let that = this;
      that.triggerEvent('resell', {
        goodsId: event.currentTarget.dataset.goodsId
      })
    },
    deleteGoods: function (event) {
      let that = this;
      that.triggerEvent('delete', {
        goodsId: event.currentTarget.dataset.goodsId
      })
    },
    unlikeGoods: function (event) {
      let that = this;
      that.triggerEvent('unlike', {
        goodsId: event.currentTarget.dataset.goodsId
      })
    },
    promoteGoods: function (event) {
      let that = this;
      
      if (that.data.ifOutLimitation == true) {
        wx.showToast({
          title: '你已超过今日置顶上限，明天再来试试吧~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        })
      }

      else {
        let goodsId = event.currentTarget.dataset.goodsId;
        let userId = app.globalData.woowoUserInfo.user_id;
        util.requestPromoteGood(goodsId, userId)
        .then(res => {
          if (res.code == 0) {
            wx.showToast({
              title: '置顶成功！',
              icon: 'success',
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
                }, 3000)
              }
            })
          }
          else {
            wx.showToast({
              title: '你已超过今日置顶上限，明天再来试试吧~',
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
                }, 3000)
              }
            })
            that.setData({
              ifOutLimitation: true
            })
          }
        })
      }
    },

    goToGoodsDetail: function (event) {
      let that = this;

      let goodsId = event.currentTarget.dataset.goodsId;
      let showingType = event.currentTarget.dataset.showingType;
      let status = event.currentTarget.dataset.goodsStatus;

      // cannot touch if it's unsell
      if (showingType == 'unsell') return 
      // cannot touch if it's unsell in my liked list
      if (showingType == 'liked' && (status == 'private' || status == 'delete')) {
        wx.showToast({
          title: '商品已经下架了哦~',
          mask: true,
          icon: 'none',
          success: function() {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
        return
      }

      wx.navigateTo({
        url: '../../pages/goodsDetail/goodsDetail?goFurther=true&goodsId=' + goodsId
      })
    }
  },

  ready: function () {
    let that = this;

    that.setData({
      IMAGE_STYLE: app.globalData.IMAGE_STYLE ? app.globalData.IMAGE_STYLE : ''
    })
  }
})