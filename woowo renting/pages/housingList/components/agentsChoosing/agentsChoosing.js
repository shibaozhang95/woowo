const app = getApp();
const util = require('../../../../utils/util');

const AGENT_BLOCK_WIDTH = 600; // rpx

// pages/housingList/components/agentsChoosing/agentsChoosing.js
Component({
  /**
   * Component properties
   */
  properties: {
    ifShowAgentsChoosing: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        let that = this;

        if (newVal == true) {
          that.triggerAgentsAnimation(0);
        }
        else {
          that.triggerAgentsAnimation(-AGENT_BLOCK_WIDTH);
        }
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    windowWidth: 0,
    windowHeight: 0,
    topPos: 0,

    ifLoading: false,
    ifNothing: false,
    agentsList: [],

    agentsAnimation: {}
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.windowWidth = app.globalData.windowWidth;
    data.windowHeight = app.globalData.windowHeight;
    let ifCustomNavigation = app.globalData.ifCustomNavigation;
    let navHeight = app.globalData.navHeight;

    if (ifCustomNavigation) {
      data.windowHeight -= navHeight;
      data.topPos = navHeight;
    }

    that.requestForAllAgents();

    // for animation
    that.agentsAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    requestForAllAgents: function () {
      let that = this;
      let data = that.data;

      data.ifLoading = true;
      that.setData(data);

      util.requestHotAgents('all').then(res => {
        if (res.code == 0) {
          data.ifLoading = false;

          data.agentsList = res.data;

          // change to round logo
          for (let i = 0, len = data.agentsList.length; i < len; ++i) {
            let logos = data.agentsList[i].logo.split(';')
            data.agentsList[i].roundLogo = logos[0];
            data.agentsList[i].squareLogo = logos[1] ? logos[1] : '';
            
          }

          if (data.agentsList.length == 0) {
            data.ifNothing = true;
          }
        }
        else {
          data.ifNothing = true;

          wx.showToast({
            title: '请求中介列表时出错了。',
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

    chooseACompany: function (event) {
      let that = this;

      let companyInfo = event.currentTarget.dataset.companyInfo;

      that.triggerEvent('agentchosencomplete', {
        ifChosen: true,
        companyInfo: companyInfo
      })
    },

    cancleChoosing: function () {
      let that = this;

      console.log('cancel choosing')
      that.triggerEvent('agentchosencomplete', {
        ifChosen: false
      })
    },

    triggerAgentsAnimation: function (right) {
      let that = this;

      that.agentsAnimation.right(right + 'rpx').step();

      that.setData({
        agentsAnimation: that.agentsAnimation.export()
      })
    }
  }
})
