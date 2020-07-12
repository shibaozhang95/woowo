const util = require('../../utils/util.js');
const api = require('../../services/api.js');

Page({
  data: {
    name: "",
    phone: "",
    dateRecord: "",
    address: "",
    comment: "",
    FormData: {}
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  // onShow: function () {
  //   wx.setNavigationBarTitle({
  //     title: "集赞活动"
  //   })
  // },

  touchCopy: function (event) {
    console.log(event);

    wx.setClipboardData({
      data: event.currentTarget.dataset.content
    })
  },

  previewQRCode: function (event) {
    let that = this;
    console.log(event)
    let url = event.currentTarget.dataset.url;
    let imgs = [url];
  
    wx.previewImage({
      // current: event.currentTarget.dataset.current,
      urls: imgs
    })
  },

  // new
  // nameInput: function (e) {
  //   this.setData({
  //     name: e.detail.value
  //   })
  // },
  // phoneInput: function (e) {
  //   this.setData({
  //     phone: e.detail.value
  //   })
  // },
  // DatePicker:function(e){
  //   this.setData({
  //     dateRecord: e.detail.value
  //   })
  // },
  // addressInput: function (e) {
  //   this.setData({
  //     address: e.detail.value
  //   })
  // },
  // commentInput: function (e) {
  //   this.setData({
  //     comment: e.detail.value
  //   })
  // },
  // confirmToSubmit: function(){
  //   let that = this;

  //   that.data.FormData.name = that.data.name;
  //   that.data.FormData.phone = that.data.phone;
  //   that.data.FormData.dateRecord = that.data.dateRecord;    
  //   that.data.FormData.address = that.data.address;
  //   that.data.FormData.comment = that.data.comment;

  //   if (that.data.name == "" || that.data.phone == "" || that.data.dateRecord == "" ||that.data.address == "" || that.data.comment == ""){
  //     wx.showToast({
  //       title: '请填写所有信息',
  //       mask: true,
  //       icon: 'none',
  //       success: () => {
  //         setTimeout(() => {
  //           wx.hideToast();
  //         }, 2000)
  //       }
  //     })
  //   }else{
  //     wx.showLoading({
  //       title: '提交中...'
  //     });

  //     util.request(api.ActiviesFormSubmit, that.data.FormData, 'POST')
  //       .then(res => {
  //         console.log(res)
  //         if (res.data.code == 0) {

  //           wx.hideLoading();
  //           wx.showToast({
  //             title: '提交成功',
  //             mask: true,
  //             success: () => {
  //               setTimeout(() => {
  //                 wx.hideToast();
  //               }, 2000)
  //             }
  //           })
  //         } else {
  //           throw new Error('Something wrong, post failed')
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         wx.hideLoading();
  //         wx.showToast({
  //           title: '提交失败',
  //           mask: true,
  //           icon: 'none',
  //           success: () => {
  //             setTimeout(() => {
  //               wx.hideToast();
  //             }, 2000)
  //           }
  //         })
  //       })
  //   }
  // }
})