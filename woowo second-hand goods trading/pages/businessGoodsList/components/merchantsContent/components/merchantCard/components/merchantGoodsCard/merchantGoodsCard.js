// pages/businessGoodsList/components/merchantsContent/components/merchantCard/merchantGoodsCard/merchantGoodsCard.js
const user = require('../../../../../../../../services/user')

Component({
  /**
   * Component properties
   */
  properties: {
    goodsInfo: {
      type: Object,
      value: {

      },
      observer (newVal, oldVal) {
        let that = this;
        let data = that.data;

        if (newVal && newVal.product_image) {
          data.cover = newVal.product_image.split(';')[0];
        }
        
        that.setData(data);
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    cover: ''
  },

  ready: function () {
    
  },

  /**
   * Component methods
   */
  methods: {
    goToGoodsDetail: function () {
      let that = this;
      let data = that.data;
      console.log(data.goodsInfo);

      user.checkIfLogedin().then(res => {
        if (res.ifLogedin) {
          wx.navigateTo({
            url: '/pages/goodsDetail/goodsDetail?goFurther=true&goodsId=' + data.goodsInfo.product_id
          })
        }
        else {
          wx.showToast({
            title: '请先登录哦～',
            icon: 'none',
            mask: false,
            success: () => {
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }
          })
        }
      })
    }
  }
})
