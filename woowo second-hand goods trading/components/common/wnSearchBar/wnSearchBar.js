// components/common/wnSearchBar/wnSearchBar.js
Component({
  /**
   * Component properties
   */
  properties: {
    initPlaceholder: {
      type: String,
      value: '搜索'
    },
    initKeyword: {
      type: String,
      value: ''
    },
    confirmTypeText: {
      type: String,
      value: '搜索'
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    inputConfirm: function (event) {
      let that = this;

      let keyword = event.detail.value;

      that.triggerEvent('confirmsearch', {
        keyword: keyword
      })

    }
  }
})
