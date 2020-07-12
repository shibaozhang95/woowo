const app = getApp();

const user = require('../../services/user.js');

Component({
  properties: {
    showLoginAuth: {
      type: Boolean,
      value: false
    }
  },
  data: {
    windowWidth: Number,
    windowHeight: Number
  },
  methods: {
    confirmLoginAuth: function (event) {
      console.log(event);      
      let that = this;
      
      that.setData({
        showLoginAuth: false 
      });

      // if get auth failed
      if (!event.detail.userInfo) {
        
        wx.showModal({
          title: '授权失败',
          content: '授权获取微信登录信息，才可解锁更多功能哦~',
          cancelText: '拒绝',
          confirmText: '去授权',
          // confirmColor: '#2C3E50',
          // cancelColor: '#696969',
          success: function(res) {
            if (res.confirm) {
              wx.openSetting({
                success: () => {
                  console.log('open setting success')
                },
                fail: function() {
                  console.log('open setting fail')
                },
                complete: function() {
                  that.triggerEvent('refuseAuth', {})
                }
              })
            }
          }
        })

        
        return;
      }

      // get Auth
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      user.register(event)
      .then(res => {
        let tips = "";
        let icon = ""
        if (res.ifLogedin) {
          tips = "登录成功";
          icon = "success";
          
          app.globalData.woowoUserInfo = res.woowoUserInfo;
          
          that.triggerEvent('loginsuccess', res.woowoUserInfo)
        }
        else {
          tips = "登陆失败，错误代码：" + res.errMsg;
          icon = "none";
        }

        wx.hideLoading();
        wx.showToast({
          title: tips,
          icon: icon,
          success: function() {
            setTimeout(() => {
              wx.hideToast();
            }, 5000)
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
      
    },

    refuseLoginAuth: function () {
      let that = this;
      console.log('user refused to authorize');
      that.setData({
        showLoginAuth: false
      })
      that.triggerEvent('refuseAuth', {})
    }
  },

  ready: function () {
    let that = this;
    that.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    })
  }
})