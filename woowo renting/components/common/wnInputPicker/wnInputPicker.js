// wnInputPicker/wnInputPicker.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    pickerMode: {
      type: String,
      value: 'selector'
    },
    pickerRange: {
      type: Array,
      value: []
    },

    defaultSelectorValue: {
      type: Number,
      value: -1
    },
    defaultMultiSelectorValue: {
      type: Array,
      value: []
    },
    defaultDateValue: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {
    shortcut: '',
    pickerValue: ''
  },

  ready: function () {
    let that = this;

    let defaultSelectorValue = that.data.defaultSelectorValue;
    let defaultMultiSelectorValue = that.data.defaultMultiSelectorValue;
    let defaultDateValue = that.data.defaultDateValue;

    let pickerMode = that.data.pickerMode;
    let pickerRange = that.data.pickerRange;

    let pickerValue;

    if (pickerMode == 'selector') {
      pickerValue = defaultSelectorValue;
    }
    else if (pickerMode == 'multiSelector') {
      pickerValue = defaultMultiSelectorValue;
    }
    else if (pickerMode == 'date') {
      pickerValue = defaultDateValue;
    }

    let initShortCut = that.createShortcut(pickerValue, pickerMode, pickerRange);
    that.setData({
      pickerValue: pickerValue,
      shortcut: initShortCut
    })
  },

  /**
   * Component methods
   */
  methods: {
    pickerChanged: function (event) {
      let that = this;

      let chosenValue = event.detail.value;
      let pickerMode = that.data.pickerMode;
      let pickerRange =  that.data.pickerRange;

      // update shortcut
      that.setData({
        shortcut: that.createShortcut(chosenValue, pickerMode, pickerRange)
      })

      that.triggerEvent('wninputchanged', {
        result: {
          type: that.data.pickerMode,
          range: that.data.pickerRange,
          value: chosenValue
        }
      })
    },

    createShortcut: function (chosenValue, pickerMode, pickerRange) {

      let result = '';

      if (pickerMode == 'selector') {
        if (chosenValue >= 0) {
          result = pickerRange[Number(chosenValue)];
        }
        
      }
      else if (pickerMode == 'multiSelector') {
        let ifValueLegal = true;

        for (let i = 0, len = chosenValue.length; i < len; ++i) {
          if (chosenValue[i] >= 0) {
            result += (pickerRange[i][chosenValue[i]] + ' ');
          }
          else {
            ifValueLegal = false;
            break;
          }
        }

        if (!ifValueLegal) result = '';

        result.trim();
      }
      else if (pickerMode == 'date') {
        result = chosenValue;
      }

      return result;
    }
  }
})
