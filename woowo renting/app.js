const util = require('./utils/util');
import Messages from './utils/messages';
import WoowoUser from './utils/woowoUser';
import OneMessage from './utils/message';
import WoowoHistory from './utils/woowoHistory';

//app.js
App({
  onLaunch: function () {
    let that = this;

    // FOR RESPONDING SCREEN SIZE
    wx.getSystemInfo({
      success: function(res) {
        /**
         * Notice: windowHeight will change with setting custom nav or not
         */
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
     * FOR LOGIN
     */
    let woowoUserInfo;

    let value = wx.getStorageSync('woowoUserInfo');
    if (value) {
      woowoUserInfo = new WoowoUser(value);
      console.log(woowoUserInfo);
      woowoUserInfo.login(value.wx_unionid).then(res => {
        if (res.ifLogedin == true) {
          woowoUserInfo.updateUserInfo(res.woowoUserInfo);
          console.log('Login successfully!');
        }
      });
    }
    else {
      woowoUserInfo = new WoowoUser({});
    }
    
    that.globalData.woowoUserInfo = woowoUserInfo;

    /**
     *  FOR MESSAGES
     */
    that.globalData.woowoMessages = new Messages();
    if (that.globalData.woowoUserInfo.ifLogedin) {
      wx.getStorage({
        key: 'woowoMessages',
        success: (res) => {
          
          // woowoMessages.initialWithFormatData(woowoMessages);
          // that.globalData.woowoMessages = woowoMessages;
          that.globalData.woowoMessages.initialWithFormatData(res.data);
          console.log('Load messages from local');

          // read the first time
          util.requestAllMessages(that.globalData.woowoUserInfo.user_id)
          .then(res => {
            if (res.code == 0) {
              let newMessages = new Messages(res.data);

              let ifUpdated = that.globalData.woowoMessages.mergeChats(newMessages);
            
              if (ifUpdated == true) {
                wx.setStorage({
                  key: 'woowoMessages',
                  data: that.globalData.woowoMessages.chats,
                  success: () => {
                    console.log('Update local message successfully!')
                  }
                })
              }
            }
            else {
              console.log('Request for user message failed.')
            }
          });
        }
      })


    }
    // request as a loop
    setInterval(() => {
      if (that.globalData.woowoUserInfo.ifLogedin) {
        util.requestAllMessages(that.globalData.woowoUserInfo.user_id)
        .then(res => {
          if (res.code == 0) {
            let newMessages = new Messages(res.data);

            let ifUpdated = that.globalData.woowoMessages.mergeChats(newMessages);
            that.globalData.woowoMessages.messagesSort();

            if (ifUpdated == true) {
              wx.setStorage({
                key: 'woowoMessages',
                data: that.globalData.woowoMessages.chats,
                success: () => {
                  console.log('Update local message successfully!')
                }
              })
            }
          }
          else {
            console.log('Request for user message failed.')
          }
        });
      } 
    }, 23000);

    /**
     *  FOR VIEW HISTORY
     */
    let history = wx.getStorageSync('woowoViewHistory');
    if (history) {
      that.globalData.woowoViewHistory = new WoowoHistory(history);
    }
    else {
      that.globalData.woowoViewHistory = new WoowoHistory([]);
    }
    
  },

  globalData: {
    woowoUserInfo: {},

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
    ifCustomNavigation: true,
    // wechat default is 48, wn default is 65

    navigationBarBackgroundColor: 'rgb(86, 182, 213)',
    navigationTitleColor: 'rgb(255, 255, 255)',

    // Messages
    woowoMessages: {},

    // Post
    woowoHouseDraft: {},
    woowoHousemateDraft: {},

    // increase user experience
    woowoHouseTemp: {},
    woowoHousemateTemp: {},

    woowoViewHistory: ''
  }
})