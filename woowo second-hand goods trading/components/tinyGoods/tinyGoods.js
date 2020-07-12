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
        "status": String
      }
    }
  },

  data: {
    IMAGE_STYLE: String
  },

  methods: {
    goToGoodsDetail: function (event) {
      console.log(event)
      let goodsId = event.currentTarget.dataset.goodsId;

      console.log(goodsId);
      wx.navigateTo({
        url: '../../pages/goodsDetail/goodsDetail?goFurther=false&goodsId=' + goodsId
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