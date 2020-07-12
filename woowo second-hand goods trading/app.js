const user = require('services/user.js');
const areas = require('utils/areas.js');
const shop = require('utils/shop.js');

//app.js
App({
  onLaunch: function (option) {
    let that = this;
    
    wx.getSystemInfo({
      success: function(res) {
            
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight + 50;
        
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.screenHeight = res.screenHeight;
        that.globalData.screenWidth = res.screenWidth;
        that.globalData.navHeight = res.statusBarHeight + that.globalData.defaultNavBarHeight;

        that.globalData.bottomGapHeight = res.screenHeight - res.windowHeight - that.globalData.wechatTabBarHeight;

        if (res.model.search('iPhone X') != -1) {
          that.globalData.isIPX = true;

          that.globalData.windowHeight += 34;
        }

      }
    });


    /**
     *  FOR MULTIPLE AREAS
     */
    let state = areas.checkStateSync();

    if (state) {
      that.globalData.state = state;
    }
    else {
      that.globalData.state = '不限地区';
      console.log('Do not have default state');
    }

    /** 
     * FOR LOGIN
     */
    let woowoUserInfo;

    let value = wx.getStorageSync('woowoUserInfo');
    if (value) {
      // update locally first
      that.globalData.woowoUserInfo = value;
      
      user.login(value, value.wx_unionid).then(res => {
        if (res.ifLogedin == true) {
          woowoUserInfo = res.woowoUserInfo;

          that.globalData.woowoUserInfo = woowoUserInfo;

          shop.shopInfoCheck(woowoUserInfo);
          console.log('Login successfully!');
        }
        else {
          wx.showToast({
            title: '登录失败，错误代码：' + res.errMsg,
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast();
              }, 5000)
            }
          })
        }
      })
      
    }

    
  },

  globalData: {
    userInfo: null,
    woowoUserInfo: null,
    showLoginAuth: true,
    unionId: null,
    openid: null,
    ifFirstShowLoginAuth: true,
    notificationList: [],
    unreadNotificationAccount: 0,

    businessLimitation: 8,
    normalLimitation: 5,

    isIPX: false,
    windowWidth: 0,
    windowHeight: 0,
    navHeight: 0,
    statusBarHeight: 0,
    screenHeight: 0,
    screenWidth: 0,
    bottomGapHeight: 0,

    defaultNavBarHeight: 44,
    wechatTabBarHeight: 48,
    wnTabBarHeight: 50, 
    // wechat default is 48, wn default is 65

    ifCustomNav: true,

    formIdList: [],

    // FOR MULTIPLE AREAS
    state: '',

    //
    loadItems: 20,

    // For image
    IMAGE_STYLE: '-scale_50'
  }
})