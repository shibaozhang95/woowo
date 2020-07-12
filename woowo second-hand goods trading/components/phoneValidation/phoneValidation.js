Component ({
  properties: {
    ifShowValidation: {
      type: Boolean,
      value: false
    }
  },

  data: {
    inputValidateCode: String
  },

  methods: {
    confirmValidate: function () {
      let that = this;
      
      that.triggerEvent('confirm', {'inputValidateCode': that.data.inputValidateCode});
    },
    inputCode: function (event) {
      console.log(event)
      let that = this;

      that.setData({
        inputValidateCode: event.detail.value
      })
      console.log(that.data)
    },
    cancelValidate: function () {
      let that = this;

      that.setData({
        ifShowValidation: false
      })
    }
  }
})