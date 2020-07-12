const util = require('../../utils/util.js');
const user = require('../../services/user');
const app = getApp();

Component({
  properties: {
    goodsInfo: {
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
    }
  },

  data: { 
    formatDate: String,
    IMAGE_STYLE: String,

    ifMerchant: false,
    shopInfo: {}
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.formatDate = util.formatDate(that.data.goodsInfo.postDate);
    data.IMAGE_STYLE = app.globalData.IMAGE_STYLE ? app.globalData.IMAGE_STYLE : '';

    if (data.goodsInfo.shopId) {
      data.ifMerchant = true;
      data.shopInfo = data.goodsInfo.shopDetail;

      data.shopInfo.name = decodeURIComponent(data.shopInfo.name);
      data.shopInfo.description = decodeURIComponent(data.shopInfo.description);
    }

    that.setData(data);
  },

  methods: {
    goToGoodsDetail: function () {
      user.checkIfLogedin()
      .then(res => {
        if (res.ifLogedin) {
          let that = this;
          wx.navigateTo({
            url: '../../pages/goodsDetail/goodsDetail?goFurther=true&goodsId=' + that.data.goodsInfo.goodsId
          })
        }
        else {
          wx.showToast({
            title: '请先登录哦~',
            icon: 'none',
            mask: false,
            success: function() {
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }
          })
        }
      })
      
    },

    collectFormId: function(event) {
      app.globalData.formIdList.push({
        'formId': event.detail.formId,
        'date': Date.now()
      })
    }
  },

  
})
