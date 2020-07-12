const app = getApp();

Component({
  properties: {
    "isIndex": {
      type: Boolean,
      value: false
    },
    "isNews": {
      type: Boolean,
      value: false
    },
    "isMessages": {
      type: Boolean,
      value: false
    },
    "isHomepage": {
      type: Boolean,
      value: false
    }
  },


  data: {
    bottomGapHeight: 0,
    unreadMessageNum: 1,
    woowoUserInfo: {},

    ifShowLoginAuth: false
  },

  methods: {
    goToAdding: function () {
      let that =  this;
      let data = that.data;

      if (!app.globalData.woowoUserInfo.ifLogedin) {
        data.ifShowLoginAuth = true;
        
        that.setData(data);

        return;
      }

      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/adding/adding'
        })
      }, 200)
      
    },

    loginSuccess: function () {
      let that = this;
      let data = that.data;

      data.ifShowLoginAuth = false;

      that.setData(data);

      wx.navigateTo({
        url: '/pages/adding/adding'
      })
    }
    
  },

  ready: function () {
    let that = this;

    // REQUEST FIRST TIME
    let woowoUserInfo = app.globalData.woowoUserInfo;
    let woowoMessages = app.globalData.woowoMessages.chats ? app.globalData.woowoMessages.chats:[];

    let unreadCount = 0;
    
    for (let i = 0, len = woowoMessages.length; i < len; ++i) {
      let currentChat = woowoMessages[i];
      for (let j = 0, jLen = currentChat.messages.length; j < jLen; ++j) {
        if (woowoUserInfo.user_id == currentChat.messages[j].receiverId
          && currentChat.messages[j].ifRead == false) {
          ++unreadCount;
        }
      }
    }

    // console.log(unreadCount);

    that.setData({
      bottomGapHeight: app.globalData.bottomGapHeight,
      unreadMessageNum: unreadCount
    })

    // REQUEST AS A LOOP
    setInterval(() => {
      let newUnreadCount = 0;

      woowoMessages = app.globalData.woowoMessages.chats ? app.globalData.woowoMessages.chats:[];

      for (let i = 0, len = woowoMessages.length; i < len; ++i) {
        let currentChat = woowoMessages[i];
        for (let j = 0, jLen = currentChat.messages.length; j < jLen; ++j) {
          if (woowoUserInfo.user_id == currentChat.messages[j].receiverId
            && currentChat.messages[j].ifRead == false) {
            ++newUnreadCount;
          }
        }
      }

      if (newUnreadCount != unreadCount) {
        unreadCount = newUnreadCount;

        that.setData({
          unreadMessageNum: unreadCount
        })
      }
    }, 1000)
  }
})
