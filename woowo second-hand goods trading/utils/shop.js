

function shopInfoCheck (woowoUserInfo) {
  let shopInfo = woowoUserInfo.shopInfo;

  // if it's just a nomal user
  if (woowoUserInfo.user_right != 'shop') {
    return true
  }

  if (shopInfo && shopInfo.name && shopInfo.description
    && shopInfo.image && shopInfo.bgImage) {
    if (shopInfo.kind == '') {
      wx.showModal({
        title: '提示',
        content: '请联系系统管理员为您的商铺添加分类!',
        confirmText: '确认',
        showCancel: false
      })
      return false;
    }
    else {
      return true;
    }
  }

  else {
    wx.showModal({
      title: '提示',
      content: '完善商铺信息后，才可使用相应的功能！',
      confirmText: '去完善',
      success: (res) => {
        if (res.confirm == true) {
          wx.navigateTo({
            url: '/pages/shopInfo/shopInfo',
          })
        }
      }
    })
    return false;
  }
}

module.exports = {
  shopInfoCheck
}