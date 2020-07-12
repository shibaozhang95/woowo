const app = getApp();

Component({
  properties: {
    showLoginAuth: {
      type: Boolean,
      value: false
    }
  },

  data: {
    windowWidth: Number,
    windowHeight: Number,
    woowooUserInfo: {}
  },

  methods: {
    confirmLoginAuth: function (event) {
      let that = this;
      
      console.log(event);

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
                  
                }
              })
            }
            else {
              that.triggerEvent('refuseAuth', {});
            }
          }
        })

        return; 
      }
      

      wx.showLoading({
        title: '登录中...',
        mask: true
      });

      that.data.woowoUserInfo.register(event)
      .then(res => {
        let tips = "";
        let icon = ""
        if (res.ifLogedin) {
          tips = "登录成功";
          icon = "success";
          
          that.data.woowoUserInfo.updateUserInfo(res.woowoUserInfo);
          that.triggerEvent('loginsuccess', that.data.woowoUserInfo);
        }
        else {
          tips = "登陆失败，错误代码: " + res.errMsg;
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

      that.triggerEvent('refuseAuth', {})
    }
  },

  ready: function () {
    let that = this;

    that.data.woowoUserInfo = app.globalData.woowoUserInfo;

    that.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    })
  }
})