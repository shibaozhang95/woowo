// pages/housingList/components/filterBubble/filterBubble.js
Component({
  /**
   * Component properties
   */
  properties: {
    filterBubbleData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal, changedPath) {
        let that = this;

        that._refresh();
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    showingList: []
  },

  /**
   * Component methods
   */
  methods: {
    _refresh: function () {
      let that = this;
      let data = that.data;

      let filterList = data.filterBubbleData.filterList 
        ? data.filterBubbleData.filterList : [];
      data.showingList = [];

      for (let i = 0, len = filterList.length; i < len; ++i) {
        let showingItem = {};
        showingItem.icon = filterList[i].titleIconUrl;
        let ls = [];

        for (let j = 0, jLen = filterList[i].choices.length; j < jLen; ++j) {
          if (filterList[i].choices[j].ifChosen) {
            ls.push(filterList[i].choices[j].text);
          }
        }
        showingItem.value = ls.join('/');

        if (showingItem.value.length > 0) {
          data.showingList.push(showingItem);
        }        
      }

      that.setData(data);
    }
  }
})
