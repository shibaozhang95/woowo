// oneContact.js
Component({
  /**
   * Component properties
   */
  properties: {
    contactInfo: {
      type: Object,
      value: {},
      observer (newVal, oldVal) {
        let that = this;

        let prevLastMessage = that.data.lastMessage;
        let prevUnreadNum = that.data.unreadMsgNum;

        // FOR LAST MESSAGE
        let lastMessage = '';
        let lenOfMsg = newVal.messages.length;
        if (lenOfMsg > 0) {
          if (newVal.messages[lenOfMsg-1].msgType == 'text') {
            lastMessage = newVal.messages[lenOfMsg-1].msgContent;
          }
          else if (newVal.messages[lenOfMsg-1].msgType == 'image') {
            lastMessage = '[图片]'
          }
          else {
            lastMessage = '[系统消息]'
          }
        }
        else {
          lastMessage = '';
        }

        // FOR UNREAD MESSAGES
        let unreadMsgCount = 0;
        for (let i = 0; i < lenOfMsg; ++i) {
          if (newVal.messages[i].receiverId == that.data.selfUserId
            && newVal.messages[i].ifRead == false) {
            ++unreadMsgCount;
          }
        }

        if (lastMessage != prevLastMessage || 
            prevUnreadNum != unreadMsgCount) {
          that.setData({
            lastMessage: lastMessage,
            unreadMsgNum: unreadMsgCount
          })
        }
      }
    },
    selfUserId: {
      type: String,
      value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {
    contactUsername: '',
    contactImage: '',
    lastMessage: '',
    contactUserRight: '',
    unreadMsgNum: 0
  },

  /**
   * Component methods
   */
  methods: {

  },

  ready: function () {
    let that = this;

    // FOR USERNAME
    let contactInfo = that.data.contactInfo;
    let selfUserId = that.data.selfUserId;
    let contactUsername = '';
    let contactImage = '';
    let contactUserRight = 'normal';
    
    if (selfUserId == contactInfo.userOne.user_id) {
      contactUsername = contactInfo.userTwo.username;
      contactImage = contactInfo.userTwo.user_image;
      contactUserRight = contactInfo.userTwo.user_right;
      console.log(contactInfo.userTwo);
    }
    else {
      contactUsername = contactInfo.userOne.username;
      contactImage = contactInfo.userOne.user_image;
      contactUserRight = contactInfo.userOne.user_right;
      console.log(contactInfo.userOne);
    }

    // FOR LAST MESSAGE
    let lastMessage = '';
    let lenOfMsg = contactInfo.messages.length;
    if (lenOfMsg > 0) {
      if (contactInfo.messages[lenOfMsg-1].msgType == 'text') {
        lastMessage = contactInfo.messages[lenOfMsg-1].msgContent;
      }
      else if (contactInfo.messages[lenOfMsg-1].msgType == 'image') {
        lastMessage = '[图片]';
      }
      else {
        lastMessage = '[系统消息]';
      }
    }
    else {
      lastMessage = '';
    }

    // FOR UNREAD MESSAGES
    let unreadMsgCount = 0;
    for (let i = 0; i < lenOfMsg; ++i) {
      if (contactInfo.messages[i].receiverId == selfUserId
        && contactInfo.messages[i].ifRead == false) {
        ++unreadMsgCount;
      }
    }

    console.log(contactUsername);
    console.log(contactUserRight);

    that.setData({
      contactUsername: decodeURIComponent(contactUsername),
      lastMessage: lastMessage,
      contactImage: contactImage,
      unreadMsgNum : unreadMsgCount,
      contactUserRight: contactUserRight
    })
  }
})
