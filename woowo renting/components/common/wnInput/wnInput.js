// components/common/wnInput/wnInput.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    inputType: {
      type: String,
      value: 'text'
    },
    prefix: {
      type: String,
      value: ''
    },
    suffix: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    inputWidth: {
      type: Number,
      value: 80
    },

    defaultNumberValue: {
      type: Number
    },

    defaultTextValue: {
      type: String
    },

    maxNum: {
      type: Number,
      value: 9999
    },
    minNum: {
      type: Number,
      value: 0
    }
  },

  /**
   * Component initial data
   */
  data: {
    inputValue: ''
  },

  ready: function () {
    let that = this;

    let initInputValue;
    let inputType = that.data.inputType;

    if (inputType == 'number') {
      initInputValue = that.data.defaultNumberValue ?
        that.data.defaultNumberValue : Number;
    }
    else if (inputType == 'text') {
      initInputValue = that.data.defaultTextValue;
    }

    that.setData({
      inputValue: initInputValue
    })
  },

  /**
   * Component methods
   */
  methods: {
    inputChanged: function (event) {
      let that = this;
      let data = that.data;

      let value = event.detail.value;

      let filteredValue = that.filterData(data.inputType, value);

      that.setData({
        inputValue: filteredValue
      })

      that.triggerEvent('wninputchanged', {
        type: that.data.inputType,
        value: filteredValue
      })
    },

    filterData: function (type, value) {
      let that = this;
      let data = that.data;

      if (type == 'number') {
        if (value < data.minNum) {
          return 0;
        }
        else if (value > data.maxNum) {
          return data.maxNum;
        }
        else if (isNaN(Number(value))) {
          return 0;
        }
        else {
          return value;
        }
      }

      if (type == 'text') {
        return value.replace("'", "").replace('"', '').replace('`', '')
          .replace('<', '').replace('>', '').replace('{', '').replace('}', '')
          .replace('[', '').replace(']', '');
      }
    }
  }
})
