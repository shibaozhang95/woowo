const API = require('../services/api.js');
const _ = require('../utils/underscore-min');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    let paraStr = paramObjToStr(data);
    // console.log(url + (paraStr ? ('?' + paraStr) : ''));
    wx.request({
      url: url + (paraStr ? ('?' + paraStr) : ''),
      data: data,
      method: "GET", 
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        // console.log("request successd");
        resolve(res);
      },
      fail: function(err) {
        reject(err);
        console.log("request falied");
      },
      complete: function() {
        // complete
      }
    })
  })
}

function request2 (url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {

      }
    })
  })
}

function paramObjToStr (obj) {
  let paramStr = '';
  
  for (let key in obj) {
    paramStr = paramStr + key + '=' + JSON.stringify(obj[key]) + '&';
  }
  // paramStr.length--;
  paramStr = paramStr.slice(0, paramStr.lastIndexOf('&'));
  // console.log(paramStr)
  return paramStr;
}

/**
 *  This part if old google api 
 */
// function requestLocalityByQuery (keyword) {
//   return new Promise(function (resolve, reject) {
//     let ifPostCode = isPostCode(keyword);

//     keyword = ifPostCode ? Number(keyword) : keyword;

//     request('https://woniu.com.au/api/map/post_search_address.php', {
//       'input': keyword,
//       'components': 'country:au',
//       'types': ifPostCode ? '(regions)' : '(cities)',
//       // 'key': 'AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls'
//     }).then(res => {
//       if (res.statusCode == 200) {
//         resolve({
//           code: 0, 
//           predictions: res.data.predictions
//         });
//       }
      
//     }).catch(err => {
//       resolve({
//         code: -1,
//         errMsg: 'Request error!'
//       })
//     })
//   })
// }

// function requestCurrentAddress (latlng, types) {
//   return new Promise((resolve, reject) => {
//     request('https://woniu.com.au/api/map/post_google_map_two.php', {
//         latlng: latlng,
//         result_type: types
//       }).then(res => {
//         if (res.statusCode == 200) {
//           resolve({
//             code: 0,
//             data: res.data.results
//           })
//         }
//         else {
//           resolve({
//             code: -1,
//             errMsg: 'Internet fault'
//           })
//         }
//       })
//   })
// }

// function isPostCode (keyword) {
//   let postCode = Number(keyword);

//   return !isNaN(postCode);
// }

function requestAutoSuggesteBing (query, entityType) {
  return new Promise((resolve, reject) => {
    if (!query || !entityType) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.BingSearch, {
      query: query,
      includeEntityTypes: entityType
    }).then(res => {
      console.log(res);
      if (res.statusCode == 200) {
        resolve({
          code: 0,
          predictions: res.data.resourceSets[0].resources[0].value
        })
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request location autosuggeste error!'
      })
    })
  })
}

function requestSearchLocationBing (query) {
  return new Promise((resolve, reject) => {
    if (!query) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.BingLocationByQuery, {
      query: query
    }).then(res => {
      if (res.statusCode == 200) {
        resolve({
          code: 0,
          result: res.data.resourceSets[0].resources[0]
        })
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request search location error!'
      })
    })
  })
}

function requestLocationByPointBing (point, entityType) {
  return new Promise((resolve, reject) => {
    if (!point || !entityType) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.BingLocationByPoint, {
      point: point,
      includeEntityTypes: entityType
    }).then(res => {
      if (res.statusCode == 200) {
        resolve({
          code: 0,
          data: res.data.resourceSets[0].resources
        })
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request search location error!'
      })
    })
  })
}

function wxGetCurrentLatlng () {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res);
        resolve({
          code: 0,
          data: res.latitude + ','  + res.longitude
        })
      },
      fail: () => {
        resolve({
          code: -1,
          errMsg: 'Getting location authority failed!'
        })
      }
    })
  })
}

function requestAllMessages (userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      resolve({
        code: -1,
        errMsg: 'No user id provided!'
      });
      return;
    }

    request(API.GetAllMsgByUserId, {
      user_one_id: userId
    }, 'POST').then(res => {
      if (res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }

      else {
        resolve({
          code: -1,
          errMsg: 'Erron in return request data'
        })
      }
    })
  })
}

function requestCertainMessages (userOneId, userTwoId) {
  return new Promise((resolve, reject) => {
    if (!userOneId || !userTwoId) {
      resolve({
        code: -1,
        errMsg: 'Two users id are needed!'
      })
      return;
    }

    request(API.GetCertainMsgByUserId, {
      user_one_id: userOneId,
      user_two_id: userTwoId
    }, 'POST').then(res => {
      if (res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }

      else {
        resolve({
          code: -1,
          errMsg: 'Erron in return request data'
        })
      }
    })
  })
}

function requestSendingMsg (userOneId, userTwoId, msgObj) {
  return new Promise((resolve, reject) => {
    if (!userOneId || !userTwoId || !msgObj) {
      resolve({
        code: -1,
        errMsg: 'paramter errors!'
      })
      return;
    }

    let filteredMsgObj = JSON.parse(JSON.stringify(msgObj));
    filteredMsgObj.msgContent = encodeURIComponent(filteredMsgObj.msgContent)

    request(API.UpdateMsgWithTwoId, {
      user_one_id: userOneId,
      user_two_id: userTwoId,
      msg_obj: filteredMsgObj
    }, 'POST').then(res => {
      if (res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }

      else {
        resolve({
          code: -1,
          errMsg: 'Error in return request data'
        })
      }
    })
  })
}

function requestDeleteMessages (userOneId, userTwoId) {
  return new Promise((resolve, reject) => {
    if (!userOneId || !userTwoId) {
      resolve({
        code: -1,
        errMsg: 'paramter errors!'
      })
    }

    request(API.DeleteMsgBetweenUsers, {
      user_one_id: userOneId,
      user_two_id: userTwoId
    }, 'POST').then(res => {
      if (res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        resolve({
          code: -1,
          errMsg: 'Error in return request data'
        })
      }
    })
  })
}

function requestSetMessagesAsRead (senderId, receiverId) {
  return new Promise((resolve, reject) => {
    if (!senderId || !receiverId) {
      resolve({
        code: -1,
        errMsg: 'paramters error!'
      })
    }

    request(API.SetMsgsAsRead, {
      senderId: senderId,
      receiverId: receiverId
    }, 'POST').then(res => {
      if (res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        resolve({
          code: -1,
          errMsg: 'Error in return request data'
        })
      }
    })
  })
}

function requestVerifyingPhoneNumber (phoneNumber) {
  return new Promise((resolve, reject) => {
    request(API.VerifyingPhoneNumber, {'phone': phoneNumber}, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requrest validating phone number'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestCreateAHouseId (woowoUserInfo, type) {
  return new Promise((resolve, reject) => {
    if (!woowoUserInfo || !type) {
      resolve({
        code: -1,
        errMsg: 'Parameters error!'
      })
    }
    let user_id = woowoUserInfo.user_id;
    let userInfo = {
      user_id: woowoUserInfo.user_id,
      username: encodeURIComponent(woowoUserInfo.username),
      user_image: woowoUserInfo.user_image,
      wx_unionid: woowoUserInfo.wx_unionid,
      user_right: woowoUserInfo.user_right
    }
    request(API.CreateNewHouseId, {
      user_id: user_id,
      type: type,        //  短租、整租、合租
      userInfo: JSON.stringify(userInfo)
    })
    .then(res => {
      if (res.statusCode == 200 && (res.data.code == 0 || res.data.code == 1)) {
        resolve({
          code: res.data.code,
          data: res.data.data ? res.data.data : res.data.id
        })
      }
      else {
        throw 'Something wrong when requrest creating a house id'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestDeleteAHouse (houseId, userInfo) {
  return new Promise((resolve, reject) => {
    request(API.DeleteHouse, {
      h_id: houseId,
      user_id: userInfo.user_id
    })
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requrest deleting a house by id'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestUpdateHouseInfo (houseId, fieldName, fieldValue, userInfo) {
  return new Promise((resolve, reject) => {

    // do some data fileter first
    let filteredFieldValue = JSON.parse(JSON.stringify(fieldValue));

    if (fieldName == 'description') {
      filteredFieldValue.houseTitle = encodeURIComponent(filteredFieldValue.houseTitle);
      filteredFieldValue.houseDetail = encodeURIComponent(filteredFieldValue.houseDetail);
    }
    if (fieldName == 'rules') {
      filteredFieldValue.others = encodeURIComponent(filteredFieldValue.others);
    }
    if (fieldName == 'contact') {
      filteredFieldValue.wechat = encodeURIComponent(filteredFieldValue.wechat);
      filteredFieldValue.phone = encodeURIComponent(filteredFieldValue.phone);
    }

    request2(API.UpdateHouseInfo2, {
      id: houseId,
      str: fieldName,
      [fieldName]: filteredFieldValue,
      user_id: userInfo.user_id
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && (res.data.code == 0 || res.data.code == 1)) {
        resolve({
          code: res.data.code,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requrest updating house information'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestHousingList (prevPage, nextPage, filter) {
  return new Promise((resolve, reject) => {

    // check if others other filter
    let ifFilter = filter.suburb || filter.state || filter.bedrooNum || filter.bathroomNum
      || filter.parkingNum || filter.pricePerWeekLow || filter.pricePerWeekHigh 
      || filter.companyId || filter.rentType || filter.orderStr;

    if (ifFilter) filter.filter = true;
    
    let params = {
      previous_page: prevPage,
      next_page: nextPage,
      ...filter
    }

    request(API.SelectHouseWith, params, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting houseing list'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestRenewHouse (houseId, userId, uploadTime) {
  return new Promise((resolve, reject) => {
    if (!houseId || !userId || !uploadTime) {
      resolve({
        code: -1,
        errMsg: 'Parameters error!'
      })
    }

    request(API.RenewHouse, {
      h_id: houseId,
      user_id: userId,
      upload_time: uploadTime
    }, 'POST')
    .then (res => {
      if (res.statusCode == 200 && (res.data.code >= 0)) {
        resolve({
          code: res.data.code,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting renewing houses'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestHousesByIds (housesIds) {
  return new Promise((resolve, reject) => {
    if (!housesIds) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.GetHousesByIds, {
      h_id: housesIds
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting houses by ids'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestHousesByUserId (userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.GetHousesByUserId, {
      id: userId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting houses by userId'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestUpdateFollowingUser (selfUserId, targetUserId)  {
  return new Promise((resolve, reject) => {
    if (!selfUserId || !targetUserId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.UpgradeLikeUser, {
      user_id: selfUserId,
      like_id: targetUserId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && (res.data.code == 0||res.data.code==1)) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when updating following user'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestAddingViewCount (houseId) {
  return new Promise((resolve, reject) => {
    if (!houseId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.AddViewCountHouse, {
      h_id: houseId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting adding view count'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestLikeOrUnLikeAHouse (userId, houseId, action) {
  return new Promise((resolve, reject) => {
    if (!userId || (action != 'like' && action != 'unlike' || !houseId)) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.LikedTheHouse, {
      user_id: userId,
      check: action,
      h_id: houseId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && (res.data.code == 0 || res.data.code == 1)) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting liking or unliking a house'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestUsersById (userStr) {
  return new Promise((resolve, reject) => {
    if (!userStr) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.FetchUserById, {
      user_id: userStr
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting users by id'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestCreateQRCode (houseId) {
  return new Promise((resolve, reject) => {
    if (!houseId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(API.QRCodeCreate, {
      scene: houseId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting users by id'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestNews () {
  return new Promise((resolve, reject) => {
    request(API.FetchNews, {}, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting news'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestUpdateUserInfo (woowoUserInfo) {
  let param = {
    wx_unionid: woowoUserInfo.wx_unionid
  }
  if (woowoUserInfo.phone && woowoUserInfo.phone != '0') {
    param['phone'] = woowoUserInfo.phone;
  }
  if (woowoUserInfo.wx_qr) {
    param['wx_qr'] = woowoUserInfo.wx_qr;
  }
  if (woowoUserInfo.wx_id) {
    param['wx_id'] = woowoUserInfo.wx_id
  }

  return new Promise((resolve, reject) => {
    request(API.UpdateUser, param, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting news'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function updateWoowoUserLocally (woowoUserInfo) {
  wx.setStorage({
    key: 'woowoUserInfo',
    data: woowoUserInfo,
    success: () => {
      console.log('Update woowoUserInfo successfully');
    }
  })
}

/**
 *  AGENTS BLOCK
 */
function requestHotAgents (type) {
  return new Promise((resolve, reject) => {
    request2(API.getHotInter, {
      'str': type
    }, 'POST').then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something goes wrong when requesting hot agent companies'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestCompanyInfoById (id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      resolve({
        code: -1,
        errMsg: 'parameters error'
      })
    }

    request2(API.getCompanyInfo, {
      id: id
    }, 'POST').then (res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something goes wrong when requesting hot agent companies'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestSourceAnalysis (source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      resolve({
        code: -1,
        errMsg: 'parameters error'
      })
    }

    request2(API.PostAddUpTimesCode, {
      source: source
    }, 'POST').then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0
        })
      }
      else {
        throw 'Something goes wrong when requesting source analysis'
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

/**
 *  HOUSEMATE BLOCK
 */
function requestCreateHousemate (housemateInfo) {
  return new Promise((resolve, reject) => {
    let uploadHousemateInfo = JSON.parse((JSON.stringify(housemateInfo)));

    uploadHousemateInfo.userInfo.username
      = encodeURIComponent(uploadHousemateInfo.userInfo.username);
    uploadHousemateInfo.userInfo
      = JSON.stringify(uploadHousemateInfo.userInfo)

    uploadHousemateInfo.description
      = encodeURIComponent(uploadHousemateInfo.description)

    request2(API.CreateAHousemate, uploadHousemateInfo, 'POST')
    .then(res => {
      if (res.statusCode == 200 && (res.data.code == 0 || res.data.code == 1)) {
        resolve({
          code: res.data.code,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when creating a new housemate'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestHousemateWithFilter (prevPage, nextPage, filter) {
  return new Promise((resolve, reject) => {
    
    request2(API.SelectHousemateWith, {
      previous_page: prevPage,
      next_page: nextPage,
      ...filter
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting housemate list'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestHousematesByIds (housematesId) {
  return new Promise((resolve, reject) => {
    if (!housematesId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request2(API.GetHousemateByIds, {
      post_id: housematesId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting houses by ids'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestLikeOrUnLikeAHousemate (userId, housemateId) {
  return new Promise((resolve, reject) => {
    if (!userId || !housemateId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request2(API.LikedHousemate, {
      user_id: userId,
      post_id: housemateId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && (res.data.code == 0 || res.data.code == 1)) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requesting liking or unliking a housemate'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestHousemateByUnionid (unionid) {
  return new Promise((resolve, reject) => {
    if (!unionid) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request2(API.GetHousemateByUnionid, {
      wxUnionId: unionid
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting housemates by unionid'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestUpdateHousemate (housemateInfo) {
  return new Promise((resolve, reject) => {
    let uploadHousemateInfo = JSON.parse((JSON.stringify(housemateInfo)));

    uploadHousemateInfo.userInfo.username
      = encodeURIComponent(uploadHousemateInfo.userInfo.username);
    uploadHousemateInfo.userInfo
      = JSON.stringify(uploadHousemateInfo.userInfo)

    uploadHousemateInfo.description
      = encodeURIComponent(uploadHousemateInfo.description)
    // console.log(JSON.stringify(uploadHousemateInfo))
    request2(API.UpdateHousemate, {
      ...uploadHousemateInfo
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting updating housemates'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestChangeHousemateStatus (targetId, status) {
  return new Promise((resolve, reject) => {
    if (!targetId || !status) {
      resolve({
        code: -1,
        errMsg: 'paramaters error!'
      })
    }

    request2(API.ChangedHousemateStatus, {
      post_id: targetId,
      status: status
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requresting changing housemates status'
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

module.exports = {
  formatTime,

  wxGetCurrentLatlng,

  request,

  // Address
  // requestLocalityByQuery,
  // requestCurrentAddress,
  // requestAutocompleteAddress,

  // Message
  requestAllMessages,
  requestCertainMessages,
  requestDeleteMessages,
  requestSendingMsg,
  requestSetMessagesAsRead,

  // Verification
  requestVerifyingPhoneNumber,

  // Posting a house
  requestCreateAHouseId,
  requestDeleteAHouse,
  requestUpdateHouseInfo,

  // Request housing list
  requestHousingList,
  requestHousesByIds,
  requestHousesByUserId,

  requestAddingViewCount,
  requestLikeOrUnLikeAHouse,
  requestUsersById,
  requestRenewHouse,

  // Request following or unfollowing users
  requestUpdateFollowingUser,

  // Update locally
  updateWoowoUserLocally,
  // addNewViewHistory,
  // updateViewHistoryLocally,

  // Bing
  requestAutoSuggesteBing,
  requestSearchLocationBing,
  requestLocationByPointBing,

  // QRCode
  requestCreateQRCode,

  // News
  requestNews,

  // about user
  requestUpdateUserInfo,

  // about agents
  requestHotAgents,
  requestCompanyInfoById,

  // Housemate
  requestCreateHousemate,
  requestHousemateWithFilter,
  requestHousematesByIds,
  requestLikeOrUnLikeAHousemate,
  requestHousemateByUnionid,
  requestUpdateHousemate,
  requestChangeHousemateStatus,

  // Source analysis
  requestSourceAnalysis,
}
