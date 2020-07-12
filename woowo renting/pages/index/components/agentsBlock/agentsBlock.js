const util = require('../../../../utils/util');

// pages/index/components/agentsBlock/agentsBlock.js
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    agentsList: [],

    ifLoading: false,
    ifNothing: false,
  },

  ready: function () {
    let that = this;

    that.requestForHotAgents();
  },

  /**
   * Component methods
   */
  methods: {
    requestForHotAgents: function () {
      let that = this;
      let data = that.data;

      data.ifLoading = true;
      that.setData(data);

      util.requestHotAgents('hot').then(res => {
        if (res.code == 0) {
          data.ifLoading = false;

          data.agentsList = res.data;

          if (data.agentsList.length == 0) {
            data.ifNothing = true;
          }
        }
        else {
          data.ifNothing = true;

          wx.showToast({
            title: '请求优质中介时出错了。',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast();
              }, 2000);
            }
          })
        }

        that.setData(data);
      })
    },

    goToAgents: function () {
      wx.navigateTo({
        url: '../../../../housingList/housingList?agentsPage=true'
      })
    }
  }
})
