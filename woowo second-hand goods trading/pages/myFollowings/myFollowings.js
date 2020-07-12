const util = require('../../utils/util');

const app = getApp();

Page({
  data: {
    myFollowingList: [],

    ifNothing: false,
    ifLoading: false,
    ifReachBottom: false,

    ifRequestedUsers: false,
    ifRequestedShops: false
  },
  onLoad: function () {
    let that = this;
    let data = that.data;

    that.getFollowingUsers();
    that.getFollowingShops();
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的关注',
      success: function(res) {
        // success
      }
    })
  },

  getFollowingUsers: function () {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    let likedUsers = app.globalData.woowoUserInfo.like_user;
    util.requestAllFollowingUser(likedUsers)
    .then(res => {
      data.ifLoading = false;
      data.ifRequestedUsers = true;

      if (res.code == 0) {

        data.myFollowingList = data.myFollowingList.concat(res.data);
        
        if (data.myFollowingList.length == 0 && data.ifRequestedUsers
          && data.ifRequestedShops) {
          data.ifNothing = true;
        }
        else {
          data.ifReachBottom = true;
        }
      }
      
      else {
        data.ifNothing = true;

        wx.showToast({
          title: '出错了，请稍后再试~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }

      that.setData(data);
    })
  },

  getFollowingShops: function () {
    let that = this;
    let data = that.data;

    data.ifLoading = true;
    that.setData(data);

    let likedShops = app.globalData.woowoUserInfo.like_shop;
    util.requestLikedShopsList(likedShops)
    .then(res => {
      data.ifLoading = false;
      data.ifRequestedShops = true;

      if (res.code == 0) {

        data.myFollowingList = res.data.concat(data.myFollowingList)

        if (data.myFollowingList.length == 0 && data.ifRequestedUsers
          && data.ifRequestedShops) {
          data.ifNothing = true;
        }
        else {
          data.ifReachBottom = true;
        }
      }
      
      else {
        data.ifNothing = true;

        wx.showToast({
          title: '出错了，请稍后再试~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        })
      }

      that.setData(data);
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  
  // switchFollowUser: function (event) {
  //   let that = this;

  //   let userId = app.globalData.woowoUserInfo.user_id;
  //   let sellerId = event.currentTarget.dataset.userId;

  //   wx.showLoading({
  //     title: '加载中'
  //   })
  //   util.requestSwitchFollowUser(userId, sellerId)
  //   .then(res => {
      
  //     // find the one
  //     let newUserList = that.data.myFollowingList;
  //     for (let i = 0, len = newUserList.length; i < len; ++i) {
  //       if (newUserList[i].userId == sellerId) {
  //         newUserList[i].ifFollowing = !newUserList[i].ifFollowing

  //         util.updateFollowingUserLocally(sellerId, newUserList[i].ifFollowing)
  //       }
  //     }
      
  //     that.setData({
  //       'myFollowingList': newUserList
  //     })
  //     wx.hideLoading()
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  // },

  

  // goToHomepage: function (event) {
  //   // console.log(event)
  //   let dataset = event.currentTarget.dataset;
  //   let params = {
  //     username: dataset.username,
  //     userId: dataset.userId,
  //     userAvatarUrl: dataset.userAvatarUrl,
  //     userUnionId: dataset.userUnionId
  //   }

  //   wx.navigateTo({
  //     url: '../homepage/homepage?' + util.paramObjToStr(params)
  //   })
  // }
})