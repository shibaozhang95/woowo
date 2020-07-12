const util = require('../../utils/util');
const api = require('../../services/api');
const qiniuUploader = require('../../utils/qiniuUploader');

const app = getApp();

const MAIN_CAT = ["二手书籍", "家具电器", "3C数码", "动植物", "服饰搭配", "护肤美妆", "生活用品", "二手车", "生活服务", "闲品互换", "其他"]

Page({
  data: {
    titleWords: 0,
    titleWordsLimit: 12,
    imagesLimit: 4,
    brifWords: 0,
    images: [],
    // {
    //   "tempFilePath": String,
    //   "uplodedFilePath": String,
    //   "process": Number,
    //   "ifDone": Boolean
    // }
    conditionLevel: ["全新", "几乎全新", "成色较新", "成色一般", "成色旧"],
    conditionValue: -1,
    catalogies: [
      MAIN_CAT
      , ["金融类", "医护类", "IT类", "教育类", "法律类", "艺术类", "工科类", "漫画", "小说", "其他"]
    ],
    catalogyValue: [-1, -1],
    ifSelfTake: false,
    ifDelivery: false,
    price: Number,

    goodsInfo: {
      title: "",
      brif: "",
      imgsUrl: "",
      condition: "",
      mainCat: "",
      subCat: "",
      shipWay: "",
      price: 0
    },
    editMode: false,
    editData: []
  },

  onLoad: function (option){
    // edit product(update info of product)
    let that = this
    if (option.kind == 'edit'){
      that.setData({
        'editMode': true
      })
      //that.data.editMode = true;
      that.requestGoodsDetail(option.productId)
      .then(res => {
        
        // condition level edit
        switch (res[0].product_status){
          case '全新':
            that.setData({
              conditionValue: 0
            })
          break;
          case '几乎全新':
            that.setData({
              conditionValue: 1
            })
          break;
          case '成色较新':
            that.setData({
              conditionValue: 2
            })
          break;
          case '成色一般':
            that.setData({
              conditionValue: 3
            })
          break;
          case '成色旧':
            that.setData({
              conditionValue: 4
            })
          break;
        }
        let tempCategories = [];
        // categories
        switch (res[0].product_kind_big) {
          case "二手书籍":
            tempCategories.push(0)
           
            switch (res[0].product_kind_small){
              case "金融类":
                tempCategories.push(0)              
              break;
              case "医护类":
                tempCategories.push(1)
                break;
              case "IT类":
                tempCategories.push(2)
                break;
              case "教育类":
                tempCategories.push(3)
                break;
              case "法律类":
                tempCategories.push(4)
                break;
              case "艺术类":
                tempCategories.push(5)
                break;
              case "工科类":
                tempCategories.push(6)
                break;
              case "漫画":
                tempCategories.push(7)
                break;
              case "小说":
                tempCategories.push(8)
                break;
              case "其他":
                tempCategories.push(9)
              break;
            }
            break;
          case "家具电器":
            tempCategories.push(1)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["沙发", "柜子", "床", "桌椅板凳", "灯具照明", "电视", "洗衣机", "冰箱", "厨房电器", "其他家居家具", "其他家具电器"]]
            })
            switch (res[0].product_kind_small) {
              case "沙发":
                tempCategories.push(0)
                break;
              case "柜子":
                tempCategories.push(1)
                break;
              case "床":
                tempCategories.push(2)
                break;
              case "桌椅板凳":
                tempCategories.push(3)
                break;
              case "灯具照明":
                tempCategories.push(4)
                break;
              case "电视":
                tempCategories.push(5)
                break;
              case "洗衣机":
                tempCategories.push(6)
                break;
              case "冰箱":
                tempCategories.push(7)
                break;
              case "厨房电器":
                tempCategories.push(8)
                break;
              case "其他家居家具":
                tempCategories.push(9)
                break;
              case "其他家具电器":
                tempCategories.push(10)
                break;
            }
            break;
          case "3C数码":
            tempCategories.push(2)
            
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["手机", "电脑", "相机", "游戏机", "手机配件", "电脑配件", "相机镜头/配件", "游戏碟/游戏机配件", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "手机":
                tempCategories.push(0)
                break;
              case "电脑":
                tempCategories.push(1)
                break;
              case "相机":
                tempCategories.push(2)
                break;
              case "游戏机":
                tempCategories.push(3)
                break;
              case "手机配件":
                tempCategories.push(4)
                break;
              case "电脑配件":
                tempCategories.push(5)
                break;
              case "相机镜头/配件":
                tempCategories.push(6)
                break;
              case "游戏碟/游戏机配件":
                tempCategories.push(7)
                break;
              case "其他":
                tempCategories.push(8)
                break;
            }
            break;
          case "动植物":
            tempCategories.push(3)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["植物", "猫咪", "狗狗", "兔子", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "植物":
                tempCategories.push(0)
                break;
              case "猫咪":
                tempCategories.push(1)
                break;
              case "相机":
                tempCategories.push(2)
                break;
              case "狗狗":
                tempCategories.push(3)
                break;
              case "兔子":
                tempCategories.push(4)
                break;
              case "其他":
                tempCategories.push(5)
                break;
            }
            break;
          case "服饰搭配":
            tempCategories.push(4)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["服装", "包包", "鞋子", "饰品", "服饰配件", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "服装":
                tempCategories.push(0)
                break;
              case "包包":
                tempCategories.push(1)
                break;
              case "鞋子":
                tempCategories.push(2)
                break;
              case "饰品":
                tempCategories.push(3)
                break;
              case "服饰配件":
                tempCategories.push(4)
                break;
              case "其他":
                tempCategories.push(5)
                break;
            }
            break;
          case "护肤美妆":
            tempCategories.push(5)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["洁面", "防晒", "护肤", "唇部", "彩妆", "香水", "口服", "指甲彩妆", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "洁面":
                tempCategories.push(0)
                break;
              case "防晒":
                tempCategories.push(1)
                break;
              case "鞋子":
                tempCategories.push(2)
                break;
              case "护肤":
                tempCategories.push(3)
                break;
              case "唇部":
                tempCategories.push(4)
                break;
              case "彩妆":
                tempCategories.push(5)
                break;
              case "香水":
                tempCategories.push(6)
                break;
              case "口服":
                tempCategories.push(7)
                break;
              case "指甲彩妆":
                tempCategories.push(8)
                break;
              case "其他":
                tempCategories.push(9)
                break;
            }
            break;
          case "生活用品":
            tempCategories.push(6)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["厨具", "办公用品", "保健护理", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "厨具":
                tempCategories.push(0)
                break;
              case "办公用品":
                tempCategories.push(1)
                break;
              case "鞋子":
                tempCategories.push(2)
                break;
              case "保健护理":
                tempCategories.push(3)
                break;
              case "其他":
                tempCategories.push(4)
                break;
            }
            break;
          case "二手车":
            tempCategories.push(7)
            that.setData({
              catalogies: [
                MAIN_CAT
                ,["汽车", "自行车", "电动车", "摩托车", "车配件", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "汽车":
                tempCategories.push(0)
                break;
              case "自行车":
                tempCategories.push(1)
                break;
              case "电动车":
                tempCategories.push(2)
                break;
              case "摩托车":
                tempCategories.push(3)
                break;
              case "车配件":
                tempCategories.push(4)
                break;
              case "其他":
                tempCategories.push(5)
                break;
            }
            break;
          case "生活服务":
            tempCategories.push(8)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["搬家", "清洁", "娱乐", "接送", "美容", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "搬家":
                tempCategories.push(0)
                break;
              case "清洁":
                tempCategories.push(1)
                break;
              case "娱乐":
                tempCategories.push(2)
                break;
              case "接送":
                tempCategories.push(3)
                break;
              case "美容":
                tempCategories.push(4)
                break;
              case "其他":
                tempCategories.push(5)
                break;
            }
            break;
          case "闲品互换":
            tempCategories.push(9)
            tempCategories.push(0)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["小玩具置换", "其他"]]
            })
            switch (res[0].product_kind_small) {
              case "小玩具置换":
                tempCategories.push(0);
                break;
              case "其他":
                tempCategories.push(1);
                break;
            }
            break;
          case "其他":
            tempCategories.push(10)
            tempCategories.push(0)
            that.setData({
              catalogies: [
                MAIN_CAT
                , ["其他"]]
            })
            break;
        }
        // console.log(tempCategories)
        if (res[0].product_ship.includes("自取")){
          that.setData({
            ifSelfTake: true
          })
        }
        if (res[0].product_ship.includes("邮寄")) {
          that.setData({
            ifDelivery: true
          })
        }
        var tempImagesAll = [];
        var tempImages = res[0].product_image.split(';');
        for (var i = 0; i < tempImages.length; i++){
          tempImagesAll.push({
            "tempFilePath": tempImages[i],
            "uploadedFilePath": tempImages[i],
            "process": 100,
            "ifDone": true
          })
        }
        that.setData({
          editData: res,
          ['goodsInfo.title']: res[0].product_title,
          titleWords: res[0].product_title.length,
          ['goodsInfo.brif']: res[0].product_des,
          brifWords: res[0].product_des.length,
          catalogyValue: tempCategories,
          ['goodsInfo.price']: res[0].product_price,
          images: tempImagesAll
        })
        // that.bigCatChange(tempCategories);
        // console.log(that.data.images)
      })
    }
  },

  onShow: function () {

    // set navigation bar
    wx.setNavigationBarTitle({
      title: "发布二手"
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  checkGoodsTitleWords: function (event) {
    let that = this;

    let title = event.detail.value.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    
    let len = title.length;
    if (len > 12) title = title.slice(0, 12);

    that.setData({
      titleWords: title.length,
      ['goodsInfo.title']: title
    })
  },
  checkGoodsBrif: function (event) {
    let that = this;

    that.setData({
      ['goodsInfo.brif']: event.detail.value.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '')
    })
  },

  conditionLevelChange: function (event) {
    let that = this;
    that.setData({
      conditionValue: event.detail.value
    })
  },

  catalogiesChange: function (event) {
    let that = this;

    that.setData({
      catalogyValue: event.detail.value
    })
  },
  
  bigCatChange: function (event) {
    // if just change sub cat, do nothing
    console.log(event)
    if (event.detail.column == 1) return;

    let that = this;
    let data = {
      catalogies: that.data.catalogies,
      catalogyValue: that.data.catalogyValue
    };

    // every time change main cat, set sub cat as the first one
    data.catalogyValue[0] = event.detail.value;
    data.catalogyValue[1] = 0;
    console.log(data.catalogyValue)
    let mainCatName = data.catalogies[0][event.detail.value];

    switch (mainCatName) {
      case "二手书籍":
        data.catalogies[1] = ["金融类", "医护类", "IT类", "教育类", "法律类", "艺术类", "工科类", "漫画", "小说", "其他"];
        break;
      case "家具电器":
        data.catalogies[1] = ["沙发", "柜子", "床", "桌椅板凳", "灯具照明", "电视", "洗衣机", "冰箱", "厨房电器", "其他家居家具", "其他家具电器"];
        break;
      case "3C数码":
        data.catalogies[1] = ["手机", "电脑", "相机", "游戏机", "手机配件", "电脑配件", "相机镜头/配件", "游戏碟/游戏机配件", "其他"];
        break;
      case "服饰搭配":
        data.catalogies[1] = ["服装", "包包", "鞋子", "饰品", "服饰配件", "其他"];
        break;
      case "护肤美妆":
        data.catalogies[1] = ["洁面", "防晒", "护肤", "唇部", "彩妆", "香水", "口服", "指甲彩妆", "其他"];
        break;
      case "生活用品":
        data.catalogies[1] = ["厨具", "办公用品", "保健护理", "其他"];
        break;
      case "二手车":
        data.catalogies[1] = ["汽车", "自行车", "电动车", "摩托车", "车配件", "其他"];
        break;
      case "动植物":
        data.catalogies[1] = ["植物", "猫咪", "狗狗", "兔子", "其他"];
        break;
      case "生活服务":
        data.catalogies[1] = ["搬家", "清洁", "娱乐", "接送", "美容", "其他"];
        break;
      case "闲品互换":
        data.catalogies[1] = ["小玩具置换", "其他"]
        break;
      case "其他":
        data.catalogies[1] = ["其他"];
        break;
    }

    that.setData(data);
  },

  takePhoto: function () {
    let that = this;
    wx.chooseImage({
      count: that.data.imagesLimit - that.data.images.length,
      success: (res) => {
        let images = that.data.images;
        let previousLen = images.length;

        for (let i = 0, len = res.tempFilePaths.length; i < len; ++i) {
          images.push({
            "tempFilePath": res.tempFilePaths[i],
            "uploadedFilePath": "",
            "process": 0,
            "ifDone": false
          })
        }

        that.setData({
          ['images']: images
        })

        for (let i = previousLen, len = images.length; i < len; ++i) {
          (function (index) {
            qiniuUploader.upload(images[index].tempFilePath, (res) => {
        
              that.setData({
                ['images[' + index + '].uploadedFilePath']: 'https://' + res.imageURL,
                ['images[' + index + '].ifDone']: true,
              });
            }, (error) => {
              console.log('error: ' + error);
            }, {
              region: 'ECN',
              domain: 'media.woniu-xcx.xyz', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
    
              uptokenURL: api.GetQiniuToken, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
              
              // uptoken: "fgw_DQLEFNYRt3Kmd_aZ65twt-XtmDs90UV2T6K2:aGO6I55ltODcoble87lMeSCWcyw=:eyJzY29wZSI6Indvbml1IiwiZGVhZGxpbmUiOjE1MzI2MTcwNDd9"
            }, (res) => {
              that.setData({
                ['images[' + index + '].process']: res.progress
              });
                console.log('上传进度', res.progress)
                console.log(that.data.images)
            });
          })(i)
        }
        
        // that.setData(data);
      },
      fail: (e) => {
        console.log(e)
      }
    })
  },

  deletePhoto: function(event) {
    let that = this;
    let data = that.data;

    const deleteIndex = event.currentTarget.dataset.index;
    
    data.images.splice(deleteIndex, 1);

    that.setData(data);
  },

  switchshipWay: function (event) {
    let that = this;
    const way = event.currentTarget.dataset.way;
    // console.log(way)
    // switch which way
    // 0: switch self take 
    // 1: switch delivery
    if (way == 0) {
      that.setData({
        ifSelfTake: !that.data.ifSelfTake
      })
    } 
    else {
      that.setData({
        ifDelivery: !that.data.ifDelivery
      })
    }
  },

  nextStep: function () {
    let that = this;
    // before go to next step, check all the input
    that.processInputs();

    // validate shop kinds
    if (app.globalData.woowoUserInfo.user_right == 'shop') {
      let kind = app.globalData.woowoUserInfo.shopInfo.kind;
      let chosenKind = that.data.goodsInfo.mainCat;

      if (kind != chosenKind) {
        wx.showModal({
          title: '提示',
          content: '您的店铺分类为:' + kind + ', 只可以发布该分类下面的商品！',
          confirmText: '确认',
          showCancel: false
        })
        return;
      }
    }
    
    // validate goods info
    let validateResult = that.validateGoodsInfo(that.data.images, that.data.goodsInfo);

    if (validateResult.ifPassed && that.data.editMode == false) {
      let option = util.paramObjToStr(that.data.goodsInfo);
      wx.navigateTo({
        url: '../sale2/sale2?' + option
      })
    }
    else if (validateResult.ifPassed && that.data.editMode == true){
      let option = util.paramObjToStr(that.data.goodsInfo);
      wx.navigateTo({
        url: '../sale2/sale2?' + option + '&editMode=true&addition=' + JSON.stringify(that.data.editData[0])
      })
    }
    else {
      // console.log(validateResult.reason);
      wx.showToast({
        title: validateResult.reason,
        icon: 'none',
        success: function () {
          setTimeout(() => {
            wx.hideToast();
          }, 3000)
        }
      })
    }
  },

  processInputs: function () {
    let that = this;
    let data = {
      goodsInfo: that.data.goodsInfo
    }

    // for goods pictures
    let imgList = [];
    for (let i = 0, len = that.data.images.length; i < len; ++i) {
      imgList.push(that.data.images[i].uploadedFilePath);
    }
    data.goodsInfo.imgsUrl = imgList.join(';');

    // for goods conditon
    let conditionValue = that.data.conditionValue;
    data.goodsInfo.condition = (conditionValue == -1) ? "" : that.data.conditionLevel[conditionValue];

    // for goods delivery ways
    let delivery = [];
    if (that.data.ifSelfTake) delivery.push("自取");
    if (that.data.ifDelivery) delivery.push("邮寄");
    data.goodsInfo.shipWay = delivery.join(';');

    // for goods catalogies
    let catalogyValue = that.data.catalogyValue;
    data.goodsInfo.mainCat = (catalogyValue[0] == -1) ? "" : that.data.catalogies[0][catalogyValue[0]];
    data.goodsInfo.subCat = (catalogyValue[1] == -1) ? "" : that.data.catalogies[1][catalogyValue[1]];

    console.log(that.data.goodsInfo);
    that.setData(data);
    console.log(data.goodsInfo);
  },

  validateGoodsInfo: function (images, goodsInfo) {
    // for test
    let that = this;
    //  return {
    //    ifPassed: true
    //  }
    let result = {
      ifPassed: false,
      reason: ''
    }

    let imgUploding = false;

    for (let i = 0, len = images.length; i < len; ++i) {
      if (!images[i].ifDone) {
        imgUploding = true;
        break;
      }
    }

    if (goodsInfo.title.length == 0) {
      result.reason = "请输入物品名称";
    }
    else if (goodsInfo.brif.length < 5) {
      result.reason = "物品描述至少5个字";
    }
    else if (goodsInfo.imgsUrl.length == 0) {
      result.reason = "至少要上传一张商品图片";
    }
    else if (imgUploding) {
      result.reason = "图片上传中，请稍等";
    }
    else if (goodsInfo.condition == "") {
      result.reason = "请选择新旧程度";
    }
    else if (goodsInfo.mainCat == "" || goodsInfo.subCat == "") {
      result.reason = "请正确选择商品分类";
    }
    else if (goodsInfo.shipWay == "") {
      result.reason = "请选择邮寄方式";
    }
    else if (goodsInfo.price == -1) {
      result.reason = "请输入商品价格";
    }
    else {
      result.ifPassed = true;
    }

    return result;
  },

  inputPrice: function (event) {
    let that = this;
    let price = event.detail.value;
    if(price.substring(0,1) == "0"){
      price = price.substring(1,price.length)
    }
    // let price = Math.round(event.detail.value * 100)/100;
    if (price > 99999999) price = 99999999
    that.setData({
      ['goodsInfo.price']: price
    });
  },

  requestGoodsDetail: function (goodsId) {
    return new Promise((resolve, reject) => {
      util.request(api.GetCertainProduct, {
        product_id: goodsId
      }, 'POST')
        .then(res => {
          if (res.data.code == 0) {
            resolve(res.data.data);
          }
          else {
            throw new Error('Something wrong, when request goods detail');
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  },
})