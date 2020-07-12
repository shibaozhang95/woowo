const app = getApp();
const util = require('../../utils/util.js');
const format = require('../../utils/format');

import OneArea from '../../utils/area';

const LIMITATION_HISTORY = 8;

Page({

  /**
   * Page initial data
   */
  data: {
    suggestionAreasList: [],
    historyAreasList: [],
    nearAreasList: [],

    ifOpenNearAreas: false,

    chosenAreasList: [],

    timer: Object,

    bottomGapHeight: Number,

    from: '',

    ifRequestingCurrLocation: false,
    ifNoCurrLocation: false,

    ifRequestingQueryLocation: false,
    ifNoQueryLocation: false,

    // used to reset edibale input value
    resetInputValue: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    data.bottomGapHeight = app.globalData.bottomGapHeight ? app.globalData.bottomGapHeight : 0;

    console.log(options);
    // from index
    if (options.from == 'index') {
      data.from = 'index';
    }

    // from housing list
    if (options.areas) {
      let areas = JSON.parse(options.areas);

      let list = [];

      for (let i = 0, len = areas.length; i < len; ++i) {
        let area = areas[i];

        list.push(new OneArea(area.locality, area.state, area.country, area.postCode))
      }

      data.chosenAreasList = list;

      for (let i = 0, len = data.chosenAreasList.length; i < len; ++i) {
        that.updateChosenStatusForOtherList(['suggestionAreasList', 'historyAreasList', 'nearAreasList']
          , 'add', data.chosenAreasList[i]);
      }

    }

    that.setData(data);

    that.getSearchHistoryLocally().then(res => {
      if (res.code == 0) {
        // get standard OneArea first
        let list = [];

        for (let i = 0, len = res.data.length; i < len; ++i) {
          let area = res.data[i];

          list.push(new OneArea(area.locality, area.state, area.country, area.postCode))
        }

        // list = that.checkNewAddingList(list);

        
        let defaultList = [];

        for (let i = 0, len = list.length; i < len; ++i) {
          defaultList.push(new OneArea(list[i].locality, list[i].state, list[i].country, list[i].postCode));
        }

        that.setData({
          historyAreasList: defaultList
        })
      }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

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

  switchNearAreas: function (event) {
    let that = this;
    let data = that.data;

    let ifSwitchOn = event.detail.value;

    // IF CLOSE， CLOSE AND DO NOTHING
    if (!ifSwitchOn) {
      data.ifOpenNearAreas = ifSwitchOn;
      that.setData(data);
      return;
    }

    
    data.ifRequestingCurrLocation = true;
    data.ifNoQueryLocation = false;
    that.setData(data);

    util.wxGetCurrentLatlng().then(res => {
      if (res.code == 0) {

        data.ifOpenNearAreas = ifSwitchOn;
        that.setData(data);

        util.requestLocationByPointBing(res.data, 'Address')
        .then(res => {

          data.ifRequestingCurrLocation = false;

          if (res.code == 0) {
            let newNearList = that.formattingAreasBing(res.data);

            newNearList = that.checkNewAddingList(newNearList);

            if (newNearList.length == 0) {
              data.ifNoCurrLocation = true;
            }

            data.nearAreasList = newNearList;
            that.setData(data)
          }

          else {
            wx.showToast({
              title: '出错了，请稍后再试~',
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  wx.hideToast()
                }, 2000)
              }
            })

            data.ifOpenNearAreas = false;

          }

          that.setData(data);
        })
      }

      // failed to get authority
      else if (res.code == -1) {
        that.setData({
          ifOpenNearAreas: !ifSwitchOn
        });

        wx.showModal({
          title: '获取权限失败',
          content: '前往设置页面，打开位置信息的权限才能使用该功能哦',
          showCancel: true,
          cancelText: '取消',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.getSetting();
            }
            else if (res.cancel) {

            }
          }
        })
      }
    })
    
  },

  newAreaSearchBing: function (event) {
    let that = this;
    let data = that.data;

    let searchKeyword = event.detail.keyword;
    
    if (searchKeyword.length > 2) {
      if (that.data.timer) {
        clearTimeout(that.data.timer);
      }
  
      that.data.timer = setTimeout(() => {

        data.ifRequestingQueryLocation = true;
        data.ifNoQueryLocation = false;
        that.setData(data);

        util.requestAutoSuggesteBing(searchKeyword, 'Place')
        .then(res => {

          data.ifRequestingQueryLocation = false;

          if (res.code == 0) {
            let newSuggestList = that.formattingAreasBing(res.predictions);
            // console.log(newSuggestList);

            newSuggestList = that.removeDuplicate(newSuggestList);

            newSuggestList = that.checkNewAddingList(newSuggestList);

            data.suggestionAreasList = newSuggestList;
            
            if (data.suggestionAreasList.length == 0) {
              data.ifNoQueryLocation = true;
            }
            that.setData(data);
          }
          else {
            data.ifNoQueryLocation = true;
          }
          

          that.setData(data);
        })
      }, 500)
    }
  },

  removeDuplicate: function (list) {
    let newList = []

    for (let i = 0, len = list.length; i < len; ++i) {
      let ifExsit = false;
      for (let j = 0, jLen = newList.length; j < jLen; ++j) {
        if (list[i].isEqual(newList[j])) {
          ifExsit = true;
          break;
        }
      }

      if (ifExsit == false) newList.push(list[i])
    }

    return newList;
  },

  deleteChosenEvent: function (event) {
    let that = this;

    let deleteIndex = event.detail.deleteIndex;

    this.deleteChosen(deleteIndex);
  },

  deleteChosen: function (index) {
    let that = this;

    let newChosenList = that.data.chosenAreasList;
    let deletedArea = newChosenList[index];

    // DELETE FROM CHOSEN LIST
    newChosenList.splice(index, 1);

    that.setData({
      chosenAreasList: newChosenList
    });

    // UPDATE OTHER LIST STYLE
    that.updateChosenStatusForOtherList(['suggestionAreasList', 'historyAreasList', 'nearAreasList']
      , 'delete', deletedArea);
  },

  addChosen: function (obj) {
    let that = this;

    let lastIndex = that.data.chosenAreasList.length;

    // ADD TO CHOSEN LIST
    let str = 'chosenAreasList[' + lastIndex + ']';

    that.setData({
      [str]: obj
    })

    // UPDATE OTHER LIST STYLE
    that.updateChosenStatusForOtherList(['suggestionAreasList', 'historyAreasList', 'nearAreasList']
      , 'add', obj);
  },

  updateChosenStatusForOtherList: function (updateList, action, obj) {
    let that = this;

    for (let i = 0, len = updateList.length; i < len; ++i) {
      let targetList = that.data[updateList[i]];

      for (let k = 0, kLen = targetList.length; k < kLen; ++k) {
        if (obj.isEqual(targetList[k])) {
          let str = updateList[i] + '[' + k + '].ifChosen';

          that.setData({
            [str]: action == 'delete' ? false : true
          });

        }
      }
      
    }
  },

  checkNewAddingList: function (list) {
    let that = this;

    let currentChosenList = that.data.chosenAreasList;
    
    for (let i = 0, len = list.length; i < len; ++i) {
      list[i].ifChosen = false;  // SET False as Default
      for (let p = 0, pLen = currentChosenList.length; p < pLen; ++p) {
        if (list[i].isEqual(currentChosenList[p])) {
          list[i].ifChosen = true;
          break;
        }
      }
    }

    return list;
  },

  chosenFromAreasList: function (event) {
    let that = this;

    let targetIndex = event.currentTarget.dataset.targetIndex;
    let targetList = event.currentTarget.dataset.targetList;

    console.log(that.data[targetList][targetIndex]);

    let pages = getCurrentPages();
    let prvPage = pages[pages.length - 2];

    prvPage.changeAddress(that.data[targetList][targetIndex]);

    wx.navigateBack({
      delta: 1
    })
    // let that = this;

    // let targetIndex = event.currentTarget.dataset.targetIndex;
    // let targetList = event.currentTarget.dataset.targetList;

    // let ifChosen = that.data[targetList][targetIndex].ifChosen;

    // let str = targetList + '[' + targetIndex + '].ifChosen';

    // // update suggestion list
    // that.setData({
    //   [str]: !ifChosen,
    //   resetInputValue: !that.data.resetInputValue
    // })

    // // update chosen list
    // that.updateChosenList(ifChosen ? 'delete' : 'add', that.data[targetList][targetIndex]);
  },

  updateChosenList: function (action, obj) {
    let that = this;

    console.log(obj)

    if (action == 'delete') {
      let currChosenList = that.data.chosenAreasList;

      for (let i = 0, len = currChosenList.length; i < len; ++i) {
        console.log(currChosenList[i])
        if (obj.isEqual(currChosenList[i])) {
          that.deleteChosen(i);
          return ;
        }
      }
    }

    else if (action == 'add') {
      that.addChosen(obj);
    }
  },

  formattingAreasBing: function (results) {
    let newList = [];

    for (let i = 0, len = results.length; i < len; ++i) {

      // address without locality is illegal
      if (!results[i].address.locality) continue;

      
      
      let locality = results[i].address.locality.split(',')[0];

      let state  = format.formatState(results[i].address.adminDistrict);
      
      let country = results[i].address.countryRegion;
      let postalCode = results[i].address.postalCode ? results[i].address.postalCode : 0;
      
      let oneArea = new OneArea(locality, state, country, postalCode);

      newList.push(oneArea);
    }

    return newList;
  },

  getSearchHistoryLocally: function () {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'areasSearchHistory',
        success: (res) => {
          console.log('Getting default searching history successd');
          resolve({
            code: 0,
            data: res.data
          })
        },
        fail: (err) => {
          resolve({
            code: 0, 
            data: []
          })
        }
      })
    })
  },

  storeSearchHistoryLocally: function (list) {
    let that = this;

    return new Promise((resolve, reject) => {
      let oldHistoryList = that.data.historyAreasList;
      let newHistoryList = list;

      for (let i = 0, len = oldHistoryList.length; i < len; ++i) {
        let ifExist = false;
        for (let p = 0, pLen = newHistoryList.length; p < pLen; ++p) {
          if (newHistoryList[p].isEqual(oldHistoryList[i])) {
            ifExist = true;
            break;
          }
        }
        if (!ifExist) {
          newHistoryList.push(oldHistoryList[i])
        }
      }

      // GET RID OF THE EXCESS
      newHistoryList.splice(LIMITATION_HISTORY - 1, newHistoryList.length - LIMITATION_HISTORY);

      wx.setStorage({
        key: 'areasSearchHistory',
        data: newHistoryList,
        success: () => {
          resolve({code: 0})
        },
        fail: () => {
          resolve({code: -1})
        }
      })
      
    });
  },

  confrimSearchResult: function () {
    let that = this;

    // update searching histories locally
    let newHistoryList = that.data.chosenAreasList;

    let jsonChosenAreaList = JSON.stringify(that.data.chosenAreasList);
    let url = '../housingList/housingList?areas=' + jsonChosenAreaList;

    that.storeSearchHistoryLocally(newHistoryList)
    .then(res => {
      if (res.code == 0) {
        console.log('Storing Search History Locally Successd');
      }
      else {
        console.log('Storing Search History Locally Failed');
      }
    })

    console.log(that.data.from);
    if (that.data.from == 'index') {
      wx.redirectTo({
        url: url
      })
    }
    else {
      let pages = getCurrentPages();

      let housingListPage = pages[pages.length - 2];

      housingListPage.setData({
        areasFromSearchPage: jsonChosenAreaList
      })
      wx.navigateBack({
        delta: 1
      });
    }
  },
})