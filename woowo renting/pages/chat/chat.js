const app = getApp();
const BOTTOM_VIEW_ID = 'window-btm';
const CHAT_INTPUT_HEIGHT = 64;
const util = require('../../utils/util');
const qiniuUploader = require('../../utils/qiniuUploader');
const API = require('../../services/api');

import OneMessage from '../../utils/message';

// chat.js
Page({

  /**
   * Page initial data
   */
  data: {
    btmViewId: String,

    // For adjusting 
    bottomGapHeight: String,
    messageWindowHeight: String,

    chat: {},
    messages: [],

    contactUserInfo: {},
    woowoUserInfo: {},

    // For interval
    readNewMsgInt: Object
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    /**
     *  FOR SCREEN SET
     */
    let screenHeight = app.globalData.screenHeight;
    let screenWidth = app.globalData.screenWidth;
    let navBarHeight = app.globalData.statusBarHeight + app.globalData.defaultNavBarHeight;
    let tabBarHeight = app.globalData.wnTabBarHeight + app.globalData.bottomGapHeight;

    data.bottomGapHeight = app.globalData.bottomGapHeight;

    data.messageWindowHeight = screenHeight - navBarHeight 
      - CHAT_INTPUT_HEIGHT - data.bottomGapHeight;

    /**
     *  FOR INITIAL MESSAGES
     */
    // let selfUserId = options.selfUserId;

    // this is for the situation of starting a new conversation
    data.contactUserInfo = JSON.parse(options.targetUserInfo);  
    data.woowoUserInfo = app.globalData.woowoUserInfo;

    // let twoId  = uniqueChatId.split(selfUserId);
    let targetId = data.contactUserInfo.user_id;

    data.woowoMessages = app.globalData.woowoMessages;

    data.chat = data.woowoMessages
      .findAConversation(targetId, data.contactUserInfo, data.woowoUserInfo);

    data.messages = data.chat.messages;

    /**
     *  FOR INITIAL READING MEASSAGES
     */
    that.readMessages(data.chat, data.woowoUserInfo.user_id, data.contactUserInfo.user_id);

    that.setData(data);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    let that = this;

    
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    let that = this;

    // initial sliding down
    setTimeout(() => {
      that.windowSlideToBottom();
    }, 100)

    /**
     *  SET AN LOOP FOR NEW MESSAGES
     */
    let initialChat = that.data.chat;
    let contactUserInfo = that.data.contactUserInfo;
    let selfUserId = that.data.woowoUserInfo.user_id;

    let readNewMsgsInt = setInterval(() => {
      let newMsgLen = initialChat.messages.length;
      let prevMsgLen = that.data.messages.length;

      that.setData({
        messages: initialChat.messages,
      });

      if (newMsgLen != prevMsgLen) {
        // Slide the window to bottom
        that.windowSlideToBottom();
        // Set as All Read
        that.readMessages(that.data.chat, selfUserId, contactUserInfo.user_id);
      }
      
    }, 1000);

    that.setData({
      readNewMsgInt: readNewMsgsInt
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    let that = this;

    clearInterval(that.data.readNewMsgInt);
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  sendAnImage: function (msg) {
    let that = this;
    let data = that.data;

    let showingMsgObj = new OneMessage({
      msgType: msg.msgType,
      msgContent: msg.msgContent,
      msgDate: msg.msgDate,
      receiverId: that.data.contactUserInfo.user_id,
      ifRead: false,
      ifSending: true,
      ifFailedToSend: false
    });
    data.messages.push(showingMsgObj);
    that.setData(data);

    that.windowSlideToBottom();

    // uploading the pictures first
    qiniuUploader.upload(msg.msgContent, (res) => {
      console.log('upload images successfully');

      // console.log(res.imageURL);
      
      let readyToSendMsgObj = new OneMessage({
        msgType: showingMsgObj.msgType,
        msgContent: 'https://' + res.imageURL,
        msgDate: showingMsgObj.msgDate,
        receiverId: showingMsgObj.receiverId,
        ifRead: false,
        ifSending: false,
        ifFailedToSend: false
      })

      util.requestSendingMsg(data.woowoUserInfo.user_id, data.contactUserInfo.user_id, readyToSendMsgObj)
      .then(res => {
        showingMsgObj.ifSending = false;
        if (res.code == 0) {
          showingMsgObj.ifFailedToSend = false;
        }
        else {
          showingMsgObj.ifFailedToSend = true;
        }

        that.setData(data);
      })

    }, (error) => {
      console.log('error: ' + error);
    }, {
      region: 'ECN',
      domain: 'media.woniu-xcx.xyz', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接

      uptokenURL: API.GetQiniuToken, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
    }, (processRes) => {

    })

  },

  sendANewMessage: function (event) {
    let that = this;

    let msg = event.detail.message;

    if (msg.msgType == 'image') {
      that.sendAnImage(msg);
    }
    else if (msg.msgType == 'text') {
      // this is used to show
      let newMsgObj = new OneMessage({
        msgType: msg.msgType,
        msgContent: msg.msgContent,
        msgDate: msg.msgDate,
        receiverId: that.data.contactUserInfo.user_id,
        ifRead: false,
        ifSending: true,
        ifFailedToSend: false
      })

      // this is used to send
      let readyToSendMsgObj = new OneMessage({
        msgType: newMsgObj.msgType,
        msgContent: newMsgObj.msgContent,
        msgDate: newMsgObj.msgDate,
        receiverId: newMsgObj.receiverId,
        ifRead: false,
        ifSending: false,
        ifFailedToSend: false
      })

      that.data.messages.push(newMsgObj);
      that.setData({
        messages: that.data.messages
      })

      that.windowSlideToBottom();

      util.requestSendingMsg(that.data.woowoUserInfo.user_id, that.data.contactUserInfo.user_id,
        readyToSendMsgObj)
      .then(res => {
        newMsgObj.ifSending = false;
        if (res.code == 0) {
          newMsgObj.ifFailedToSend = false;
          console.log('Sending message successfully');
        }
        else {
          newMsgObj.ifFailedToSend = true;
          console.log('Sending message failed!!!!');
        }

        // update again
        that.setData({
          messages: that.data.messages
        })
      })
      .catch(err => {
        console.log(err);
        newMsgObj.ifFailedToSend = true;
        newMsgObj.ifSending = false;

        that.setData({
          messages: that.data.messages
        })
      })
    }
    
  },

  resendFailedMessage: function (event) {
    let that = this;

    // delete old one first
    that.deleteFailedMessage(event);

    // resende
    that.sendANewMessage(event);
  },

  deleteFailedMessage: function (event) {
    let that = this;

    let deleteMsgId = event.detail.message.uniqueMessageId;
    
    for (let i = 0, len = that.data.messages.length; i < len; ++i) {
      if (that.data.messages[i].uniqueMessageId == deleteMsgId) {
        that.data.messages.splice(i, 1);
      }
    }

    that.setData({
      messages: that.data.messages
    })
  },

  windowSlideToBottom: function () {
    let that = this;

    that.setData({
      btmViewId: BOTTOM_VIEW_ID
    })  
    
  },

  readMessages: function (chat, userId, contactUserId) {
    let that = this;
    let data = that.data;

    // return ;
    // set locally
    let res = chat.setAllMessagesAsRead(userId);
    if (res.ifChanged) {
      // update locally
      that.setData({
        messages: res.changedData
      })
      console.log('read message successful');

      util.requestSetMessagesAsRead(contactUserId, userId)
      .then(res => {
        if (res.code == 0) {
          console.log('Update Reading messages remotely successfully!')
        }
      })
    }
  }
})