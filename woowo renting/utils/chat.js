import OneMessage from './message';

export default class OneChat {
  constructor (userOne = {}, userTwo = {}, msgs = []) {
    this.userOne = userOne ? userOne : {};
    if (this.userOne.username) {
      this.userOne.username = decodeURIComponent(this.userOne.username)
    }
    this.userTwo = userTwo ? userTwo : {};
    if (this.userTwo.username) {
      this.userTwo.username = decodeURIComponent(this.userTwo.username)
    }
    this.messages = this._initializeMessages(msgs ? msgs : []);

    this.uniqueChatId = '';
    if (userOne.user_id && userTwo.user_id) {
      this.uniqueChatId = userOne.user_id.toString() + ',' + userTwo.user_id.toString();
    }
  }

  _initializeMessages (msgs) {
    let messages = [];

    for (let i = 0, len = msgs.length; i < len; ++i) {
      let oneMsg = new OneMessage(msgs[i]);

      messages.push(oneMsg);
    }

    messages.sort(messagesSortByLatest);
    return messages;
  }

  isSameChat (targetChat) {
    let targetUnique1 = targetChat.userOne.user_id + ',' + targetChat.userTwo.user_id;
    let targetUnique2 = targetChat.userTwo.user_id + ',' + targetChat.userOne.user_id;

    return targetUnique1 == this.uniqueChatId 
      || targetUnique2 == this.uniqueChatId
  }

  initialWithFormatChatData (formatchat) {
    this.userOne = formatchat.userOne;
    this.userTwo = formatchat.userTwo;
    this.uniqueChatId = this.userOne.user_id.toString() + ',' + this.userTwo.user_id.toString();
    let initialMsgs = [];

    for (let i = 0, len = formatchat.messages.length; i < len; ++i) {
      let oneMessage = new OneMessage(formatchat.messages[i]);

      initialMsgs.push(oneMessage);
    }

    initialMsgs.sort(messagesSortByLatest);
    this.messages = initialMsgs;
  }

  setAllMessagesAsRead (userId) {
    let ifChanged = false;
    for (let i = 0, len = this.messages.length; i < len; ++i) {
      if (this.messages[i].setAsRead(userId)) {
        ifChanged = true;
      }
    }

    return {
      ifChanged: ifChanged,
      changedData: this.messages
    }
  }

  /**
   *  Merge is basically adding new messages but cannot handle with 'ifRead' 
   */
  mergeMessages (targetChat) {
    let newMessages = [];
    let ifChanged = false;

    for (let i = 0, len = targetChat.messages.length; i < len; ++i) {
      let ifExist = false;
      for (let j = 0, jLen = this.messages.length; j < jLen; ++j) {
        if (targetChat.messages[i].uniqueMessageId == this.messages[j].uniqueMessageId) {
          ifExist = true;
          
          // this is used to check ifRead
          if (targetChat.messages[i].ifRead != this.messages[j].ifRead) {
            this.messages[i].ifRead = targetChat.messages[i].ifRead;
            ifChanged = true;
          }
          // this is used to check ifRead
          if (targetChat.messages[i].msgContent != this.messages[j].msgContent) {
            this.messages[i].msgContent = targetChat.messages[i].msgContent;
            ifChanged = true;
          }

          break;
        }
      }
      if (ifExist == false) {
        newMessages.push(targetChat.messages[i]);
      }
    }

    if (newMessages.length > 0) {
      console.log('Add new messages: ', newMessages.length);
      // Merge
      this.messages = this.messages.concat(newMessages);
      // Resort
      this.messages.sort(messagesSortByLatest);

      ifChanged = true;
    }

    return ifChanged;
  }

  // n
  // formatUpdatingMessages (newMessage) {
  //   let formatMessages = [];

  //   for (let i = 0, len = this.messages.length; i < len; ++i) {
  //     if (this.messages[i].ifSending == false && this.messages[i].ifFailedToSend == false) {
  //       formatMessages.push(this.messages[i]);
  //     }
  //   }

  //   formatMessages.push(newMessage);
  //   return formatMessages;
  // }
}

function messagesSortByLatest (messageOne, messageTwo) {
  let msgOneDate = messageOne.msgDate;
  let msgTwoDate = messageTwo.msgDate;

  return msgOneDate > msgTwoDate;
}