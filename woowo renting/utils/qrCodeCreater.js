const util = require('util');
const SCALE = 2;

const CARD_WIDTH_VER_1 = 340
const CARD_HEIGHT_VER_1 = 265

const CARD_WIDTH_VER_2 = 330
const CARD_HEIGHT_VER_2 = 379

const CARD_WIDHT = CARD_WIDTH_VER_2
const CARD_HEIGHT = CARD_HEIGHT_VER_2
/**
 * 
 * @param {*} houseInfo : is the showingData
 */
function createSharingImage (canvasId, that, houseInfo, userInfo) {
  let houseId = houseInfo.houseId;
  let coverUrl = houseInfo.imageUrls[0]

  return new Promise((resolve, reject) => {
    let getQRCode = requestQRCode(houseId);
    let getCover = requestHouseCover(coverUrl);

    Promise.all([getQRCode, getCover])
    .then(imgs => {
      // return drawImg(canvasId, that, houseInfo,  
      //   userInfo, imgs[0], imgs[1]);
      return drawImgVer2(canvasId, that, houseInfo, userInfo, imgs[0], imgs[1]);
    })
    .then(target => {
      return canvasToImage(canvasId, target);
    })
    .then(result => {
      resolve(result);
    }) 
  })
}

module.exports = {
  createSharingImage
}

function requestQRCode (houseId) {
  console.log(houseId);
  return new Promise((resolve, reject) => {
    util.requestCreateQRCode(houseId)
    .then(res => {
      if (res.code == 0) {
        wx.downloadFile({
          url: res.data,
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
}

function requestHouseCover (coverUrl) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: coverUrl,
      success: (res) => {
        resolve(res);
      },
      fail: () => {
        reject(new Error('WX get image info error'));
      }
    })
  })
}

function drawImg (canvasId, target, houseInfo, userInfo, QRCodeUrl, coverInfo) {

  return new Promise((resolve, reject) => {
    const ctx = wx.createCanvasContext(canvasId, target);

    ctx.setFillStyle('rgb(248,245,240)');
    ctx.fillRect(0 * SCALE, 0 * SCALE, 340 * SCALE, 180 * SCALE);

    let imageResize = imageSizeAspectFill({
      width: coverInfo.width,
      height: coverInfo.height
    }, 340, 180)


    ctx.drawImage(coverInfo.path, (0 - (imageResize.width - 340) / 2.0) * SCALE, (0 - (imageResize.height - 180) / 2.0)
      , imageResize.width * SCALE, imageResize.height * SCALE);

    // draw the company information if have
    if (houseInfo.companyInfo && houseInfo.companyInfo.companyId) {
      let top = 10;
      let height = 20; 
      let textLen = ctx.measureText(houseInfo.companyInfo.name);
      let width = textLen.width + 15 * 2;
      let left = 340 - width - 13;

      ctx.setFillStyle('rgb(255,255,255)');
      // ctx.fillRect(left * SCALE, top * SCALE, width * SCALE, height * SCALE);
      roundRect(ctx, left * SCALE, top * SCALE, width * SCALE, height * SCALE, 5 * SCALE);

      ctx.setFillStyle('rgb(44,62,80)');
      ctx.setFontSize(12 * SCALE);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');

      ctx.fillText(houseInfo.companyInfo.name, (340 - width / 2 - 13) * SCALE, 20 * SCALE);

    }
    
    ctx.setFillStyle('rgb(86,182,213)');
    ctx.fillRect(0 * SCALE, 180 * SCALE, 340 * SCALE, 85 * SCALE);
    
    ctx.setFillStyle('white');
    ctx.fillRect(17 * SCALE, 134 * SCALE, 70 * SCALE, 70 * SCALE);
    ctx.drawImage(QRCodeUrl, 17 * SCALE, 134 * SCALE, 70 * SCALE, 70 * SCALE);

    ctx.drawImage('/statics/images/img_share_to_other.png', 275 * SCALE, 162 * SCALE, 65 * SCALE, 103 * SCALE);

    ctx.setFontSize(12 * SCALE);
    ctx.setFillStyle('rgb(255,255,255)');
    ctx.setTextAlign('left');

    ctx.fillText('分享个超棒的房源', 17 * SCALE, 220 * SCALE);
    ctx.fillText('分享个超棒的房源', 17.5 * SCALE, 220 * SCALE);

    let suburbAndType = '(' + houseInfo.houseSuburb 
      + ' ' + houseInfo.rentType + ')';
    ctx.fillText(suburbAndType, 119 * SCALE, 220 * SCALE);

    let houseTilte = houseInfo.houseTitle;
    ctx.fillText(houseTilte, 17 * SCALE, 236 * SCALE);

    ctx.fillText('快来看看woo~', 17 * SCALE, 252 * SCALE);

    ctx.draw(false, () => {
      resolve(target);
    })
  })
}

function drawImgVer2 (canvasId, target, houseInfo, userInfo, QRCodeUrl, coverInfo) {
  return new Promise((resolve, reject) => {
    const ctx = wx.createCanvasContext(canvasId, target);
    
    // draw the background
    ctx.setFillStyle('rgb(255,255,255)');
    ctx.fillRect(0, 0, CARD_WIDHT * 2, CARD_HEIGHT * 2);

    let extraTopHeight = 19.5

    // draw the background image
    ctx.drawImage('/statics/images/img_bg_sharing.png', 0 * SCALE, extraTopHeight * SCALE, 330 * SCALE, 360 * SCALE);

  
    // Cover
    ctx.setFillStyle('rgba(255,255,255,1)');
    ctx.setShadow(0, 3 * SCALE, 6 * SCALE, 'rgba(0,0,0,0.16)');
    ctx.fillRect(22 * SCALE, (16.5 + extraTopHeight) * SCALE, 285 * SCALE, 175 * SCALE);

    // console.log(coverInfo);
    roundRectWithImg(ctx, 22 * SCALE, (16.5 + extraTopHeight) * SCALE, 285 * SCALE, 175 * SCALE, 5 * SCALE, coverInfo)

    // QR Code
    ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)');
    ctx.setFillStyle('white');
    ctx.fillRect(18 * SCALE, (177.5 + extraTopHeight) * SCALE, 70 * SCALE, 70 * SCALE);
    ctx.drawImage(QRCodeUrl, 18 * SCALE, (177.5 + extraTopHeight) * SCALE, 70 * SCALE, 70 * SCALE);

    // Price
    ctx.setFillStyle('rgb(255, 255 ,255)')
    ctx.setTextAlign('left');
    ctx.setTextBaseline('top');
    ctx.setFontSize(16 * SCALE)
    let priceTxt = '$' + houseInfo.pricePerWeek + '/周';
    ctx.fillText(priceTxt, 99 * SCALE, (214.5 + extraTopHeight) * SCALE)
    ctx.fillText(priceTxt, 99.5 * SCALE, (214.5 + extraTopHeight) * SCALE)

    // Rent type
    let rentTypeTxt = houseInfo.rentType;
    drawRoundRectWithText(ctx, rentTypeTxt, (214.5 + extraTopHeight), 171, 20, -5, 5, 'rgb(86,181,212)'
      , 'rgb(255,255,255)', 14);

    // House type
    let houseTypeTxt = houseInfo.houseType;
    if (houseTypeTxt.length != 0) {
      drawRoundRectWithText(ctx, houseTypeTxt, (214.5 + extraTopHeight), 222, 20, 9999, 5, 'rgb(86,181,212)'
        , 'rgb(255,255,255)', 14);
    }
    

    ctx.setFillStyle('rgb(255,255,255)')
    ctx.setTextAlign('left');
    ctx.setTextBaseline('top');
    ctx.setFontSize(12 * SCALE)

    // House title
    let houseTitleTxt = houseInfo.houseTitle;
    ctx.fillText('分享个超棒的房源', 18 * SCALE, (255.5 + extraTopHeight) * SCALE);
    ctx.fillText('分享个超棒的房源', 18 * SCALE + 1, (255.5 + extraTopHeight) * SCALE);
    ctx.fillText(houseTitleTxt, 18 * SCALE, (255.5 + extraTopHeight + 17) * SCALE);
    ctx.fillText('快来看看woo～', 18 * SCALE, (255.5 + extraTopHeight + 17 + 17) * SCALE);

    // Adress
    let addressTxt = houseInfo.houseAddress;
    ctx.fillText(addressTxt, 35 * SCALE, (317.5 + extraTopHeight) * SCALE);

    // Date
    let avaliableDateTxt = '入住：' + houseInfo.avaliableDate;
    ctx.fillText(avaliableDateTxt, 35 * SCALE, (335.5 + extraTopHeight) * SCALE);

    let expireDateTxt = '到期：' + houseInfo.expireDate;
    ctx.fillText(expireDateTxt, 135 * SCALE, (335.5 + extraTopHeight) * SCALE);

    // agent info
    if (houseInfo.companyInfo && houseInfo.companyInfo.companyId) {
      drawRoundRectWithText(ctx, houseInfo.companyInfo.name, 0, 22, 30, -10, 5, 'rgb(86,181,212)'
        , 'rgb(255,255,255)', 16)
    }

    ctx.draw(true, () => {
      setTimeout(() => {
        resolve(target);
      }, 1000)
    })
  })
}

function drawRoundRectWithText (ctx, text, posTop, posLeft, h, margin, radius, bgColor, fontColor, fontSize) {
  let top = posTop;
  let height = h;

  ctx.setFontSize(fontSize * SCALE);

  // special condition
  if (margin == 9999) {
    if (text.length <= 2) {
      margin = 0
    }
    else if (text.length == 4) {
      margin = -10
    }
    else {
      margin = -30
    }
  }
  let textLen = ctx.measureText(text);
  let width = textLen.width + margin * 2;
  let left = posLeft;

  ctx.setFillStyle(bgColor);
  roundRect(ctx, left * SCALE, top * SCALE, width * SCALE, height * SCALE, radius * SCALE);

  ctx.setFillStyle(fontColor);
  ctx.setTextAlign('center');
  ctx.setTextBaseline('middle');

  ctx.fillText(text, (posLeft + width / 2) * SCALE, (posTop + height / 2) * SCALE);

  return width;
}

function canvasToImage (canvasId, that) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      x: 0 * SCALE,
      y: 0 * SCALE,
      width: CARD_WIDHT * SCALE,
      height: CARD_HEIGHT * SCALE,
      canvasId: canvasId,
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

/**
  * @param {CanvasContext} ctx canvas上下文
  * @param {number} x 圆角矩形选区的左上角 x坐标
  * @param {number} y 圆角矩形选区的左上角 y坐标
  * @param {number} w 圆角矩形选区的宽度
  * @param {number} h 圆角矩形选区的高度
  * @param {number} r 圆角的半径
  */
 function roundRect(ctx, x, y, w, h, r) {
  //ctx.save()
  // 开始绘制
  ctx.beginPath()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可
  // ctx.setFillStyle('transparent')
  // ctx.setStrokeStyle('transparent')
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)

  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  // ctx.stroke()
  ctx.closePath()
  // 剪切
  //ctx.clip()
  
  //ctx.restore()
}

function roundRectWithImg(ctx, x, y, w, h, r, imgUrl) {
  ctx.save()
  // 开始绘制
  // ctx.beginPath()
  // // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // // 这里是使用 fill 还是 stroke都可以，二选一即可
  // // ctx.setFillStyle('transparent')
  // // ctx.setStrokeStyle('transparent')
  // // 左上角
  // ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // // border-top
  // ctx.moveTo(x + r, y)
  // ctx.lineTo(x + w - r, y)
  // ctx.lineTo(x + w, y + r)
  // // 右上角
  // ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // // border-right
  // ctx.lineTo(x + w, y + h - r)
  // ctx.lineTo(x + w - r, y + h)
  // // 右下角
  // ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // // border-bottom
  // ctx.lineTo(x + r, y + h)
  // ctx.lineTo(x, y + h - r)
  // // 左下角
  // ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // // border-left
  // ctx.lineTo(x, y + r)
  // ctx.lineTo(x + r, y)

  // // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  // // ctx.fill()

  // // ctx.stroke()
  // ctx.closePath()
  // 剪切
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
    
  let imageResize = imageSizeAspectFill({
    width: imgUrl.width,
    height: imgUrl.height
  }, 285, 175)

  ctx.drawImage(imgUrl.path, (x/SCALE - (imageResize.width - 285) / 2.0) * SCALE, (y/SCALE - (imageResize.height - 175) / 2.0) * SCALE
    , imageResize.width * SCALE, imageResize.height * SCALE);

  ctx.restore()
}