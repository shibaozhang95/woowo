const user = require('../../services/user');
const util = require('../../utils/util');
const shop = require('../../utils/shop');
const app = getApp();

// tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "isHome": {
      type: Boolean,
      value: false
    },
    "isUser": {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    "showLoginAuth": false,
    "unreadNotificationAccount": 0,

    "isIPX": false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToSell: function () {
      let that = this;

      let shopCheckResult = shop.shopInfoCheck(app.globalData.woowoUserInfo);

      if (shopCheckResult == false) {
        return;
      }
      
      setTimeout(() => {
        user.checkIfLogedin()
        .then(res => {
          if (res.ifLogedin) {
            wx.showLoading({
              title: '加载中...',
              mask: true
            })
            user.checkLimitation().then(res => {
              wx.hideLoading();
              if (res.code == 0) {
                wx.navigateTo({
                  url: '../sale/sale'
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
                    }, 3000)
                  }
                })
              }
            })
            
          }
          else {
            that.setData({
              "showLoginAuth": true
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      }, 0)
      
    },

    loginSuccess: function () {
      wx.navigateTo({
        url: '../sale/sale'
      })
    },

    triggerUploadFormId: function () {
      console.log('trigger');
      let formIdList = [];
      
      for (let i = 0, len = app.globalData.formIdList.length; i < len; ++i) {
        let oneItem = app.globalData.formIdList[i];
        formIdList.push(oneItem);
      }

      // destory
      app.globalData.formIdList = [];  

      // No formId in the list
      if (formIdList.length == 0) return; 

      user.getOpenid().then(res => {
        if (res.openid) {
          console.log(res.openid);
          console.log(formIdList);

          util.uploadFormId({'openId': res.openid, 'formIds': formIdList})
          .then(res => {
            if (res.code == 0) {
              console.log('Upload formId successfully');
            }
            else {
              console.log('Faild to upload formId!!!!!')
            }
          })
        }

        else {
          console.log('Get openid failed')
        }
      })
    }
  },

  ready: function () {
    let that = this;

    that.setData({
      "isIPX": app.globalData.isIPX
    })


    if (!app.globalData.woowoUserInfo) {
      return;
    }
    util.requestGetAllNotifications(app.globalData.woowoUserInfo.user_id)
    .then(res => {
      if (res.code != 0) throw new Error('Something wrong with requesting all notification')
      let notificationList = res.data;
      let account = 0;
      for (let i = 0, len = notificationList.length; i < len; ++i) {
        if (notificationList[i].status == 'uncheck') {
          ++account;
        }
      }
      
      app.globalData.notificationList = notificationList;
      app.globalData.unreadNotificationAccount = account;

      that.setData({
        "unreadNotificationAccount": account
      })

      console.log(res)
      that.triggerEvent('unread', {
        "unreadNotificationAccount": account
      })

    })
    .catch(err => {
      console.log(err);
      console.log('Something wrong with requesting all notification')
    })
  }
})
