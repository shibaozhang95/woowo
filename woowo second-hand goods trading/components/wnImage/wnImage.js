import DownLoader from '../../utils/downLoader'
const downloader = new DownLoader();

// wnImage.js
Component({
  /**
   * Component properties
   */
  properties: {
    imgMode: {
      type: String,
      value: '',
    },

    ifLazyLoad: {
      type: Boolean,
      value: false
    },

    imgSrc: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {
    imgPath: '',

    multipleStyleSymbol: '-',
    // ifMultipuleImageStyle: false,
    ifTurnOnImageStyle: true,
    imageStyles: ['scale_50']
  },

  /**
   * Component methods
   */
  methods: {

  },

  attached: function () {
    let that = this;

    let imageStyleStr = '';

    for (let i = 0, len = that.data.imageStyles.length; i < len; ++i) {
      imageStyleStr += (that.data.multipleStyleSymbol + that.data.imageStyles[i]);
    }

    // that.setData({
    //   imgPath: that.data.imgSrc + imageStyleStr
    // })
    downloader.download(that.data.imgSrc + imageStyleStr).then(path => {

      that.setData({
        imgPath: path
      })

    }).catch(() => {
      console.log('Caching image locally failed!')
    })
  }
})
