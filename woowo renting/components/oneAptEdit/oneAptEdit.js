import WoowoHouse from '../../utils/woowoHouse';
const util = require('../../utils/util');
const app = getApp();

// components/oneAptEdit/oneAptEdit.js
Component({
  /**
   * Component properties
   */
  properties: {
    woowoHouseInfo: {
      type: WoowoHouse,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    houseInfo: {}
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.houseInfo = new WoowoHouse(data.woowoHouseInfo).formatToShowingData();

    console.log(data.houseInfo);

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    changeShelf: function (event) {
      let that = this;
      let data = that.data;
      let woowoUserInfo = app.globalData.woowoUserInfo;

      let status = event.currentTarget.dataset.status;

      let tips = '';
      if (status == 'offShelf') tips = '下架';
      else if (status == 'postedChecked') tips = '上架';
      else if (status == 'deleted') tips = '删除';

      wx.showLoading({
        title: tips + '中...',
        mask: true
      });

      util.requestUpdateHouseInfo(data.houseInfo.houseId, 'status'
        , status, woowoUserInfo)
      .then(res => {
        wx.hideLoading();

        if (res.code == 0) {
          wx.showToast({
            title: tips + '成功~',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })

          data.houseInfo.status = status;
          
          that.setData(data);

          that.triggerEvent('shelfchanged', {
            houseId: data.houseInfo.houseId,
            newStatus: status
          })
        }

        else if (res.code == 1) {
          let tips = '您最多可同时在架 ' + res.data + ' 个房源，超出发布限制了！';

          wx.showToast({
            title: tips,
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 5000)
            }
          })
        }
        else {
          wx.showToast({
            title: '出错啦，请稍后再试~',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
      })
    },

    deleteHouse: function () {
      let that = this;

      wx.showModal({
        title: '提示',
        content: '删除为不可逆操作，确定要删除吗？',
        success: res => {
          if (res.confirm == true) {
            that.changeShelf({
              currentTarget: {
                dataset: {
                  status: 'deleted'
                }
              }
            })
          }
        }
      })
    },

    reTopHouse: function () {
      let that = this;
      let data = that.data;

      if (data.houseInfo.status != 'postedChecked') {
        wx.showToast({
          title: '只能置顶在架的房源哦~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
        return;
      }

      wx.showLoading({
        title: '置顶中...',
        mask: true
      })

      let houseId = data.houseInfo.houseId;
      let userId = app.globalData.woowoUserInfo.user_id;
      let updateTime = new Date().getTime();

      util.requestRenewHouse(houseId, userId, updateTime)
      .then(res => {
        wx.hideLoading();

        let tips = '';

        if (res.code == 0) {
          tips = '置顶成功！'
        }
        else if (res.code == 1) {
          tips = '已超出每日置顶上限，明天再来吧~'
        }
        else if (res.code == 2) {
          tips = '已超出今日中介房源置顶上限。'
        }
        else {
          tips = '请求错误，请稍后再试。'
        }

        wx.showToast({
          title: tips,
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 3000)
          }
        })
        
      })
    },

    goToHouseDetails: function () {
      let that = this;
      let data = that.data;

      if (data.houseInfo.status != 'postedChecked') {
        wx.showToast({
          title: '只能查看在架房源的详情哦~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
        return;
      }

      app.globalData.woowoHouseTemp = data.woowoHouseInfo;

      wx.navigateTo({
        url: '../../pages/houseDetail/houseDetail?from=aptcard'
      })
    },

    goToEdit: function () {
      let that = this;
      let data = that.data;

      app.globalData.woowoHouseDraft = new WoowoHouse(data.woowoHouseInfo);

      wx.navigateTo({
        url: '../../pages/post/post?edit=true'
      })
    }
  }
})
