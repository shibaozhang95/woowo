// components/common/wnInputSwitch/wnInputSwitch.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: 'rgb(86,182,213)'
    },
    defaultSwitchValue: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    switchValue: false
  },

  ready: function () {
    let that = this;

    that.setData({
      switchValue: that.data.defaultSwitchValue
    })

    console.log(that.data.switchValue);
  },

  /**
   * Component methods
   */
  methods: {
    wninputchanged: function (event) {
      let that = this;

      let value = event.detail.value;
      
      that.triggerEvent('wninputchanged', {
        type: 'switch',
        value: value
      })
    }
  }
})
