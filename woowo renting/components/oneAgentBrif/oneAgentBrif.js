// components/oneAgentBrif/oneAgentBrif.js
Component({
  /**
   * Component properties
   */
  properties: {
    companyInfo: {
      type: Object,
      value: {
        account_name: '',
        id: '',
        include_inter: [],
        level: 0,
        logo: [],
        name: ''
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    roundLogoUrl: ''
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.companyInfo.logo = data.companyInfo.logo.split(';');

    data.roundLogoUrl = data.companyInfo.logo[0];

    that.setData(data);
  },

  /**
   * Component methods
   */
  methods: {
    goToCompany: function (event) {
      console.log(event);

      let companyInfo = event.currentTarget.dataset.companyInfo;

      wx.navigateTo({
        url: '../../pages/housingList/housingList?agentsPage=true&companyInfo=' + JSON.stringify(companyInfo)
      })
    }
  }
})
