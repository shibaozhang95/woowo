const qiniuUploader = require('../../utils/qiniuUploader');
const API = require('../../services/api');
// postAddingPhotos.js
Component({
  /**
   * Component properties
   */
  properties: {
    urls: {
      type: Array,
      value: ['', '']
    },

    defaultImageUrls: {
      type: String,
      value: ''
    },

    picsLimitation: {
      type: Number,
      value: 9
    },

    uploadHint: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {

    images: [],
    currIndex: 0,
    
    timer: Object,

    cameraIconUrl: './statics/post_menu_photos@2x.png'
  },

  ready: function () {
    let that = this;
    let data = that.data;

    let defaultImageUrlsList = data.defaultImageUrls.length > 0 ?
      data.defaultImageUrls.split(';') : [];
    data.images = [];

    console.log(defaultImageUrlsList)

    for (let i = 0, len = defaultImageUrlsList.length; i < len; ++i) {
      data.images.push({
        "tempFilePath": defaultImageUrlsList[i],
        "uploadedFilePath": defaultImageUrlsList[i],
        "process": 100,
        "ifDone": true,
        "ifMain": false     // for showing the dots
      })
    }

    // default the first one as true
    if (data.images.length > 0) data.images[0].ifMain = true;

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    takePhoto: function () {
      let that = this;
      let data = that.data;

      wx.chooseImage({
        count: data.picsLimitation - data.images.length,
        success: (res) => {
          let previousLen = data.images.length;
  
          for (let i = 0, len = res.tempFilePaths.length; i < len; ++i) {
            data.images.push({
              "tempFilePath": res.tempFilePaths[i],
              "uploadedFilePath": "",
              "process": 0,
              "ifDone": false
            })
          }
          
          // upload Locally first
          that.setData(data);
          that.updateNewPhotos();

          // need to be uploaded
          let uploadImages = [];
          for (let i = 0, len = data.images.length; i < len; ++i) {
            if (data.images[i].tempFilePath && data.images[i].ifDone == false) {
              uploadImages.push(data.images[i]);
            }
          }
    
          // upload remotely then
          for (let i = 0, len = uploadImages.length; i < len; ++i) {

            (function (index) {
              qiniuUploader.upload(uploadImages[index].tempFilePath, (res) => {
                let modifiedIndex = that.findIndex(uploadImages[index].tempFilePath);

                // the photo has been deleted
                if (modifiedIndex < 0) return;

                data.images[modifiedIndex].uploadedFilePath = 'https://' + res.imageURL;
                data.images[modifiedIndex].ifDone = true;

                that.setData(data);

                //for the process dot
                that.photosSwipeTimer(modifiedIndex);

                // trigger event
                that.updateNewPhotos();
              }, (error) => {
                console.log('error: ' + error);
              }, {
                region: 'ECN',
                domain: 'media.woniu-xcx.xyz', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
      
                uptokenURL: API.GetQiniuToken, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                
                // uptoken: "fgw_DQLEFNYRt3Kmd_aZ65twt-XtmDs90UV2T6K2:aGO6I55ltODcoble87lMeSCWcyw=:eyJzY29wZSI6Indvbml1IiwiZGVhZGxpbmUiOjE1MzI2MTcwNDd9"
              }, (res) => {
                that.setData({
                  ['images[' + index + '].process']: res.progress
                });
              });
            })(i)
          }
          
          // that.setData(data);
        },
        fail: (e) => {
          console.log(e)
          // for updating photos status
          that.updateNewPhotos();
        }
      })
    },

    findIndex: function (tempFilePath) {
      let that = this;
      let data = that.data;

      for (let i = 0, len = data.images.length; i < len; ++i) {
        if (tempFilePath == data.images[i].tempFilePath) {
          return i;
        }
      }

      return -1;
    },

    updateNewPhotos: function () {
      let that = this;
      let data = that.data;

      let ifAllUploaded = true;
      let imageLs = [];

      for (let i = 0, len = data.images.length; i < len; ++i) {
        if (data.images[i].ifDone == true) {
          imageLs.push(data.images[i].uploadedFilePath);
        }
        else {
          ifAllUploaded = false;
        }
      }

      that.triggerEvent('addnewphotos', {
        imageUrls: imageLs.join(';'),
        ifAllUploaded: ifAllUploaded
      })
    },

    deletePhoto: function (event) {
      let that = this;
      let data = that.data;

      let deleteIndex = event.currentTarget.dataset.index;

      data.images.splice(deleteIndex, 1);

      let nextIndex = deleteIndex - 1;
      if (nextIndex < 0) nextIndex = 0;

      // update componently
      that.photosSwipe({detail: {current: nextIndex}});

      // trigger then
      that.updateNewPhotos();

      // triggerEvent
      let imageLs = [];

      for (let i = 0, len = data.images.length; i < len; ++i) {
        if (data.images[i].ifDone == true) {
          imageLs.push(data.images[i].uploadedFilePath);
        }
      }

      that.triggerEvent('deletephotos', {
        imageUrls: imageLs.join(';')
      })
    },

    photosSwipeTimer: function (index) {
      let that = this;

      if (that.data.timer) {
        clearTimeout(that.data.timer);
      }

      that.data.timer = setTimeout(() => {
        that.photosSwipe({detail: {current: index}})
      }, 100)
    },

    photosSwipe: function (event) {
      let that = this;
      let data = that.data;

      let currIndex = event.detail.current;

      for (let i = 0, len = data.images.length; i < len; ++i) {
        data.images[i].ifMain = false;
      }

      if (data.images.length > 0) {
        data.images[currIndex].ifMain = true;
      }
      
      data.currIndex = currIndex;

      that.setData(data);
    },

    
  }
})
