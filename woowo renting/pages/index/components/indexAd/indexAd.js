const util = require('../../../../utils/util')

// indexAd.js
Component({
  /**
   * Component properties
   */
  properties: {
    
  },

  /**
   * Component initial data
   */
  data: {
    ads: [
    {
      imgUrl: '/statics/images/banner_page_mofaguanjia_zufang.png',
      src: '/pages/activities/activities',
      openType: 'page',
      params: 'qingjie'
    }, 
    {
      imgUrl: '/statics/images/banner_goto_ershou.png',
      src: 'pages/index/index',
      openType: 'miniProgram',
      appId: 'wx8d5c44e08ac1dc3e'
    }, 
    // yangtuo
    // {
    //   imgUrl: '/statics/images/banner_miniprogram_yangtuo.png',
    //   src: 'pages/login/login',
    //   openType: 'miniProgram',
    //   appId: 'wxc3e43cb4472891ef',
    //   params: 'gofrom=wx7bbbffe2b11138f8'
    // }, 
    {
      imgUrl: '/statics/images/banner_about_us.png',
      src: '/pages/aboutUs/aboutUs',
      openType: 'page'
    }],

    adsDots: [],

    swiperConfig: {
      autoplay: true,
      interval: 4000,
      duration: 500,
      circular: false,
      vertical: false,
      indicatorDots: false
    }
  },

  /**
   * Component methods
   */
  methods: {
    bannerChange: function (event) {
      let that = this;

      let currIndex = event.detail.current;

      let adsDots = that.data.adsDots;
      for (let i = 0, len = adsDots.length; i < len; ++i) {
        adsDots[i] = false;
      }

      adsDots[currIndex] = true;
      that.setData({ 
        'adsDots': adsDots
      })
    },

    clickOnBanner: function (event) {
      let item = event.currentTarget.dataset.item;

      // this is for analysis
      if (item.params) {
        util.requestSourceAnalysis(item.params).then(res => {
          if (res.code == 0) {
            console.log('Source analysis succeed')
          }
          else {
            console.log('Source analysis failed')
          }
        })
      }

      if (item.openType == 'miniProgram') {
        wx.navigateToMiniProgram({
          appId: item.appId,
          path: item.src + (item.params ? ('?' + item.params) : ''),
          envVersion: 'release',
          success: () => {
            console.log('跳转成功');
          },
          fail: () => {
            console.log('用户拒绝跳转');
          }
        })
      }
      else if (item.openType == 'page') {
        wx.navigateTo({
          url: item.src
        })
      }
      else if (item.openType == 'article') {
        wx.navigateTo({
          url: '/pages/article/article?url=' + item.src
        })
      }
      else if (item.openType == 'preview') {
        wx.previewImage({
          current: item.src,
          urls: [item.src]
        })

        
      }
    }
  },

  ready: function () {
    let that = this;

    // initialize ads dots
    let adsDots = [];
    for (let i = 0, len = that.data.ads.length; i < len; ++i) {
      adsDots.push(false);
    }

    if (adsDots.length > 0) {
      adsDots[0] = true;
    }

    that.setData({
      'adsDots': adsDots
    })
  }
})
