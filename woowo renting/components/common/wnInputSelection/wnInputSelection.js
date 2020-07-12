// components/common/wnInputSelection/wnInputSelection.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: ''
    },

    choices: {
      type: Array,
      value: ['']
    },

    defaultChoices: {
      type: Array,
      value: ['']
    },

    selectionType: {
      type: String,
      value: 'radio'  // radio or multiple
    },

    resetCount: {
      type: Number,
      value: 0,
      observer (newVal, oldVal) {
        let that = this;
        that.dataInitialize();
      }
    }
  },

  /**
   * Component initial data
   */
  data: { 
    innerChoices: []
  },

  ready: function () {
    let that = this;
    let data = that.data;

    that.dataInitialize();
  },

  /**
   * Component methods
   */
  methods: {
    dataInitialize: function () {
      let that = this;
      let data = that.data;

      data.innerChoices = [];

      // constructiton 
      for (let i = 0, len = data.choices.length; i < len; ++i) {
        data.innerChoices.push({
          text: data.choices[i],
          ifChosen: false
        })
      }

      // initialization
      let atLeastOneChoice = false;
      for (let i = 0, len = data.defaultChoices.length; i < len; ++i) {
        for (let j = 0, jLen = data.innerChoices.length; j < jLen; ++j) {
          if (data.defaultChoices[i] == data.innerChoices[j].text) {
            data.innerChoices[j].ifChosen = true;
            atLeastOneChoice = true;
            break;
          }
        }

        // for radio, only choosing the first valid one
        if (atLeastOneChoice == true && data.selectionType == 'radio') {
          break;
        }
      }

      that.setData(data);
    },
    chooseFromSelection: function (event) {
      let that = this;
      let data = that.data;

      let chosenIndx = event.currentTarget.dataset.indx;

      if (data.selectionType == 'radio') {
        if (data.innerChoices[chosenIndx].ifChosen == true) return;

        for (let i = 0, len = data.innerChoices.length; i < len; ++i) {
          data.innerChoices[i].ifChosen = false;
        }
        data.innerChoices[chosenIndx].ifChosen = true;
      }

      else {
        data.innerChoices[chosenIndx].ifChosen = !data.innerChoices[chosenIndx].ifChosen;
      }

      that.setData(data);

      // trigger event
      that.selectionChanged();
    },

    selectionChanged: function () {
      let that = this;
      let data = that.data;

      let currentChoices = [];

      for (let i = 0, len = data.innerChoices.length; i < len; ++i) {
        if (data.innerChoices[i].ifChosen) {
          currentChoices.push(data.innerChoices[i].text);
        }
      }

      that.triggerEvent('wnselectionchanged', {
        result: {
          selectionType: data.selectionType,
          value: currentChoices
        }
      })
    }
  }
})
