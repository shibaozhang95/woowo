const util = require('../../utils/util')
const SCALE = 2;

const IMG_WDITH_VR = 340
const IMG_HEIGHT_VR = 315

const IMG_WDITH_HR = 340
const IMG_HEIGHT_HR = 240

const EXTRA_HEIGHT = 120

Component({
  properties: {
    goodsId: {
      type: String,
      value: ''
    },
    
    goodsTitle: {
      type: String,
      value: ''
    },

    goodsCover: {
      type: String,
      value: ''
    },

    goodsPrice: {
      type: Number,
      value: 0
    },

    ifShop: {
      type: Boolean,
      value: false,
    },

    shopName: {
      type: String,
      value: '',
    },

    shopDescription: {
      type: String,
      value: ''
    },

    shopId: {
      type: String,
      value: ''
    },

    shopImage: {
      type: String,
      value: ''
    },

    ifShowShareImage: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        let that = this;
        let data = that.data;

        // do not request again
        if (that.data.imageUrl.length != 0) return;

        if (newVal == true) {
          wx.showLoading({
            title: '生成中...',
            mask: true
          })

          if (!data.ifShop) {
            that.createSharingImageVersion2().then(res => {
              that.setData({
                'imageUrl': res.imageUrl
              })
  
              wx.hideLoading();
  
              wx.showToast({
                title: '生成成功',
                success: function() {
                  setTimeout(() => {
                    wx.hideToast()
                  }, 2000)
                }
              })
            })
          }
          else if (data.ifShop) {
            that.createShopCard().then(res => {
              that.setData({
                'imageUrl': res.imageUrl
              })
  
              wx.hideLoading();
  
              wx.showToast({
                title: '生成成功',
                success: function() {
                  setTimeout(() => {
                    wx.hideToast()
                  }, 2000)
                }
              })
            })
          }
        }
      }
    }
  },

  data: {
    imageUrl: "",
    ifHorizontalImg: false
  },

  methods: {
    createSharingImageVersion2: function () {
      let that = this;
      return new Promise((resolve, reject) => {
        let getQRCode = that.requestQRCode(that.data.goodsId);
        let getGoodsCover = that.requestGoodsCover(that.data.goodsCover);

        Promise.all([getQRCode, getGoodsCover])
        .then(imgs => {
          console.log(imgs);
          return that.drawImgVersion3(imgs[0], imgs[1]);
        })
        .then((target) => {
          return that.canvasToImageVersion2(target);
        })
        .then(result => {
          console.log(result);
          resolve(result);
        })
      })
    },

    createShopCard: function () {
      let that = this;
      let data = that.data;
      
      return new Promise((resolve, reject) => {
        let getQRCode = that.requestQRCode('shopId=' + data.shopId);
        let getShopImage = that.requestGoodsCover(data.shopImage);

        Promise.all([getQRCode, getShopImage])
        .then(imgs => {
          return that.drawShopCard(imgs[0], imgs[1])
        })
        .then(target => {
          return that.canvasToImageForShop(target);
        })
        .then(result => {
          console.log(result);
          resolve(result);
        })
      })

    },

    requestQRCode: function (goodsId) {
      return new Promise((resolve, reject) => {
        util.requestQRCodeUrl(goodsId).then(res => {
          if (res.code == 0) {
            wx.downloadFile({
              url: res.data.replace('http:', 'https:'),
              success: (res) => {
                resolve(res.tempFilePath);
              },
              fail: () => {
                reject(new Error('WX download file error'));
              }
            })
          }
          else {
            reject(new Error('Request QR Code error'));
          }
        })
      })
    },

    requestGoodsCover: function (goodsCoverUrl) {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: goodsCoverUrl.replace('http:', 'https:'),
          success: (res) => {
            console.log(res);
            resolve(res);
          },
          fail: () => {
            reject(new Error('WX download file error'));
          }
        })
      })
    },

    drawImgVersion2: function (QRCodeUrl, goodsCoverInfo) {
      let that = this;
      return new Promise((resolve, reject) => {
        
        const ctx = wx.createCanvasContext('testCanvas', that);

        ctx.setFillStyle('white');
        ctx.fillRect(0 * SCALE, 0 * SCALE, 280 * SCALE, 280 * SCALE);

        let imageResize = that.newImageSize({width: goodsCoverInfo.width, height: goodsCoverInfo.height}, 280, 280);
        // ctx.drawImage(goodsCoverInfo.path, 0 * SCALE, 0 * SCALE, 280 * SCALE, 280 * SCALE);
        ctx.drawImage(goodsCoverInfo.path, (0 - (imageResize.width - 280) / 2.0)*SCALE, (0 - (imageResize.height - 280) / 2.0)*SCALE, imageResize.width*SCALE, imageResize.height*SCALE)

        ctx.setFillStyle('rgb(246,182,45)');
        ctx.fillRect(0 * SCALE, 280 * SCALE, 280 * SCALE, 380 * SCALE);

        ctx.setFillStyle('white');
        ctx.fillRect(15 * SCALE, 245 * SCALE, 70 * SCALE, 70 * SCALE);
        ctx.drawImage(QRCodeUrl, 15 * SCALE, 245 * SCALE, 70 * SCALE, 70 * SCALE);
        
        ctx.drawImage('../../statics/images/img_share_to_other@2x.png', 179 * SCALE, 219 * SCALE, 101 * SCALE, 161 * SCALE);

        ctx.setFontSize(12 * SCALE);
        ctx.setFillStyle('rgb(44, 62, 80)');
        ctx.setTextAlign('left');
        // ctx.setTextBaseLine('top');

        ctx.fillText('分享个好物', 15 * SCALE, 335 * SCALE);
        ctx.fillText('分享个好物', 15.5 * SCALE, 335 * SCALE);

        ctx.fillText(that.data.goodsTitle, 15 * SCALE, 351 * SCALE);
        ctx.fillText('快来看woo~', 15 * SCALE, 367 * SCALE);

        ctx.draw(true, () => {
          setTimeout(() => {
            resolve(that);
          })
        })
      })
    },

    drawImgVersion3: function (QRCodeUrl, goodsCoverInfo) {
      let that = this;
      let data = that.data;

      return new Promise((resolve, reject) => {
        const ctx = wx.createCanvasContext('testCanvas', that);

        // draw the corver first
        data.ifHorizontalImg = goodsCoverInfo.width/goodsCoverInfo.height >= 4/3
        that.setData(data);

        let imgWidth = data.ifHorizontalImg ? IMG_WDITH_HR : IMG_WDITH_VR
        let imgHeight = data.ifHorizontalImg ? IMG_HEIGHT_HR : IMG_HEIGHT_VR
        let imgPosTop = 0
        let imgPosLeft = 0

        ctx.save()
        ctx.beginPath()
        ctx.rect(imgPosLeft * SCALE, imgPosTop * SCALE, imgWidth * SCALE, imgHeight * SCALE);
        ctx.clip()

        ctx.setFillStyle('rgb(246, 182, 45)')
        ctx.fillRect(imgPosLeft * SCALE, imgPosTop * SCALE, imgWidth * SCALE, imgHeight * SCALE)

        let imageResize = imageSizeAspectFill({
          width: goodsCoverInfo.width,
          height: goodsCoverInfo.height
        }, imgWidth, imgHeight)

        ctx.drawImage(goodsCoverInfo.path, (imgPosLeft - (imageResize.width - imgWidth) / 2.0) * SCALE,
          (imgPosTop - (imageResize.height - imgHeight) / 2.0) * SCALE,
          imageResize.width * SCALE, imageResize.height * SCALE)
        
        ctx.restore();

        // draw the extra part
        let extraPosTop = data.ifHorizontalImg ? IMG_HEIGHT_HR : IMG_HEIGHT_VR
        let extraPosLeft = 0
        let extraWidth = 340
        let extraHeight = 120

        // base
        ctx.setFillStyle('rgb(246, 182, 45)')
        ctx.fillRect(extraPosLeft * SCALE, extraPosTop * SCALE, extraWidth * SCALE, extraHeight * SCALE);

        // QR Code 
        ctx.setFillStyle('white')
        ctx.fillRect(13 * SCALE, (extraPosTop + 26) * SCALE, 80 * SCALE, 80 * SCALE);
        ctx.drawImage(QRCodeUrl, 13 * SCALE, (extraPosTop + 26) * SCALE, 80 * SCALE, 80 * SCALE)

        // Waterstamp
        ctx.setTextAlign('left');
        ctx.setTextBaseline('top');

        ctx.setFillStyle('rgba(255, 255, 255, 0.3)')
        ctx.setFontSize(25 * SCALE)
        ctx.fillText('WOOWO二手', 14 * SCALE, (extraPosTop - 4) * SCALE)

        // Price
        ctx.setFillStyle('rgb(255, 255, 255)');
        ctx.setFontSize(20 * SCALE);
        let priceText = data.goodsPrice == 0 ? '议价' : ('$' + data.goodsPrice)
        ctx.fillText(priceText, 101 * SCALE, (extraPosTop + 23) * SCALE)
        ctx.fillText(priceText, 101 * SCALE + 1, (extraPosTop + 23) * SCALE)

        // other info
        ctx.setFontSize(12 * SCALE);
        ctx.setFillStyle('rgb(44, 62, 80)');

        ctx.fillText('分享个好物', 101 * SCALE, (extraPosTop + 54) * SCALE)
        ctx.fillText('分享个好物', 101 * SCALE + 1, (extraPosTop + 54) * SCALE)

        ctx.fillText(data.goodsTitle, 101 * SCALE, (extraPosTop + 54 + 18) * SCALE)
        
        ctx.fillText('快来看看woo~', 101 * SCALE, (extraPosTop + 54 + 18 + 18) * SCALE)

        // woowo
        let woowoWidth = 112;
        let woowoHeight = 128
        let cardWidth = IMG_WDITH_VR
        let cardHeight =  (data.ifHorizontalImg ? IMG_HEIGHT_HR : IMG_HEIGHT_VR) + EXTRA_HEIGHT
        ctx.drawImage('../../statics/images/img_share_img.png'
          , (cardWidth - woowoWidth) * SCALE, (cardHeight - woowoHeight) * SCALE
          , woowoWidth * SCALE, woowoHeight * SCALE);


        ctx.draw(true, () => {
          setTimeout(() => {
            resolve(that)
          })
        })
      })
    },

    drawShopCard: function (QRCodeUrl, shopImage) {
      let that = this;
      let data = that.data;

      return new Promise((resolve, reject) => {
        const ctx = wx.createCanvasContext('testCanvas', that);

        // draw the background first
        ctx.drawImage('../../statics/images/bg_shop.png', 0, 0, 325 * SCALE, 251 * SCALE);

        // draw the QRCode
        ctx.drawImage(QRCodeUrl, 217 * SCALE, 93 * SCALE, 70 * SCALE, 70 * SCALE);

        ctx.save();

        // draw the Shop Image
        let imageSize = imageSizeAspectFill({
          width: shopImage.width,
          height: shopImage.height
        }, 35 * SCALE, 35 * SCALE);

        ctx.beginPath();
        ctx.arc((145 + 35 / 2) * SCALE, (175 + 35 / 2) * SCALE, (35 / 2) * SCALE, 0, Math.PI * 2, false);
        ctx.clip();

        ctx.drawImage(shopImage.path, (145 - (imageSize.width - 35) / 2.0) * SCALE,
          (175 - (imageSize.height - 35) / 2.0) * SCALE,
          imageSize.width * SCALE, imageSize.height * SCALE);
        
        ctx.restore();

        // draw shop title
        let shopTitle = {
          x: 192 * SCALE,
          y: 175 * SCALE,
          width: 96 * SCALE,
          height: 17 * SCALE,
          line: 3,
          color: 'rgb(44, 62, 80)',
          size: 12 * SCALE,
          align: 'left',
          baseline: 'top',
          text: data.shopName,
          bold: false
        }

        textWrap(shopTitle, ctx);

        // draw shop description
        let shopDescription = {
          x: 145 * SCALE,
          y: 215 * SCALE,
          width: 143 * SCALE,
          height: 14 * SCALE,
          line: 3,
          color: 'rgba(44, 62, 80, 0.5)',
          size: 10 * SCALE,
          align: 'left',
          baseline: 'top',
          text: '"' + data.shopDescription + '"',
          bold: false
        }

        
        textWrap(shopDescription, ctx);

        ctx.draw(true, () => {
          setTimeout(() => {
            resolve(that);
          }, 2000)
        })
      })
    },

    drawImage: function (imgUrl) {
      let that = this;
      const ctx = wx.createCanvasContext('testCanvas', that);

      ctx.setFillStyle('white');
      ctx.fillRect(0 * SCALE, 0 * SCALE, 280 * SCALE, 250 * SCALE);

      ctx.setFontSize(16 * SCALE);
      ctx.setFillStyle('rgb(44, 62, 80)');
      ctx.setTextAlign('center');
      ctx.fillText('我在woowo上发布了', 140 * SCALE, 50 * SCALE)
      ctx.fillText(that.data.goodsTitle, 140 * SCALE, 72 * SCALE)
      ctx.fillText('快来看看Woo~~~', 140 * SCALE, 94 * SCALE)

      ctx.drawImage('../../statics/images/img_come_to_see_me@2x.png', 22 * SCALE, 117 * SCALE, 225 * SCALE, 143 * SCALE)

      ctx.setFillStyle('rgb(246, 182, 45)');
      ctx.fillRect(0 * SCALE, 250 * SCALE, 280 * SCALE, 170 * SCALE);


      let url = imgUrl
      ctx.drawImage(url, 63 * SCALE, 250 * SCALE, 155 * SCALE, 155 * SCALE)

      ctx.draw(true, () => {
        setTimeout(() => {
          that.canvasToImage(that)
        }, 500)
      })
    },

    canvasToImageVersion2: function (that) {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          x: 0 * SCALE,
          y: 0 * SCALE,
          width: IMG_WDITH_VR * SCALE,
          height: ((that.data.ifHorizontalImg ? IMG_HEIGHT_HR : IMG_HEIGHT_VR) + EXTRA_HEIGHT) * SCALE,
          canvasId: 'testCanvas',
          success: (res) => {
            console.log(res);
            resolve({
              'imageUrl': res.tempFilePath
            })
          },
          fail: (err) => {
            console.log(err);
            console.log('CanvansToImageVersion2 failed!');
          }

        }, that);
      });
    },

    canvasToImageForShop: function (that) {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          x: 0 * SCALE,
          y: 0 * SCALE,
          width: 325 * SCALE,
          height: 251 * SCALE,
          canvasId: 'testCanvas',
          success: (res) => {
            resolve({
              'imageUrl': res.tempFilePath
            })
          },
          fail: (err) => {
            console.log(err);
          }
        }, that)
      })
    },

    canvasToImage: function (that) {

      // let that = this;
      wx.canvasToTempFilePath({
        x: 0 * SCALE,
        y: 0 * SCALE,
        width: 280 * SCALE,
        height: 420 * SCALE,
        canvasId: 'testCanvas',
        success: (res) => {
          
          that.setData({
            imageUrl: res.tempFilePath
          })

          wx.hideLoading();

          wx.showToast({
            title: '生成成功',
            success: function() {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
      }, that);
    },

    saveImageToLocal: function () {
      let that = this;

      wx.saveImageToPhotosAlbum({
        filePath: that.data.imageUrl,
        success(res) {
          console.log(res);
          wx.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，去发圈噻~',
              showCancel:false,
              confirmText:'好哒',
              confirmColor:'#2C3E50',
              success: function(res) {
                if (res.confirm) {
                    that.triggerEvent('complete', {success: true})
                }
              }
          })
        }

      })
    },

    cancelShare: function () {
      let that = this;

      that.setData({
        ifShowShareImage: false
      });

      that.triggerEvent('complete', {success: false})
    },

    newImageSize: function (imageSize, w, h) {
      if (imageSize.width < w) {
        if (imageSize.height < h) {
          var scale1 = imageSize.height / imageSize.width;
          var scale2 = h / imageSize.height;
          if (scale1 > scale2) {
            imageSize.height = imageSize.height / imageSize.width * w;
            imageSize.width = w
          } else {
            imageSize.width = imageSize.width / imageSize.height * h;
            imageSize.height = h
          }
        } else {
          imageSize.height = imageSize.height / imageSize.width * w;
          imageSize.width = w
        }
      }
      else if (imageSize.height < h) {
        if (imageSize.width < w) {
          var scale1 = imageSize.height / imageSize.width;
          var scale2 = h / imageSize.height;
          if (scale1 > scale2) {
            imageSize.height = imageSize.height / imageSize.width * w;
            imageSize.width = w
          } else {
            imageSize.width = imageSize.width / imageSize.height * h;
            imageSize.height = h
          }
        } else {
          imageSize.width = imageSize.width / imageSize.height * h;
          imageSize.height = h
        }
      }
      else {
        var scale1 = imageSize.height / imageSize.width;
        var scale2 = h / imageSize.height;
        if (scale1 > scale2) {
          imageSize.height = imageSize.height / imageSize.width * w;
          imageSize.width = w
        } else {
          imageSize.width = imageSize.width / imageSize.height * h;
          imageSize.height = h
        }
      }
      console.log('改变imageSize', imageSize.width, imageSize.height)
      return imageSize;
    }
  },

  ready: function () {
    let that = this;
  },
})

/**
 * 渲染文字
 *
 * @param {Object} obj
 */
function drawText (obj, ctx) {
  console.log('渲染文字')
  ctx.save();
  ctx.setFillStyle(obj.color);
  ctx.setFontSize(obj.size);
  ctx.setTextAlign(obj.align);
  ctx.setTextBaseline(obj.baseline);
  if (obj.bold) {
      console.log('字体加粗')
      ctx.fillText(obj.text, obj.x, obj.y - 0.5);
      ctx.fillText(obj.text, obj.x - 0.5, obj.y);
  }
  ctx.fillText(obj.text, obj.x, obj.y);
  if (obj.bold) {
      ctx.fillText(obj.text, obj.x, obj.y + 0.5);
      ctx.fillText(obj.text, obj.x + 0.5, obj.y);
  }
  ctx.restore();
}

/**
 * 获取文本折行
 * @param {Object} obj
 * @return {Array} arrTr
 */
function getTextLine (obj, ctx){

  ctx.setFontSize(obj.size);

  let arrText = obj.text.split('');
  let line = '';
  let arrTr = [];
  for (let i = 0; i < arrText.length; i++) {
      var testLine = line + arrText[i];
      var metrics = ctx.measureText(testLine);
      var width = metrics.width;
      if (width > obj.width && i > 0) {
          arrTr.push(line);
          line = arrText[i];
      } else {
          line = testLine;
      }
      if (i == arrText.length - 1) {
          arrTr.push(line);
      }
  }
  return arrTr;
}

/**
 * 文本换行
 *
 * @param {Object} obj
 */
function textWrap (obj, ctx) {
  console.log('文本换行')
  let tr = getTextLine(obj, ctx);
  for (let i = 0; i < tr.length; i++) {
      if (i < obj.line){
          let txt = {
              x: obj.x,
              y: obj.y + (i * obj.height),
              color: obj.color,
              size: obj.size,
              align: obj.align,
              baseline: obj.baseline,
              text: tr[i],
              bold: obj.bold
          };
          if (i == obj.line - 1) {
              txt.text = txt.text.substring(0, txt.text.length - 3) + '......';
          }
          drawText(txt, ctx);
      }
  }
}


// 图片适配（aspectFill）
function imageSizeAspectFill (imageSize, w, h) {
  if (imageSize.width < w) {
    if (imageSize.height < h) {
      var scale1 = imageSize.height / imageSize.width;
      var scale2 = h / imageSize.height;
      if (scale1 > scale2) {
        imageSize.height = imageSize.height / imageSize.width * w;
        imageSize.width = w
      } else {
        imageSize.width = imageSize.width / imageSize.height * h;
        imageSize.height = h
      }
    } else {
      imageSize.height = imageSize.height / imageSize.width * w;
      imageSize.width = w
    }
  }
  else if (imageSize.height < h) {
    if (imageSize.width < w) {
      var scale1 = imageSize.height / imageSize.width;
      var scale2 = h / imageSize.height;
      if (scale1 > scale2) {
        imageSize.height = imageSize.height / imageSize.width * w;
        imageSize.width = w
      } else {
        imageSize.width = imageSize.width / imageSize.height * h;
        imageSize.height = h
      }
    } else {
      imageSize.width = imageSize.width / imageSize.height * h;
      imageSize.height = h
    }
  }
  else {
    var scale1 = imageSize.height / imageSize.width;
    var scale2 = h / imageSize.height;
    if (scale1 > scale2) {
      imageSize.height = imageSize.height / imageSize.width * w;
      imageSize.width = w
    } else {
      imageSize.width = imageSize.width / imageSize.height * h;
      imageSize.height = h
    }
  }
  console.log('改变imageSize', imageSize.width, imageSize.height)
  return imageSize;
}

// 图片适配（aspectFit）
function imageSizeAspectFit (imageSize, w, h) {
  var scale, imageHeight, imageWidth;
  scale = imageSize.width / imageSize.height;
  imageHeight = w / scale;
  if (imageHeight > h) {
    imageWidth = h * scale;
    imageSize.width = imageWidth;
    imageSize.height = h;
  }else{
    imageSize.width = w;
    imageSize.height = imageHeight;
  }
  console.log('改变imageSize', imageSize.width, imageSize.height)
  return imageSize;
}