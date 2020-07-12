import util from './util';
import api from '../services/api';

export default class WoowoUser {
  constructor (userInfo) {
    this.user_id = userInfo.user_id ? userInfo.user_id : '';
    this.user_stuffs = userInfo.user_stuffs ? userInfo.user_stuffs : 0;
    this.username = userInfo.username ? userInfo.username : '';
    this.wx_unionid = userInfo.wx_unionid ? userInfo.wx_unionid : '';
    this.wx_id = userInfo.wx_id ? userInfo.wx_id : '';
    this.wx_qr = userInfo.wx_qr ? userInfo.wx_qr : '';
    this.phone = userInfo.phone ? userInfo.phone : '';
    this.user_image = userInfo.user_image ? userInfo.user_image : '';
    
    // liked: stuffs
    this.liked = userInfo.liked ? userInfo.liked : '';
    this.liked = removeExtraComma(this.liked);
    // like_user
    this.like_user = userInfo.like_user ? userInfo.like_user : '';
    this.like_user = removeExtraComma(this.like_user);
    // liked: housemate
    this.like_post = userInfo.like_post ? userInfo.like_post : '';
    this.like_post = removeExtraComma(this.like_post);

    this.history = userInfo.history ? userInfo.history : '';
    this.user_right = userInfo.user_right ? userInfo.user_right : '';
    this.renew = userInfo.renew ? userInfo.renew : '';

    this.ifLogedin = this.wx_unionid ? true : false;
  }

  updateUserInfo (userInfo) {
    this.user_id = userInfo.user_id ;
    this.user_stuffs = userInfo.user_stuffs;
    this.username = userInfo.username;
    this.wx_unionid = userInfo.wx_unionid;
    this.wx_id = userInfo.wx_id;
    this.wx_qr = userInfo.wx_qr;
    this.phone = userInfo.phone;
    this.user_image = userInfo.user_image;

    this.liked = userInfo.liked;
    this.liked = removeExtraComma(this.liked);
    this.like_user = userInfo.like_user;
    this.like_user = removeExtraComma(this.like_user);
    this.like_post = userInfo.like_post;
    this.like_post = removeExtraComma(this.like_post);
    
    this.history = userInfo.history;
    this.user_right = userInfo.user_right;
    this.renew = userInfo.renew;

    this.ifLogedin = true;
  }

  checkIfFollowingUser (targetUserId) {
    let followingList = this.like_user.split(',');

    for (let i = 0, len = followingList.length; i < len; ++i) {
      if (targetUserId == followingList[i]) {
        return true;
      }
    }

    return false;
  }

  changeFollowingStatus (status, targetUserId) {
    let followingList = this.like_user.split(',');

    if (status == 'follow') {
      followingList.push(targetUserId);
    }
    else if (status == 'unfollow') {
      for (let i = 0, len = followingList.length; i < len; ++i) {
        if (targetUserId == followingList[i]) {
          followingList.splice(i, 1);
          break;
        }
      }
    }

    // remove all of the strange data
    for (let i = 0, len = followingList.length; i < len; ++i) {
      if (followingList[i] == '') {
        followingList.splice(i, 1);
        --len;
        --i;
      }
    }
    this.like_user = followingList.join(',');
  }

  checkIfLikedHouse (targetHouseId) {
    let houseList = this.liked.split(',')

    for (let i = 0, len = houseList.length; i < len; ++i) {
      if (targetHouseId == houseList[i]) {
        return true;
      }
    }

    return false;
  }

  updateLikedHouse (status, targetHouseId) {
    let houseList = this.liked.split(',');

    if (status == 'like') {
      houseList.push(targetHouseId);
    }
    else if (status = 'unlike') {
      for (let i = 0, len = houseList.length; i < len; ++i) {
        if (targetHouseId == houseList[i]) {
          houseList.splice(i, 1);
          break;
        }
      }
    }

    // remove all of the strange data
    for (let i = 0, len = houseList.length; i < len; ++i) {
      if (houseList[i] == '') {
        houseList.splice(i, 1);
        --len;
        --i;
      }
    }

    this.liked = houseList.join(',');
  }

  // checkIfFollowing
  checkIfLiked (likeWhat, targetId) {
    let fieldName = '';

    if (likeWhat == 'house') fieldName = 'liked';
    else if (likeWhat == 'housemate') fieldName = 'like_post';
    else if (likeWhat == 'user') fieldName = 'like_user';
  
    if (!fieldName) {
      console.log('Error');
      return false;
    }

    let list = this[fieldName].split(',');

    for (let i = 0, len = list.length; i < len; ++i) {
      if (targetId == list[i]) {
        return true;
      }
    }

    return false;
  }

  updateLikingStatus (likeWhat, status, targetId) {
    let fieldName = '';

    if (likeWhat == 'house') fieldName = 'liked';
    else if (likeWhat == 'housemate') fieldName = 'like_post';
    else if (likeWhat == 'user') fieldName = 'like_user';
  
    if (!fieldName) {
      console.log('Error');
      return false;
    }

    let list = this[fieldName].split(',');

    if (status == 'like') {
      list.push(targetId);
    }
    else if (status == 'unlike') {
      for (let i = 0, len = list.length; i < len; ++i) {
        if (targetId == list[i]) {
          list.splice(i, 1);
          break;
        }
      }
    }

    this[fieldName] = removeExtraComma(list.join(','));
  }

  checkIfRegistered () {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'unionId',
        success: (res) => {
          // console.log(res)
          if (res.data) {
            resolve({
              'ifRegistered': true,
              'unionId': res.data
            });
          }
          else {
            console.log('Did not logedin');
            resolve({'ifRegistered': false})
          }
        },
        fail: (err) => {
          console.log(err);
          resolve({'ifRegistered': false})
        }
      })
    })
  }

  login (unionId) {
    // let app = getApp();
  
    return new Promise((resolve, reject) => {
      // First step: get user information
      ifGetAuthority().then(auth => {
        return new Promise((proResolve, proReject) => {
          // if still get authority, update userInfo
          if (auth.ifGetAuth == true) {
            wx.getUserInfo({
              success: res => {
                proResolve(res.userInfo)
              }
            })
          }
          // if failed to get authority, use old data
          else {
            console.log('NO AUTHORITY')
            proResolve({
              nickName: this.username,
              avatarUrl: this.user_image
            })
          }
        })
      })
  
      // Second step: update user infomation
      .then(userInfo => {
        return new Promise((proResolve, proReject) => {
          util.request(api.UpdateUser, {
            'wx_unionid': unionId,
            'username': encodeURIComponent(userInfo.nickName),
            'user_image': userInfo.avatarUrl
          }, 'POST').then(res => {
            console.log(res)
            if (res.data.code == 0) {
              proResolve(res.data.data)
            }
            else {
              console.log('Update user Information failed!')
              reject({
                code: -1,
                errMsg: 'Update user Information failed!'
              })
            }
          })
        })
        
      })
  
      // Third step: update locally
      .then(woowoUserInfo => {
        woowoUserInfo.username = decodeURIComponent(woowoUserInfo.username);
  
        wx.setStorage({
          key: 'woowoUserInfo',
          data: woowoUserInfo,
          success: () => {
            resolve({
              'ifLogedin': true,
              'woowoUserInfo': woowoUserInfo
            })
          }
        })
  
      })
  
      .catch(err => {
        console.log(err);
        resolve({
          'ifLogedin': false,
          'errMsg': err
        })
      })
    })
  }

  // 0001: 调用 wx.login 获取 jsCode 失败
  // 0002: 换取 sessionKey 失败
  // 0003: 获取 unionId 失败
  // 0004: 插入 用户表 失败
  // 0005: 本地保存 用户信息 失败
  // 0006: 解析 unionId 失败
  register (getuserinfoRes) {
    let app = getApp();

    app.globalData.userInfo = getuserinfoRes.detail.userInfo;

    return new Promise(function (resolve, reject) {
  
      // First step: get code
      let registerProcess = new Promise((loginRes, loginRej) => {
        wx.login({
          success: function(res){
            console.log('First step: get js code successfully');
            loginRes(res);
          },
          fail: function(err) {
            console.log('failed to get code');
            resolve({
              ifLogedin: false,
              errMsg: '0001'
            })
          }
        })
      });
  
      // Seccond step: get session
      registerProcess.then(loginRes => {
        return new Promise((processResolve, processReject) => {
          getSessionKey({
            jsCode: loginRes.code
          }).then(sessionRes => {
            console.log('Second step: get sessionid successfully');
            console.log(sessionRes);
  
            // store open id
            app.globalData.openid = sessionRes.data.openid;
            wx.setStorage({
              key: 'openid',
              data: sessionRes.data.openid,
              success: () => {
                console.log('Stored openid locally successfully!');
              }
            })
  
            processResolve(sessionRes);
          }).catch(sessionErr => {
            console.log('failed to get session id');
            resolve({
              ifLogedin: false,
              errMsg: '0002'
            })
          })
        })
        
      })
  
      // Third step1: check getting user information authority
      // .then(sessionRes => {
      //   return new Promise((processResolve, processReject) => {
      //     wx.getSetting({
      //       success: res => {
      //         if (res.authSetting['scope.userInfo']) {
      //           console.log('Third step1: get getting user information authority successfully')
      //           processResolve(sessionRes);
      //         }
      //         else {
      //           console.log('failed to get getting user infromation authority');
      //           processReject (new Error('failed to get getting user infromation authority'));
      //         }
      //       },
      //       fail: err => {
      //         console.log('falied to check getting user information authority');
      //         processReject(err);
      //       }
      //     })
      //   })
      // })
  
      // Third step2: get user information
      // .then(sessionRes => {
      //   return new Promise((processResolve, processReject) => {
      //     wx.getUserInfo({
      //       success: res => {
      //         app.globalData.userInfo = res.userInfo;

      //         console.log('Third step2: get user information successfully');
    
      //         let newRes = {
      //           'sessionRes': sessionRes,
      //           'iv': res.iv,
      //           'encryptedData': res.encryptedData
      //         }
      //         processResolve(newRes);
      //       },
      //       fail: err => {
      //         console.log('falied to get user information');
      //         processReject(err);
      //       }
      //     })
      //   })
        
      // })
  
      // Third step: get UnionId
      .then(sessionRes => {
        return new Promise((processResolve, processReject) => {
          util.request(api.DecUnionId, {
            'session_key': sessionRes.data.session_key,
            'iv': getuserinfoRes.detail.iv,
            'encryptedData': getuserinfoRes.detail.encryptedData
          }, 'POST')
          .then(res => {

            console.log(res);

            if (res.statusCode == 200 && res.data.unionId) {
              console.log('Fourth step: get UnionId successfully');

              console.log(res);
              let unionId = res.data.unionId;
              processResolve(unionId);
            }
            else {
              console.log('failed to get UnionId');
              resolve({
                ifLogedin: false,
                errMsg: '0006'
              })
            }
          })
          .catch(err => {
            console.log('failed to get UnionId');
            resolve({
              ifLogedin: false,
              errMsg: '0003'
            })
          })
        })
      })
  
      // 5th step: insert user
      .then(unionId => {
        return new Promise((processResolve, processReject) => {
          let param = {
            'wx_unionid': unionId,
            'username': encodeURIComponent(app.globalData.userInfo.nickName),
            'user_image': app.globalData.userInfo.avatarUrl
          }

          util.request(api.InsertUser, param, 'POST')
          .then(res => {
            console.log(res);
            if (res.data.code != 0) {
              console.log('failed to request insert user');
              throw new Error('failed to request insert user');
            }
            else {  
              processResolve(res.data.data)
            }
            
          })
          .catch(err => {
            console.log('failed to request insert user');
            resolve({
              ifLogedin: false,
              errMsg: '0004'
            })
          })
        })
      })
  
      // Last step: store union id and other infor
      .then(woowoUserInfo => {
        console.log(woowoUserInfo)
  
        woowoUserInfo.username = decodeURIComponent(woowoUserInfo.username)
  
        // store to app
        app.globalData.unionId = woowoUserInfo.wx_unionid;
        
        // store to local
        wx.setStorage({
          key: 'unionId',
          data: woowoUserInfo.wx_unionid,
          success: () => {
            
          }
        })
  
        // store other
        wx.setStorage({
          key: 'woowoUserInfo',
          data: woowoUserInfo,
          success: () => {
            console.log('Last step: store union id successfully')
            resolve({
              'ifLogedin': true,
              'woowoUserInfo': woowoUserInfo
            });
          },
          fail: () => {
            resolve({
              'ifLogedin': false,
              errMsg: '0005'
            });
          }
        })
      })
  
      .catch(err => {
        console.log(err);
        resolve({
          'ifLogedin': false,
          'errMsg': err
        });
      })
    })
  }
}

function removeExtraComma (str) {
  let strList = str.split(',')
  
  for (let i = 0, len = strList.length; i < len; ++i) {
    if (strList[i] == '') {
      strList.splice(i, 1);
      --len;
      --i;
    }
  }

  return strList.join(',')
}

function ifGetAuthority () {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        console.log(res)
        resolve({
          ifGetAuth: res.authSetting['scope.userInfo']
        }) 
      }
    })
  })
}

function getSessionKey (data = {}) {
  return new Promise(function (resolve, reject) {
    // var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
    // + appId + '&secret=' + secret + '&js_code=' + data.jsCode
    // + '&grant_type=authorization_code';

    var url2 = api.GetSessionKey + '?code=' + data.jsCode;
    util.request(url2).then(res => {
      resolve(res)
    }).catch(err => {
      console.log(err);
      reject(err);
    })
  })
}