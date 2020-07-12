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
        "status": String
      }
    }
  },

  data: { 
    formatDate: String,
    IMAGE_STYLE: String
  },

  methods: {
    goToGoodsDetail: function () {
      let that = this;

      wx.navigateTo({
        url: '../../pages/goodsDetail/goodsDetail?goFurther=false&goodsId=' + that.data.goodsInfo.goodsId
      })
    },


  },

  ready: function () {
    let that = this;

    that.setData({
      formatDate: util.formatDate(that.data.goodsInfo.postDate),
      IMAGE_STYLE: app.globalData.IMAGE_STYLE ? app.globalData.IMAGE_STYLE : ''
    })
  }

})