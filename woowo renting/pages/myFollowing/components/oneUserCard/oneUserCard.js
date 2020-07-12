const app = getApp();
const util = require('../../../../utils/util');

// pages/myFollowing/components/oneUserCard/oneUserCard.js
Component({
  /**
   * Component properties
   */
  properties: {
    userInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    ifFollowing: false
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.userInfo.username = decodeURIComponent(data.userInfo.username);
    data.ifFollowing = app.globalData.woowoUserInfo.checkIfFollowingUser(data.userInfo.user_id);

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    goToUserPage: function () {
      let that = this;
      let data = that.data;

      wx.navigateTo({
        url: '../../../../userPage/userPage?targetUserInfo=' + JSON.stringify(data.userInfo)
      })
    },
    switchFollowingStatus: function () {
      let that = this;
      let data = that.data;
  
      let selfUserId = app.globalData.woowoUserInfo.user_id;
      let targetUserId = data.userInfo.user_id;
  
      let prevFollowingStatus = data.ifFollowing;
  
      let loadingText = prevFollowingStatus ? '取消关注中...' : '关注中';
      
      wx.showLoading({
        title: loadingText,
        mask: true
      });
  
      util.requestUpdateFollowingUser(selfUserId, targetUserId)
      .then(res => {
  
        wx.hideLoading();
  
        if (res.code == 0) {
          data.ifFollowing = !prevFollowingStatus;
          
          let status = data.ifFollowing ? 'follow' : 'unfollow';
  
          app.globalData.woowoUserInfo.changeFollowingStatus(status, targetUserId);
  
          that.setData(data);
  
          // store locally
          util.updateWoowoUserLocally(data.woowoUserInfo);
        }
        else {
          wx.showToast({
            title: '出错啦，请稍后再试',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
      })
    }
  }
})
