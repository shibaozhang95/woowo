// edibleAreasSearchBar.js
Component({
  /**
   * Component properties
   */
  properties: {
    chosenAreasList: {
      type: Array,
      value: []
    },

    resetValue: {
      type: Boolean,
      value: false,

      observer: function (newVal, oldVal) {
        let that = this;
        console.log('rese value')
        that.setData({
          areakeyWord: '',
          ifGetFocus: true
        })

        console.log(that.data.areakeyWord)
      }
    }
  },

  /**
   * Component initial data
   */
  data: { 
    areakeyWord: String,
    ifGetFocus: true
  },

  /**
   * Component methods
   */
  methods: {
    searchNewArea: function (event) {
      let that = this;

      that.setData({
        areakeyWord: event.detail.value
      })

      that.triggerEvent('newareasearch', {keyword: event.detail.value})
      // console.log(event.detail.value);
    },

    deleteOne: function (event) {
      let that = this;

      // console.log(event);
      let index = event.currentTarget.dataset.areaIndex;
      
      that.triggerEvent('deletechosen', {deleteIndex: index})

    }
  }
})
