// components/common/wnInputTrigger/wnInputTrigger.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: ''
    },

    defaultTriggerValue: {
      type: Boolean,
      value: false
    },

    blockHeight: {
      type: Number,
      value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {
    // for animation
    slideAnimation: {},
    triggerValue: false
  },

  ready: function () {
    let that = this;

    that.slideAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });

    that.setData({
      triggerValue: that.data.defaultTriggerValue
    })

    console.log(that.data.triggerValue);
  },

  /**
   * Component methods
   */
  methods: {
    wninputchanged: function (event) {
      let that = this;

      let value = event.detail.value;

      if (value == false) {
        that.triggerEvent('triggerclear', '')
      }
      that.triggerEvent('wninputchanged', {
        value: value
      })

      // for animation
      // if no blockHeight provided, then there's no animation
      if (that.data.blockHeight != 0) {
        let height = 0;
        if (value == true) {
          height = that.data.blockHeight;
        }
        else  {
          height = 0;
        }
        that.triggerSlideAnimation(height);
      }
    },

    triggerSlideAnimation: function (height) {
      let that = this;

      that.slideAnimation.height(height + 'px').step();

      that.setData({
        slideAnimation: that.slideAnimation.export()
      })
    }
  },

  
})
