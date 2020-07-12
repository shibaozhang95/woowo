// components/common/wnInputCount/wnInputCount.js
Component({
  /**
   * Component properties
   */
  properties: {
    inputType: {
      type: String,
      value: 'input'   // two values: input / textarea
    },
    placeholder: {
      type: String,
      value: ''
    },
    wordLimit: {
      type: Number,
      value: 20
    },
    textareaHeight: {
      type: Number,
      value: 60
    },

    defaultValue: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {
    currentWordCount: 0,
    inputValue: ''
  },

  ready: function () {
    let that = this;
    let defaultValue = that.data.defaultValue;

    that.setData({
      inputValue: defaultValue,
      currentWordCount: defaultValue.length
    })
  },

  /**
   * Component methods
   */
  methods: {
    inputChanged: function (event) {
      let that = this;

      let value = event.detail.value;
      let count = value.length;

      let filteredValue = that.filterUnsafeChar(value);

      that.setData({
        currentWordCount: count,
        inputValue: filteredValue
      })

      that.triggerEvent('wninputchanged', {
        type: 'text',
        value: filteredValue
      })
    },

    filterUnsafeChar: function (str) {

      return str.replace("'", "").replace('"', '').replace('`', '')
        .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
        .replace('[', '').replace(']', '');
    }
  },

  
})
