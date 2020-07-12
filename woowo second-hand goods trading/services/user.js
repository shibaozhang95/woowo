const util = require('../utils/util.js');
const api = require('../services/api');
const appId = 'wx7a5b393abd749b47';
const secret = '79934a2ce5f55ad32ae7b2d21b0d8285';

// let _app = getApp();

function getSessionKey (data = {}) {
  return new Promise(function (resolve, reject) {
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
    + appId + '&secret=' + secret + '&js_code=' + data.jsCode
    + '&grant_type=authorization_code';

    var url2 = 'https://woniu-xcx.xyz/api/wx/encapsulate/apiwx.php?code=' + data.jsCode;
    util.request(url2).then(res => {
      resolve(res)
    }).catch(err => {
      console.log(err);
      reject(err);
    })
  })
}

// 0001: 调用 wx.login 获取 jsCode 失败
// 0002: 换取 sessionKey 失败
// 0003: 获取 unionId 失败
// 0004: 插入 用户表 失败
// 0005: 本地保存 用户信息 失败
// 0006: 解析 unionId 失败

function register (getuserinfoRes) {

  let app = getApp();

  app.globalData.userInfo = getuserinfoRes.detail.userInfo;

  return new Promise(function (resolve, reject) {

    // First step: get code
    let registerProcess = new Promise((loginRes, loginRej) => {
      wx.login({
        success: function(res){
          console.log('First step: get code successfully')
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

    // // Third step1: check getting user information authority
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

    // // Third step2: get user information
    // .then(sessionRes => {
    //   return new Promise((processResolve, processReject) => {
    //     wx.getUserInfo({
    //       success: res => {
    //         app.globalData.userInfo = res.userInfo;
    //         console.log(res.userInfo)
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

    // 4th step: insert user
    .then(unionId => {
      return new Promise((processResolve, processReject) => {
        console.log('~~~~~~~~~~~~~~~~~~')
        console.log(getuserinfoRes)
        console.log('~~~~~~~~~~~~~~~~~~')
        let param = {
          'wx_unionid': unionId,
          'username': encodeURIComponent(getuserinfoRes.detail.userInfo.nickName),
          'user_image': getuserinfoRes.detail.userInfo.avatarUrl
        }

        console.log(param);

        
        util.request(api.InsertUser, param, 'POST')
        .then(res => {
          console.log(res);
          if (res.data.code != 0) {
            console.log('failed to request insert user');
            
            resolve({
              ifLogedin: false,
              errMsg: '0004'
            })
          }
          else {  
            res.data.data.shopInfo = res.data.shopInfo;
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

    // Last step: store union id and other info
    .then(woowoUserInfo => {
      console.log(woowoUserInfo)

      woowoUserInfo.username = decodeURIComponent(woowoUserInfo.username)

      console.log(woowoUserInfo)
      // store to app
      app.globalData.unionId = woowoUserInfo.wx_unionid;

      app.globalData.woowoUserInfo = woowoUserInfo;
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

function checkIfRegistered () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'unionId',
      success: (res) => {
        // console.log(res)
        if (res.data) {
          resolve({
            'ifLogedin': true,
            'unionId': res.data
          });
        }
        else {
          console.log('Did not logedin');
          resolve({'ifLogedin': false})
        }
      },
      fail: (err) => {
        // console.log(err);
        resolve({'ifLogedin': false})
      }
    })
  })
}

// function check
function checkIfLogedin () {
  let app = getApp();
  return new Promise((resolve, reject) => {
    if (app.globalData.woowoUserInfo) {
      resolve({
        'ifLogedin': true
      })
    }
    else {
      resolve({
        'ifLogedin': false
      })
    }
  })
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

function getOpenid () {
  let app = getApp();
  
  return new Promise((resolve, reject) => {

    // make sure openid has been stored locally
    if (app.globalData.openid) {
      resolve({
        'openid': app.globalData.openid
      })
      return ;
    }

    wx.getStorage({
      key: 'openid',
      success: (res) => {
        app.globalData.openid = res.data;

        resolve({
          'openid': app.globalData.openid
        })

        return;
      },
      fail: (err) => {
        console.log(err);

        // request for login first for jsCode
        wx.login({
          success: function(res){
            // request for openid
            getSessionKey({ jsCode: res.code })
            .then(sessionData => {
              console.log(sessionData)
              app.globalData.openid = sessionData.data.openid
              resolve({
                'openid': app.globalData.openid
              })
              wx.setStorage({
                key: 'openid',
                data: sessionData.data.openid,
                success: (res) => {
                  console.log('Stored openid locally successfully')
                },
                fail: (err) => {
                  console.log(err);
                  console.log('Stored openid locally failed!!!')
                }
              })
            })
            .catch(err => {
              console.log(err);
              resolve({
                'openid': null
              })
            })
          },
          fail: function(err) {
            console.log('failed to get code');
            resolve({
              'openid': null
            })
          }
        })
        
      }
    })
  })
}

// 1001: geting authority failed
// 1002: updating user info failed
function login (woowoUserInfo, wx_unionid) {
  
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
          proResolve({
            wx_unionid: woowoUserInfo.wx_unionid,
            nickName: woowoUserInfo.username,
            avatarUrl: woowoUserInfo.user_image
          })
        }
      })
    })

    // Second step: update user infomation
    .then(userInfo => {
      return new Promise((proResolve, proReject) => {
        util.request(api.InsertUser, {
          'wx_unionid': wx_unionid,
          'username': encodeURIComponent(userInfo.nickName),
          'user_image': userInfo.avatarUrl
        }, 'POST').then(res => {
          // console.log(res)
          if (res.data.code == 0) {
            res.data.data.shopInfo = res.data.shopInfo;
            proResolve(res.data.data)
          }
          else {
            console.log('Update user Information failed!')
            resolve({
              ifLogedin: false,
              errMsg: '1002'
            })
          }
        })
      })
      
    })

    // Third step: update locally
    .then(woowoUserInfo => {
      // console.log(woowoUserInfo)
      woowoUserInfo.username = decodeURIComponent(woowoUserInfo.username);
      // app.globalData.woowoUserInfo = woowoUserInfo

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

function checkLimitation () {
  let app = getApp();

  return new Promise((resolve, reject) => {

    let userId = app.globalData.woowoUserInfo.user_id;

    util.requestCheckStuffsLimitation(userId)
    .then(res => {
      if (res.code == 0) {
        resolve({
          code: 0
        })
      }
      else if (res.code == -1 && res.data) {
        resolve({
          code: -1,
          errMsg: '您目前最多可同时在线 ' + res.data + ' 个商品!'
        })
      }

      else {
        resolve({
          code: -1,
          errMsg: '出错了, 请稍后再试~'
        })
      }
    })
  //   let userRight = app.globalData.woowoUserInfo.user_right;
  //   let userStuffs = Number(app.globalData.woowoUserInfo.user_stuffs);
  //   let businessLimitation = app.globalData.businessLimitation;
  //   let normalLimitation = app.globalData.normalLimitation;
  //   if (userRight == 'business') {
  //     if (userStuffs == businessLimitation || userStuffs > businessLimitation) {
  //       resolve({
  //         code: -1,
  //         errMsg: '商家用户最多可同时在线' + businessLimitation + '个商品！'
  //       })
  //     }
  //     else {
  //       resolve({
  //         code: 0
  //       })
  //     }
  //   }
  //   if (userRight == '' || userRight == 'normal') {
  //     if (userStuffs == normalLimitation || userStuffs > normalLimitation) {
  //       resolve({
  //         code: -1,
  //         errMsg: '普通用户最多可同时在线' + normalLimitation + '个商品！如要上新请先下架wo~'
  //       })
  //     }
  //     else {
  //       resolve({
  //         code: 0
  //       })
  //     }
  //   }
  })
  
}


module.exports = {
  getSessionKey,

  checkIfRegistered,
  checkIfLogedin,
  register,
  login,
  ifGetAuthority,
  checkLimitation,

  getOpenid
}