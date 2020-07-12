const api = require('../services/api');
const AREAS = require('../utils/areas');

const GMPKey = 'AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls';

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

const formatDate = number => {
  const currentDate = new Date().getTime();
  const dateGap = currentDate - number;
  const oneDay = 24 * 3600 * 1000;
  const oneHour = 3600 * 1000;
  // const oneMin = 60 * 1000;

  if (dateGap > (14 * oneDay)) {
    return "2 weeks ago";
  }
  else if (dateGap > (7 * oneDay)) {
    return "1 week ago";
  }
  else if (dateGap > (1 * oneDay)) {
    if (dateGap > (2 * oneDay))
      return (Math.floor(dateGap / oneDay) + " days ago");
    else 
      return "1 day ago";
  }
  else if (dateGap > oneHour) {
    // console.log(currentDate / )
    if (dateGap > (2 * oneHour))
      return (Math.floor(dateGap / oneHour) + " hours ago");
    else 
      return "1 hour ago";
  }
  else if (dateGap < oneHour && dateGap > 10 * 60 * 1000) {
    // console.log(currentDate / )
    return (Math.floor(dateGap / (60 * 1000)) + " mins ago");
  }
  else {
    return "just now"
  }
}

const formatData = {
  goodsInfo: function (list) {
    let newList = [];
    for (let i = 0, len = list.length; i < len; i++) {
      let goods = {
        "sellerName": decodeURIComponent(list[i].seller_username),
        "sellerAvatarUrl": list[i].seller_image,
        "sellerWechatId": list[i].seller_wx_id,
        "sellerWechatQR": list[i].seller_wx_qr,
        "sellerUnionId": list[i].seller_wx_unionid,
        "sellerPhoneNumber": list[i].product_phone,
        "sellerId": list[i].seller_id,

        "goodsId": Number(list[i].product_id),
        "goodsTitle": list[i].product_title,
        "goodsPrice": Number(list[i].product_price),
        "goodsDes": list[i].product_des,
        "goodsArea": list[i].product_area,
        "goodsRegion": list[i].product_region,
        "goodsCondition": list[i].product_status,
        
        "goodsPicsUrl": list[i].product_image.split(';'),
        "goodsMainCat": list[i].product_kind_big,
        "goodsSubCat": list[i].product_kind_small,
        "goodsLikedAccount": Number(list[i].product_liked),
        "goodsView": Number(list[i].view),
        "goodsShipWays": list[i].product_ship.split(';'),

        "postDate": Number(list[i].upload_time),
        "status": list[i].status,

        "goodsSharedCount": Number(list[i].shareTimes)
      };

      // for shop
      if (list[i].shopId != '0') {
        goods.shopId = list[i].shopId;
        goods.shopDetail = JSON.parse(list[i].shopDetail);
      }

      newList.push(goods);
    }
    return newList;
  },

  userInfo: function (list) {
    let newList = [];
    for (let i = 0, len = list.length; i < len; ++i) {
      let user = {
        "userId": Number(list[i].user_id),
        "username": decodeURIComponent(list[i].username),
        "userAvatarUrl": list[i].user_image,
        "userUnionId": list[i].wx_unionid,
        "userWechatId": list[i].wx_id,
        "userWechatQR": list[i].wx_qr,
        "userEmail": list[i].email,
        "userPhoneNumber": list[i].phone,
        "userLikedGoods": list[i].liked,
        "userFollowingUser": list[i].like_user
      }
      newList.push(user);
    }

    return newList;
  },

  filter: function (previousePage, nextPage, filter, stateCn) {
    let formatedFilter = {
      previous_page: previousePage,
      next_page: nextPage
    };

    let stateEn = AREAS.statesCnToEn(stateCn);
    if (stateEn) {
      formatedFilter.product_region = stateEn;
    }

    if (filter.keyword) {
      formatedFilter.keyword = filter.keyword;
    }
    if (typeof(filter.mainCat) == 'string' && filter.mainCat) {
      formatedFilter.product_kind_big = filter.mainCat;
      // console.log(formatedFilter.product_kind_big + "-------------")
    }
    if (typeof(filter.subCat) == 'string' && filter.subCat && filter.subCat != '全部') {
      formatedFilter.product_kind_small = filter.subCat;
    }
    if (filter.priceSortWay) {
      switch (filter.priceSortWay) {
        case '价格':
          break;
        case '从低到高':
          formatedFilter.order_by_price = 'price_asc';
          break;
        case '从高到低':
          formatedFilter.order_by_price = 'price_desc';
          break;
      }
    }
    if (filter.areas && filter.areas.length != 0) {
      formatedFilter.product_area = "'" + filter.areas.join("','") + "'";
    }

    if (!isNaN(filter.lowestPrice)) {
      formatedFilter.price_low = filter.lowestPrice;
    }

    if (!isNaN(filter.highestPrice)) {
      formatedFilter.price_height = filter.highestPrice;
    }
    
    if (filter.conditionLevel && filter.conditionLevel.length != 0) {
      formatedFilter.product_status = "'" + filter.conditionLevel.join("','") + "'";
    }
    if (filter.shipWay && filter.shipWay.length != 0 && filter.shipWay.length != 2) {
      formatedFilter.product_ship = filter.shipWay[0];
    }
    if (filter.postDate) {
      let currentTimestamp = new Date().getTime();
      switch(filter.postDate) {
        case '最新':
          currentTimestamp -= 24 * 3600 * 1000;
          break;
        case '三天内':
          currentTimestamp -= 3 * 24 * 3600 * 1000;
          break;
        case '七天内':
          currentTimestamp -= 7 * 24 * 3600 * 1000;
          break;
        case '两周内':
          currentTimestamp -= 14 * 24 * 3600 * 1000;
          break;
        default:
          break;
      }

      formatedFilter.upload_time = currentTimestamp;
    }

    if (filter.sellerUnionId) {
      formatedFilter.seller_wx_unionid = filter.sellerUnionId
    }
  
    return formatedFilter;

  },

  sellGoodsInfo: function (goodsInfo, sellerInfo) {
    let app = getApp();

    let formatedGoodsInfo = {
      
      "upload_time": new Date().getTime(),
      "product_title": goodsInfo.title,
      "product_area": goodsInfo.area,
      "product_region": goodsInfo.region,
      "product_ship": goodsInfo.shipWay,
      "product_image": goodsInfo.imgsUrl,
      "product_price": Number(goodsInfo.price),
      "product_des": goodsInfo.brif,
      "product_phone": sellerInfo.phoneNumber,
      "product_status": goodsInfo.condition,
      
      "product_kind_big": goodsInfo.mainCat,
      "product_kind_small": goodsInfo.subCat,

      // "seller_wx_unionid": "test1",
      // "seller_image": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqV5WUGmX4PU3p4697a8TJKbhuuqGV1BlhF5Srqvp36m5S7RX4LekYh1GuaJz6rqDE2CsWc98yo9A/132",
      // "seller_username": "SHIBAO",
      "seller_wx_unionid": app.globalData.woowoUserInfo.wx_unionid,
      "seller_image": app.globalData.woowoUserInfo.user_image,
      "seller_username": encodeURIComponent(app.globalData.woowoUserInfo.username),
      "seller_id": Number(app.globalData.woowoUserInfo.user_id),

      "seller_wx_qr": sellerInfo.wechatQRCodeUrl,
      "seller_wx_id": sellerInfo.wechatId
    };
    
    
    return formatedGoodsInfo;
  }
}
function paramObjToStr (obj) {
  let paramStr = '';
  
  for (let key in obj) {
    paramStr = paramStr + key + '=' + obj[key] + '&';
  }
  // paramStr.length--;
  paramStr = paramStr.slice(0, paramStr.lastIndexOf('&'));
  // console.log(paramStr)
  return paramStr;
}

function paramStrToObj (str) {

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
        'Content-Type': 'application.json'
      },
      success: function(res){
        // console.log("request successd");
        resolve(res);
      },
      fail: function(err) {
        reject(err);
        // console.log("request falied");
      },
      complete: function() {
        // complete
      }
    })
  })
}

function getLocation () {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        // success
        resolve(res);
      },
      fail: function(err) {
        // fail
        console.log(err)
        reject('定位失败');
      },
      complete: function() {
        // complete
      }
    })
  }) 
}

function triggerOnModal (that, transactionType, transactionId, otherInfo) {
  // let that = this;
  let data = that.data.modalInfo;

  data.ifShowModal = true;
  data.transactionType = transactionType;
  data.transactionId = transactionId;
  data.tipsTxt = otherInfo.tipsTxt;
  data.confirmTxt = otherInfo.confirmTxt;
  data.cancelTxt = otherInfo.cancelTxt;

  that.setData({
    modalInfo: data,
    ifShowModal: true
  });
}

function triggerOffModal (that) {
  // let that = this;

  that.setData({
    ifShowModal: false
  });
}

function requestSellerAllGoods (sellerUnionId) {
  return new Promise((resolve, reject) => {
    if (!sellerUnionId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    // let filter = {
    //   sellerUnionId: sellerUnionId
    // }

    // let formatedFilter = formatData.filter(0, 6, filter);
    
    request(api.GetSellerAllProduct, {
      seller_wx_unionid: sellerUnionId
    }, 'POST')
    .then(res => {
      console.log(res)
      if (res.data.code == 0) {
        resolve({
          code: 0,
          data: formatData.goodsInfo(res.data.data)
        });
      }
      else {
        throw new Error('Something wrong, when request other goods list');
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

function requestChangeGoodsStatus (goodsId, userId, status) {
  return new Promise((resolve, reject) => {
    request(api.ChangeProductStatus, {
      'product_id': goodsId,
      'user_id': userId,
      'status': status,
      'upload_time': new Date().getTime()
    }, 'POST')
    .then(res => {
      if (res.data.code != 0) {
        throw new Error('Something wrong, when request changing the status of goods')
      }
      resolve({code: 0});
    })
    .catch(err => {
      console.log(err);
      reject({code: 1});
    })
  })
}

function requestSwitchLikeGoods (userId, goodsId) {
  return new Promise((resolve, reject) => {
    request(api.LikeProduct1, {
      'product_id': goodsId,
      'user_id': userId
    }, 'POST')
    .then(res => {
      console.log(res);
      return new Promise((processResolve, processReject) => {
        if (res.data.code == "0") {
          processResolve('like')
        }
        else if (res.data.code == '1') {
          processResolve('dislike')
        }
        else {
          processReject(new Error('Something wrong when request switch like first time'))
        }
      })
    })
    .then(status => {
      console.log(status);
      request(api.LikeProduct2, {
        'product_id': goodsId,
        'check': status
      }, 'POST')
      .then(res => {
        if (res.data.code != 0) {
          throw new Error('Something wrong when request like goods on step 2')
        }
        resolve({
          code: 0,
          status: status
        })
      })
    })
    .catch(err => {
      console.log('Something wrong when request like goods');
      console.log(err);
      reject(err)
    })
  })
}

function requestSwitchFollowUser (userId, sellerId) {
  return new Promise((resolve, reject) => {
    request(api.FollowSeller, {
      'user_id': userId,
      'seller_id': sellerId
    }, 'POST')
    .then(res => {
      if (res.data.code != 0 && res.data.code != 1) {
        throw new Error('Something wrong when request switch follow user');
      }

      resolve({code: 0});
    })
    .catch(err => {
      console.log(err);
      reject(err);
    })
  })
}

function requestHottestGoods (previousPage, nextPage) {
  return new Promise((resolve, reject) => {  
    const app = getApp();

    let params = {
      'previous_page': previousPage,
      'next_page': nextPage
    }

    let stateEn = AREAS.statesCnToEn(app.globalData.state)
    if (stateEn != '') {
      params.product_region = stateEn;
    }

    request(api.GetHottestProduct, params, 'POST')
    .then(res => {
      if (res.data.code != 0) {
        throw new Error('Something wrong when request hottest goods')
      }

      let formatedList = formatData.goodsInfo(res.data.data)
      // console.log(res)
      resolve({
        code: 0,
        data: formatedList
      });
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestAllLikedGoods (likedGoodsList) {
  return new Promise((resolve, reject) => {
    if (likedGoodsList[likedGoodsList.length-1] == ',') {
      likedGoodsList = likedGoodsList.substring(0, likedGoodsList.length-1)
    }
    request(api.GetCertainProduct, {
      'product_id': likedGoodsList
    }, 'POST')
    .then(res => {
      if (res.data.code != 0) {
        throw new Error('Somthing wrong when request all liked goods')
      }

      let formatedList = formatData.goodsInfo(res.data.data);

      resolve({
        code: 0,
        data: formatedList
      });
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestAllFollowingUser (userList) {
  return new Promise((resolve, reject) => {
    if (userList[userList.length-1] == ',') {
      userList = userList.substring(0, userList.length-1);
    }

    request(api.GetCertainUsers, {
      'user_id': userList
    }, 'POST')
    .then(res => {
      if(res.data.code != 0) {
        throw new Error('Somthing wrong when request following user list')
      }

      let formatedList = formatData.userInfo(res.data.data);
      resolve({
        code: 0,
        data: formatedList
      });

    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function checkIfLikedGoods (goodsId) {
  let app = getApp();
    
  let goodsList = app.globalData.woowoUserInfo.liked.split(',');
  
  for (let i = 0, len = goodsList.length; i < len; ++i) {
    if (goodsId == Number(goodsList[i])) {
      return true
    }
  }

  return false
}

function checkIfOwnGoods (userId) {
  let app = getApp();
  
  return userId == Number(app.globalData.woowoUserInfo.user_id)
}

function checkIfFollowingUser (userId) {
  let app = getApp();

  let followingList = app.globalData.woowoUserInfo.like_user.split(',');

  for (let i = 0, len = followingList.length; i < len; ++i) {
    if (userId == Number(followingList[i])) {
      return true
    }
  }

  return false
}

function checkIfFollowingShop (shopId) {
  let app = getApp();

  let shopsLs = app.globalData.woowoUserInfo.like_shop;

  for (let i = 0, len = shopsLs.length; i < len; ++i) {
    if (shopsLs[i] == shopId) {
      return true;
    }
  }

  return false;
}

function updateLikedGoodsLocally (goodsId, ifLikedGoods) {
  let app = getApp();

  let liked = app.globalData.woowoUserInfo.liked;
  if (liked[liked.length - 1] == ',') liked = liked.substring(0, liked.length-1);
  let newLiked = liked == "" ? [] : liked.split(',')

  let goodsIndex = -1;
  if (ifLikedGoods) {
    newLiked.push(goodsId);
    app.globalData.woowoUserInfo.liked = newLiked.join(',')
  }
  else {
    for (let i = 0, len = newLiked.length; i < len; ++i) {
      if (goodsId == Number(newLiked[i])) {
        goodsIndex = i;
        break;
      }
    }
    if (goodsIndex > -1) newLiked.splice(goodsIndex, 1);

    app.globalData.woowoUserInfo.liked = newLiked.join(',')
  }
}

function updateLikedShopsLocally (shopId, ifLikedShop) {
  let app = getApp();
  let shopsLs = app.globalData.woowoUserInfo.like_shop;

  if (ifLikedShop) {
    shopsLs.push(shopId);
  }
  else {
    let index = shopsLs.findIndex((el) => {
      return el == shopId
    })

    shopsLs.splice(index, 1);
  }
}

function updateUserInfoLocally (userInfo) {
  let app = getApp();
  let newUserInfo = userInfo;
  newUserInfo.username = decodeURIComponent(newUserInfo.username);
  app.globalData.woowoUserInfo = userInfo;
  
}

function updateFollowingUserLocally (userId, ifFollowing) {
  let app = getApp();

  let following = app.globalData.woowoUserInfo.like_user;
  following = following.replace(/(^\s*)|(\s*$)/g, "");
  if (following[following.length - 1] == ',') following = following.substring(0, following.length-1);
  if (following[0] == ',') following = following.substring(1, following.length-1)
  let newFollowing = following == "" ?  [] : following.split(',')
 
  let userIndex = -1;
  if (ifFollowing) {
    newFollowing.push(userId);
    app.globalData.woowoUserInfo.like_user = newFollowing.join(',')
  }
  else {
    for (let i = 0, len = newFollowing.length; i < len; ++i) {
      if (userId == Number(newFollowing[i])) {
        userIndex = i;
        break;
      }
    }
    if (userIndex > -1) newFollowing.splice(userIndex, 1);

    app.globalData.woowoUserInfo.like_user = newFollowing.join(',')
  }
}

function updateShelfStatusLocally (previousStatus, currentStatus) {
  let app = getApp();

  let woowoUserInfo = app.globalData.woowoUserInfo;
  if (currentStatus == 'check' || currentStatus == 'confirm') {
    woowoUserInfo.user_stuffs = (Number(woowoUserInfo.user_stuffs) + 1).toString();
  }
  else if (previousStatus == 'check' || previousStatus == 'confirm') {
    woowoUserInfo.user_stuffs = (Number(woowoUserInfo.user_stuffs) - 1).toString();
  }

  app.globalData.woowoUserInfo = woowoUserInfo;
  wx.setStorage({
    key: 'woowoUserInfo',
    data: woowoUserInfo,
    success: () => {
      console.log('Update woowoUserInfo succeed!')
    }
  })
}

function requestGetAllNotifications (userId) {
  return new Promise((resolve, reject) => {
    request(api.GetAllNotifications, {
      'user_id': Number(userId)
    }, 'POST')
    .then(res => {
      if (typeof(res.data.code) == 'undefined') {
        throw new Error('Something wrong, when request all notifications')
      }
      resolve(res.data);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    })
  })
}

function requestReadAllNotifications (userId) {
  return new Promise((resolve, reject) => {
    request(api.ReadAllNotifications, {
      'user_id': Number(userId)
    }, 'POST')
    .then(res => {
      if (typeof(res.data.code) == 'undefined') {
        throw new Error('Something wrong, when request read all notifications')
      }
      resolve(res.data);
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

function requsetReportGoods (type, goodsId, content) {
  return new Promise((resolve, reject) => {
    request(api.ReportProduct, {
      'type': type,
      'words': content,
      'product_id': goodsId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0
        })
      }
      else {
        resolve({
          code: -1,
          errMsg: 'Somthing wrong, when request report goods'
        })
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

function getCurrentLocation () {
  return new Promise((resolve, reject) => {

    // First step: ask location authority
    let process = new Promise((proRes, proRej) => {
      wx.authorize({
        scope: 'scope.userLocation',
        success: () => {
          wx.getLocation({
            type: 'wgs84',
            success: (res) => {
              console.log(res.latitude)
              proRes(res);
            },
            fail: (err) => {
              resolve({
                code: -1,
                errMsg: '没有打开定位权限'
              })
              return ;
            }
          })
        },
        fail: () => {
          resolve({
            code: -1,
            errMsg: '没有打开定位权限'
          })
          return ;
        }
      })
      
    });

    // request for rever geocoding
    process.then((res) => {
      const option = paramObjToStr({
        latlng: res.latitude + ',' + res.longitude,
        // latlng: '-37.825900, 145.066888',
        // result_type: 'postal_code',
        // location_type: 'GEOMETRIC_CENTER',
        // key: GMPKey
      });
      console.log(option)
      return new Promise((proRes, proRej) => {
        request(api.WrappedBingReverGeocoding + '?' + option)
        .then(res => {
          console.log(res);
          if (res.data.statusDescription != 'OK') {
            resolve({
              code: -2,
              errMsg: '无相关地址'
            })
            return;
          }
          // let formattedAddress = res.data.results[0].formatted_address;

          // let addresses = formattedAddress.split(',');
          // let areaAndPostcode = addresses[0].split(' ');

          // let country = addresses[1].replace(/\s/g,'');
          // let postcode = areaAndPostcode[areaAndPostcode.length - 1];
          // let region = areaAndPostcode[areaAndPostcode.length - 2];

          // let area = areaAndPostcode.splice(0, areaAndPostcode.length-2).join(' ');

          // let postcodeLocalities = res.data.results[0].postcode_localities ? res.data.results[0].postcode_localities : [area]

          let addressBing = res.data.resourceSets[0].resources[0].address;
          let countryBing = addressBing.countryRegion;
          let postcodeBing = addressBing.postalCode;
          let regionBing = addressBing.adminDistrict;
          let areaBing = addressBing.locality;

          proRes({
            country: countryBing,
            postcode: Number(postcodeBing),
            region: regionBing,
            area: areaBing
          })
          // proRes({
          //   country: country,
          //   postcode: Number(postcode),
          //   region: region,
          //   area: area,
          //   postcodeLocalities: postcodeLocalities 
          // })
        })
      })
    })

    // search on our dataset
    .then(res => {
      if (res.country.toUpperCase () != 'AUSTRALIA') {
        resolve({
          code: -3,
          errMsg: '只支持澳洲地址'
        })
        return ;
      }

      let region = '';
      let area = '';

      // if (3000 <= res.postcode && res.postcode < 4000) {
      //   for (let i = 0, len = res.postcodeLocalities.length; i < len; ++i) {
      //     let regexStr = new RegExp('(^|,)' + res.postcodeLocalities[i] + '(,|$)', 'g')
 
      //     if (AREAS.VIC.areas.match(regexStr)) {
      //       region = 'Victoria';
      //       area = res.postcodeLocalities[i];
      //       break;
      //     }
      //   }
      // }
      // else if (2000 <= res.postcode && res.postcode< 2600) {
      //   for (let i = 0, len = res.postcodeLocalities.length; i < len; ++i) {
      //     let regexStr = new RegExp('(^|,)' + res.postcodeLocalities[i] + '(,|$)', 'g')
          
      //     if (AREAS.NSW.areas.match(regexStr)) {
      //       region = 'New South Wales';
      //       area = res.postcodeLocalities[i];
      //       break;
      //     }
      //   }
      // }
      if (3000 <= res.postcode && res.postcode < 4000) {
        region = 'Victoria';
        area = res.area;
      }
      else if (2000 <= res.postcode && res.postcode< 2600) {
        region = 'New South Wales';
        area = res.area;
      }
      else if (res.postcode == 2600) {
        region = 'Canberra',
        area = 'Canberra'
      }
      else if (res.postcode == 4000) {
        region = 'Queensland',
        area = 'Brisbane'
      }
      else if (res.postcode == 5000) {
        region = 'Queensland',
        area = 'Brisbane'
      }
      else if (res.postcode == 6000) {
        region = 'Queensland',
        area = 'Brisbane'
      }
      else if (res.postcode == 7000) {
        region = 'Queensland',
        area = 'Brisbane'
      }
      else if (res.postcode == 8000) {
        region = 'Queensland',
        area = 'Brisbane'
      }
      else {
        region = 'Others',
        area = 'Others'
      }

      resolve({
        code: 0,
        data: {
          region: region,
          area: area
        }
      })
    })
    .catch(() => {
      resolve({
        code: -3,
        errMsg: '暂不支持此地址'
      })
    })
  })
}

function requestQRCodeBase64 (goodsId) {
  return new Promise((resolve, reject) => {
    console.log({
      scene: goodsId.toString(),
      is_hyaline: true
    })
    request(api.GetQRCodeBase64, {
      scene: goodsId.toString(),
      // page: 'page/goodDetail/goodDetail',
      is_hyaline: true
    }, 'POST')
    .then(res => {
      console.log(res)
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve(res.data);
      }
      else {
        resolve({
          code: -1,
          errMsg: 'Something wrong when request QRCode base64'
        }) 
      }
    })
    .catch(err => {
      console.log(err);
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestQRCodeUrl (goodsId) {
  return new Promise((resolve, reject) => {
    console.log({
      scene: goodsId.toString(),
      page: 'pages/goodsDetail/goodsDetail',
      is_hyaline: true
    })
    request(api.GetQRCodeBase64, {
      scene: goodsId.toString(),
      // page: 'pages/goodsDetail/goodsDetail',
      // is_hyaline: true
    }, 'POST')
    .then(res => {
      console.log(res);
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve(res.data);
      }
      else {
        resolve({
          code: -1,
          errMsg: 'Something wrong when request QRCode base64'
        }) 
      }
    })
    .catch(err => {
      console.log(err);
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

function requestFilteredGoods (filter) {
  return new Promise((resolve, reject) => {
    request(api.GetFilteredProduct, filter, 'POST')
    .then(res => {
      console.log(res + "----")
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: formatData.goodsInfo(res.data.data)
        })
      }
      else {
        throw 'Something wrong when requrest filtered goods'
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

function requestUpdateUserInfo (userInfo) {
  return new Promise((resolve, reject) => {
    request(api.UpdateUser, userInfo, 'POST')
    .then(res => {
      console.log(res);
      if (res.statusCode == 200 && res.data.code == 0) {
        // shopInfo
        res.data.data.shopInfo = res.data.shopInfo;
        
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw 'Something wrong when requrest update user information'
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

function requestValidatePhoneNumber (phoneNumber) {
  return new Promise((resolve, reject) => {
    request(api.ValidatePhoneNumber, {'phone': phoneNumber}, 'POST')
    .then(res => {
      console.log(res);
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

function requestPromoteGood (goodId, userId) {
  return new Promise((resolve, reject) => {
    request(api.LetProductTop, {
      product_id: goodId,
      user_id: userId,
      upload_time: new Date().getTime()
    }, 'POST')
    .then(res => {
      console.log(res);
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0
        })
      }
      else {
        throw 'Something wrong when requrest update user information'
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

function uploadFormId(data) {
  return new Promise((resolve, reject) => {
    request(api.CollectFormId, {
      'openId': data.openId,
      'formId': data.formIds[0].formId,
      'dateTime': data.formIds[0].date.toString()
    }, 'POST')
    .then(res => {
      console.log(res);
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0
        })
      }
      else {
        throw 'Something wrong when requrest uploadFormId'
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

// new from Bleve
function requestViewCountAddUp(productId) {
  return new Promise((resolve, reject) => {
    request(api.ViewCountAddUp, {
      'product_id': productId
      }, 'POST')
      .then(res => {
        console.log(res);
        if (res.statusCode == 200 && res.data.code == 0) {
        }
        else {
          throw 'Something wrong when requrest update user information'
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

function requestCheckStuffsLimitation (userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      resolve({
        code: -1,
        errMsg: 'Parameters errors'
      })
    }

    request(api.CheckStuffsLimitation, {
      user_id: userId
    }, 'POST')
    .then(res => {
      if (res.statusCode == 200) {
        resolve(res.data);
      }
      else {
        resolve({
          code: -1,
          errMsg: 'Something wrong when requesting for checking limitation'
        })
      }
    })
    .catch(err => {
      resolve({
        code: -1,
        errMsg: 'Something wrong when requesting for checking limitation'
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

function requestLocationByPointBing (point, entityType) {
  return new Promise((resolve, reject) => {
    if (!point || !entityType) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(api.BingLocationByPoint, {
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

function requestAutoSuggesteBing (query, entityType) {
  return new Promise((resolve, reject) => {
    if (!query || !entityType) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(api.BingSearch, {
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

/**
 *  For shop
 */
function requestUpdateShopInfo (unionId, shopInfo) {
  return new Promise((resolve, reject) => {
    if (!unionId || !shopInfo) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(api.ShopInfoUpdate, {
      wxUnionId: unionId,
      name: encodeURIComponent(shopInfo.name),
      description: encodeURIComponent(shopInfo.description),
      image: shopInfo.image,
      bgImage: shopInfo.bgImage ? shopInfo.bgImage : ''
    }).then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw Error();
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request update shopInfo error!'
      })
    })
  })
}

function requestShopList (pre_page, nxt_page, keyword, kind) {
  return new Promise((resolve, reject) => {
    let params = {
      previous_page: pre_page,
      next_page: nxt_page
    }

    if (typeof(keyword) == 'string' && keyword.length > 0) {
      params.keyword = keyword;
    }
    if (kind) {
      params.kind = kind;
    }

    request(api.FetchShop, {...params}).then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw Error();
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request when requesting shops list'
      })
    })
  })
}

function requestShopNewestGoods (pre_page, nxt_page, shopId) {
  return new Promise((resolve, reject) => {
    if (!shopId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(api.SelectShopProduct, {
      previous_page: pre_page,
      next_page: nxt_page,
      shopId: shopId
    }).then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw Error();
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request when requesting shops newest products'
      })
    })
  })
}

function requestSwitchFollowShops (shopId, user_unionId) {
  return new Promise((resolve, reject) => {
    if (!shopId || !user_unionId) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(api.FollowShops, {
      shopId: shopId,
      user_unionId: user_unionId
    }).then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw Error();
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request when requesting switching following shops'
      })
    })
  })
}

function requestLikedShopsList (shopIds) {
  return new Promise((resolve, reject) => {
    if (!shopIds) {
      resolve({
        code: -1,
        errMsg: 'parameters error!'
      })
    }

    request(api.FetchUserLikedShop, {
      shopIds: shopIds
    }).then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: res.data.data
        })
      }
      else {
        throw Error();
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: 'Request when requesting shop list by ids'
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

    request(api.PostAddUpTimesCode, {
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

function requestAllPopularGoods () {
  return new Promise((resolve, reject) => {
    request(api.GetAllPopularProduct, {}, 'GET')
    .then(res => {
      if (res.statusCode == 200 && res.data.code == 0) {
        resolve({
          code: 0,
          data: formatData.goodsInfo(res.data.data)
        })
      }
      else {
        throw 'Something goes wrong when requesting all popular goods'
      }
    }).catch(err => {
      resolve({
        code: -1,
        errMsg: err
      })
    })
  })
}

module.exports = {
  formatTime,
  request,
  getLocation,
  paramObjToStr,
  paramStrToObj,
  GMPKey,
  triggerOnModal,
  triggerOffModal,
  formatData,
  formatDate,

  requestFilteredGoods,
  requestSellerAllGoods,
  requestChangeGoodsStatus,
  requestSwitchLikeGoods,
  requestHottestGoods,
  requestAllFollowingUser,
  requestSwitchFollowUser,

  requestAllLikedGoods,

  checkIfLikedGoods,
  updateLikedGoodsLocally,
  checkIfFollowingUser,
  checkIfOwnGoods,
  updateFollowingUserLocally,
  updateShelfStatusLocally,
  updateUserInfoLocally,

  requestGetAllNotifications,
  requestReadAllNotifications,

  getCurrentLocation,
  requsetReportGoods,
  requestPromoteGood,
  
  requestQRCodeBase64,
  requestQRCodeUrl,

  requestValidatePhoneNumber,
  requestUpdateUserInfo,

  uploadFormId,

  requestCheckStuffsLimitation,

  wxGetCurrentLatlng,
  requestLocationByPointBing,
  requestAutoSuggesteBing,

  // Shop
  requestUpdateShopInfo,
  requestShopList,
  requestShopNewestGoods,
  checkIfFollowingShop,
  updateLikedShopsLocally,
  requestSwitchFollowShops,
  requestLikedShopsList,

  // Data analysis
  requestSourceAnalysis,

  requestAllPopularGoods
}
