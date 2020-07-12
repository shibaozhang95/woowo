import OneChat from './chat';

export default class Messages {
  constructor (initData) {
    this.chats = this.initializeChat(initData ? initData : {});
  }

  initializeChat (initData) {
    let chats = [];

    let allMsg = initData.msgAll ? initData.msgAll : [];
    let allUser = initData.userAll ? initData.userAll : [];

    for (let i = 0, lenMsg = allMsg.length; i < lenMsg; ++i) {
      let userOne, userTwo;
      for (let k = 0, lenUser = allUser.length; k < lenUser; ++k) {
        if (allMsg[i].user_one_id == allUser[k].user_id) {
          userOne = allUser[k];
          if (userOne && userTwo) break;
        }
        if (allMsg[i].user_two_id == allUser[k].user_id) {
          userTwo = allUser[k];
          if (userOne && userTwo) break;
        }
      }

      let msgs = allMsg[i].msg_obj;

      let newChat = new OneChat(userOne, userTwo, msgs);

      chats.push(newChat);
    }

    chats.sort(chatsSortByNewest);

    return chats;
  }

  initialWithFormatData (formatData) {
    let initChats = [];

    for (let i = 0, len = formatData.length; i < len; ++i) {

      let newChat = new OneChat();
      newChat.initialWithFormatChatData(formatData[i]);

      initChats.push(newChat);
    }

    initChats.sort(chatsSortByNewest);

    this.chats = initChats;
  }

  messagesSort () {
    this.chats.sort(chatsSortByNewest);
  }

  mergeChats (targetChats) {
    let ifChanged = false;
    let newChats = [];

    for (let i = 0, len = targetChats.chats.length; i < len; ++i) {
      let ifExsit = false;
      for (let j = 0, jLen = this.chats.length; j < jLen; ++j) {
        if (targetChats.chats[i].isSameChat(this.chats[j])) {
          let ifMessageChanged = this.chats[j].mergeMessages(targetChats.chats[i]);
          if (ifMessageChanged == true) {
            ifChanged = true;
          }
          ifExsit = true;
          break;
        }
      }
      if (ifExsit == false) {
        newChats.push(targetChats.chats[i]);
      }
    }

    if (newChats.length > 0) {
      console.log('Add new chats: ', newChats.length);
        // Merge
      this.chats = this.chats.concat(newChats);
      // Resort
      this.chats.sort(chatsSortByNewest);

      ifChanged = true;
    }

    return ifChanged;
  }

  // only user the targetuserInfo, when there's no such a conversation
  findAConversation (targetId, targetUserInfo, selfUserInfo) {
    let ifExsitCon = false;

    for (let i = 0, len = this.chats.length; i < len; ++i) {
      if (this.chats[i].userOne.user_id == targetId || this.chats[i].userTwo.user_id == targetId) {
        return this.chats[i];
      }
    }

    let newChat = new OneChat(targetUserInfo, selfUserInfo);
    this.chats.push(newChat);

    return newChat;
  }
}

function chatsSortByNewest (chatOne, chatTwo) {
  let len1 = chatOne.messages.length;
  let time1;
  if (len1 > 1) time1 = chatOne.messages[len1-1].msgDate;
  else time1 = new Date().getTime();

  let len2 = chatTwo.messages.length;
  let time2;
  if (len2 > 1) time2 = chatTwo.messages[len2-1].msgDate;
  else time2 = new Date().getTime();

  return time1 < time2;
}