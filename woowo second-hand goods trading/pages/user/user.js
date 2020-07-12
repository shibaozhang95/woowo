const app = getApp();
const user = require('../../services/user');
const util = require('../../utils/util');
const shop = require('../../utils/shop');

Page({
  data: {
    userInfo: {
      avatarUrl: "",
      username: "Hi, 游客(点击登录)",
      ifSeller: false
    },

    shopInfo: {
      avatarUrl: "",
      username: "请先完善店铺信息！",
      bgImageUrl: '',
      description: ''
    },

    ifMerchant: false,

    showLoginAuth: false,
    unreadNotificationAccount: 0
  },

  onShow: function () {
    let that = this;
    let data = that.data;

    wx.hideTabBar();
    wx.setNavigationBarTitle({
      title: "个人中心"
    });

    // update shopInfo
    // let woowoUserInfo = app.globalData.woowoUserInfo;
    // let shopInfo = woowoUserInfo.shopInfo;

    // if (shopInfo && shopInfo.name && shopInfo.image) {
    //   data.shopInfo.avatarUrl = shopInfo.image;
    //   data.shopInfo.username = decodeURIComponent(shopInfo.name);
    //   data.shopInfo.bgImageUrl = shopInfo.bgImage ? shopInfo.bgImage : '';
    //   data.shopInfo.description = decodeURIComponent(shopInfo.description);

    //   that.setData(data);
    // }
    let woowoUserInfo = app.globalData.woowoUserInfo;
    // data initialization
    if (woowoUserInfo) {
      data.userInfo.avatarUrl = woowoUserInfo.user_image;
      data.userInfo.username = woowoUserInfo.username;

      if (woowoUserInfo.user_right == 'shop') {
        data.ifMerchant = true;

        let shopInfo = woowoUserInfo.shopInfo;

        if (shopInfo && shopInfo.name && shopInfo.image) {
          data.shopInfo.avatarUrl = shopInfo.image;
          data.shopInfo.username = decodeURIComponent(shopInfo.name);
          data.shopInfo.bgImageUrl = shopInfo.bgImage ? shopInfo.bgImage : '';
          data.shopInfo.description = decodeURIComponent(shopInfo.description);
          data.shopInfo.id = shopInfo.id
        }
      }

      shop.shopInfoCheck(woowoUserInfo);
    }
    
    that.setData(data);
  },

  onLoad: function () {
    let that = this;
    let data = that.data;
    // console.log(app.globalData.userInfo);
    
  },

  navigateToHomepage: function () {
    let that = this;
    let data = that.data;

    

    user.checkIfLogedin().then(res => {
      if (res.ifLogedin) {
        let shopCheckResult = shop.shopInfoCheck(app.globalData.woowoUserInfo);

        if (shopCheckResult == false) {
          return ;
        }

        let info = data.ifMerchant ? data.shopInfo : data.userInfo;

        let param = {
          ifMerchant: data.ifMerchant,
          bgImageUrl: data.ifMerchant ? info.bgImageUrl : '',
          description: data.ifMerchant ? info.description : '',
          shopId: data.ifMerchant ? info.id : '',

          username: info.username,
          userAvatarUrl: info.avatarUrl,
          userUnionId: app.globalData.woowoUserInfo.wx_unionid,
          userId: app.globalData.woowoUserInfo.user_id,
        }

        console.log(param);
        wx.navigateTo({
          url: '../homepage/homepage?' + util.paramObjToStr(param),
          success: function(res){
            console.log(res);
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      }
      else {
        that.setData({
          showLoginAuth: true
        })
      }
    })

    // // if already login
    // if (app.globalData.woowoUserInfo) {
      
    // }
    // // ask to login
    // else {
      
    // }
  },

  loginSuccess: function (event) {
    // update user info
    let that = this;
    let data = that.data;

    let woowoUserInfo = event.detail;
    
    data.showLoginAuth = false;
    // console.log(event)
    // that.setData({
    //   ['userInfo.avatarUrl']: event.detail.user_image,
    //   ['userInfo.username']: event.detail.username,
    // })

    data.userInfo.avatarUrl = woowoUserInfo.user_image;
    data.userInfo.username = woowoUserInfo.username;

    if (woowoUserInfo.user_right == 'shop') {
      data.ifMerchant = true;

      let shopInfo = woowoUserInfo.shopInfo;

      if (shopInfo && shopInfo.name && shopInfo.image) {
        data.shopInfo.avatarUrl = shopInfo.image;
        data.shopInfo.username = decodeURIComponent(shopInfo.name);
        data.shopInfo.bgImageUrl = shopInfo.bgImage ? shopInfo.bgImage : '';
        data.shopInfo.description = decodeURIComponent(shopInfo.description);
        data.shopInfo.id = shopInfo.id
      }
    }

    shop.shopInfoCheck(woowoUserInfo);

    that.setData(data);
  },

  navigateTo: function (event) {
    let that = this;
    
    user.checkIfLogedin()
    .then(res => {
      if (res.ifLogedin) {
        
        if (event.currentTarget.dataset.towhere == '../myMessages/myMessages') {
          that.setData({
            unreadNotificationAccount: 0
          })
        }
        wx.navigateTo({
          url: event.currentTarget.dataset.towhere
        })
      }
      else {
        wx.showToast({
          title: '请先登录哦~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  unreadAccount: function (event) {
    let that = this;
    let account = event.detail.unreadNotificationAccount;
    // console.log(event)
    that.setData({
      unreadNotificationAccount: account
    })

    // console.log('get notifications:' + account);
  },

  collectFormId: function(event) {
    
    // console.log(event.detail.formId);
    app.globalData.formIdList.push({
      'formId': event.detail.formId,
      'date': Date.now()
    })
  }
})