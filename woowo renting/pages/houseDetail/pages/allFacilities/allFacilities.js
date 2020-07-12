import Icons from "../../../../utils/icons";

// pages/houseDetail/pages/allFacilities/allFacilities.js
Page({

  /**
   * Page initial data
   */
  data: {
    allFacilities: [{
      fieldTitle: '室内服务',
      fieldName: 'indoor',
      fieldIcons: []
    }, {
      fieldTitle: '家具',
      fieldName: 'furniture',
      fieldIcons: []
    }, {
      fieldTitle: '包含账单',
      fieldName: 'bills',
      fieldIcons: []
    }, {
      fieldTitle: '公共设施',
      fieldName: 'public',
      fieldIcons: []
    }, {
      fieldTitle: '周围设施',
      fieldName: 'nearby',
      fieldIcons: []
    },]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    let data = that.data;

    let allIcons = JSON.parse(options.allIcons);

    let formatIcons = new Icons().getAllShowingIcons(allIcons);

    Object.getOwnPropertyNames(formatIcons).forEach(key => {
      
      for (let i = 0, len = data.allFacilities.length; i < len; ++i) {
        // console.log(key);
        // confirm
        if (key == data.allFacilities[i].fieldName) {
          data.allFacilities[i].fieldIcons = formatIcons[key];
        }
      }
    })

    console.log(data.allFacilities)

    that.setData(data);
    // console.log(allIcons);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})