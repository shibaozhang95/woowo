// indexMenu.js
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
    menus: [{
      iconUrl: '/statics/images/icon_menu_rent.png',
      url: '/pages/housingList/housingList?menu=整组',
      text: '整租',
      value: '整租',
      avaliable: true
    }, {
      iconUrl: '/statics/images/icon_menu_share_rent.png',
      url: '/pages/housingList/housingList?menu=合租',
      text: '合租',
      value: '合租',
      avaliable: true
    }, {
      iconUrl: '/statics/images/icon_menu_short_rent.png',
      url: '/pages/housingList/housingList?menu=短租',
      text: '旅途短租',
      value: '短租',
      avaliable: true
    }, {
      iconUrl: '/statics/images/icon_menu_find_housemate.png',
      diableIconUrl: '/statics/images/icon_menu_find_housemate_disable.png',
      url: '/pages/housemateList/housemateList',
      text: '求租',
      value: '求租',
      avaliable: true
    }]
  },

  /**
   * Component methods
   */
  methods: {
    fromMenuTo: function (event) {
      let value = event.currentTarget.dataset.value;
      let url = event.currentTarget.dataset.url;
      let ifAvaliable = event.currentTarget.dataset.ifAvaliable;

      if (!ifAvaliable) {

        wx.showToast({
          title: '暂未开通，敬请期待~',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.hideToast()
            }, 3000)
          }
        })

        return;
      }
      wx.navigateTo({
        url: url
      })
    }
  }
})
