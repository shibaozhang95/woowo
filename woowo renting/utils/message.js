export default class OneMessage {
  constructor (msg) {
    this.msgType = msg.msgType;
    this.msgContent = decodeURIComponent(msg.msgContent);
    this.msgDate = msg.msgDate;
    
    this.receiverId = msg.receiverId;
    this.ifRead = msg.ifRead;
    this.ifSending = msg.ifSending ? true : false;

    this.ifFailedToSend = msg.ifFailedToSend ? true : false;

    // for unique
    this.uniqueMessageId = this.receiverId.toString() + this.msgDate.toString();
  }

  setAsRead (userId) {
    if (userId == this.receiverId && this.ifRead == false) {
      this.ifRead = true;
      return true;
    }
    
    return false;
  }
}