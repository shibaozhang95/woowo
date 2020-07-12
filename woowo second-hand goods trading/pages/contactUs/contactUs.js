Page({
  data: {
    contactImgUrl: String
  },

  onLoad: function () {
    let that = this;
    wx.request({
      url: 'https://woniu-xcx.xyz/api/wx/dynamic/contact.php',
      method: "GET",
      success: function(res) {
        console.log(res)
        that.setData({
          contactImgUrl: res.data
        })
      }
    })
  },

  previewImage: function (event) {
    let that = this;
    
    let imgs = [];
    imgs.push(that.data.contactImgUrl)
    wx.previewImage({
      // current: event.currentTarget.dataset.current,
      urls: imgs
    })
  },
})