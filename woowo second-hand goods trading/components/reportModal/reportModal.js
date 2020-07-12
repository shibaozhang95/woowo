Component({
  properties: {
    ifShowReportModal: {
      type: Boolean,
      value: false
    }
  },
  data: {
    reportReasons: [{
      title: '发布虚假信息',
      ifChosen: true
    }, {
      title: '产品涉嫌违法',
      ifChosen: false
    }, {
      title: '存在侵权行为',
      ifChosen: false
    }, {
      title: '存在欺诈行为',
      ifChosen: false
    }, {
      title: '其他',
      ifChosen: false
    }],

    ifOtherReasons: false,

    otherReasons: ''
  },

  methods: {
    inputOtherReason: function (event) {
      let that = this;

      console.log(event.detail.value)
      that.setData({
        otherReasons: event.detail.value.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '')
      })

      console.log(that.data.otherReasons)
    },
    chooseAReason: function (event) {
      let that = this;
      let index = event.currentTarget.dataset.reasonIndex;
      let ifOtherReasons = false;

      let reasons = that.data.reportReasons;
      // initiate
      for (let i = 0, len = reasons.length; i < len; ++i) {
        reasons[i].ifChosen = false
      }

      reasons[index].ifChosen = true;
      ifOtherReasons = (reasons[index].title == '其他' ? true : false)

      that.setData({
        'reportReasons': reasons,
        'ifOtherReasons': ifOtherReasons
      })
    },

    confirmReport: function () {
      let that = this;

      let check = that.checkReportReasons();

      if (!check.ifPass) {
        wx.showToast({
          title: check.errMsg,
          mask: true,
          icon: 'none',
          success: function() {
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }
        })
      }

      else {
        that.triggerEvent('report', {
          content: check.reason,
          type: '举报'
        })
      }
      
    },

    checkReportReasons: function () {
      let that = this;
      
      if (that.data.ifOtherReasons) {
        if (that.data.otherReasons.length == 0) {
          return {
            ifPass: false,
            errMsg: '请输入举报原因'
          }
        }
        else {
          return {
            ifPass: true,
            reason: that.data.otherReasons
          }
        }
      }

      for (let i = 0, len = that.data.reportReasons.length; i < len; ++i) {
        if (that.data.reportReasons[i].ifChosen) {
          return {
            ifPass: true,
            reason: that.data.reportReasons[i].title
          }
        }
      }

      return {
        ifPass: false,
        errMsg: '未能找到举报原因'
      }
    },
    cancelReport: function () {
      let that = this;

      that.setData({
        ifShowReportModal: false
      })
    }
  }
})