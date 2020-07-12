export default class WoowoHistory {
  historyList = [];
  // {
  //   houseId: '',
  //   viewDate: '',
  // }

  constructor (list) {
    this.historyList = list;
  }

  updateViewHistoryWithNewId (newHouseId) {
    
    // delete the old one if exist
    for (let i = 0, len = this.historyList.length; i < len; ++i) {
      if (newHouseId == this.historyList[i].houseId) {
        this.historyList.splice(i, 1);
        break;
      }
    }

    this.historyList = [{
      houseId: newHouseId,
      viewDate: new Date().getTime()
    }].concat(this.historyList);
  }

  getHouseIdStr () {
    let idList = [];

    for (let i = 0, len = this.historyList.length; i < len; ++i) {
      idList.push(this.historyList[i].houseId);
    }

    return idList.join(',');
  }

  updateViewHistoryLocally () {
    wx.setStorage({
      key: 'woowoViewHistory',
      data: this.historyList,
      success: () => {
        console.log('update woowoViewHistory successfully');
      }
    }) 
  }
}