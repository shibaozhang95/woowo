// pages/index/components/menu/menu.js
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
    menu1: [{
      "iconUrl": "statics/icon_menu_business.png",
      "txt": "Woo商城",
      "code": "business"
    }, {
      "iconUrl": "statics/icon_menu_books.png",
      "txt": "二手书籍",
      "code": "books"
    }, {
      "iconUrl": "statics/icon_menu_furnitures.png",
      "txt": "家具电器",
      "code": "appliances"
    }, {
      "iconUrl": "statics/icon_menu_digitals.png",
      "txt": "3C数码",
      "code": "digitals"
    },  {
      "iconUrl": "statics/icon_menu_clothes.png",
      "txt": "服饰搭配",
      "code": "clothes"
    }, {
      "iconUrl": "statics/icon_menu_makeups.png",
      "txt": "护肤美妆",
      "code": "makeups"
    }, {
      "iconUrl": "statics/icon_menu_living.png",
      "txt": "生活用品",
      "code": "livings"
    }],

    menu2: [{
      "iconUrl": "statics/icon_menu_cars.png",
      "txt": "二手车",
      "code": "cars"
    }, {
      "iconUrl": "statics/icon_menu_creatures.png",
      "txt": "动植物",
      "code": "creatures"
    }, {
      "iconUrl": "statics/icon_menu_service.png",
      "txt": "生活服务",
      "code": "service"
    }, {
      "iconUrl": "statics/icon_menu_others.png",
      "txt": "其他",
      "code": "others"
    }]
  },

  /**
   * Component methods
   */
  methods: {
    searchWithMainCat: function (event) {  
      let code = event.currentTarget.dataset.code;
      let mainCat = event.currentTarget.dataset.mainCat;

      if (code == 'business') {
        wx.navigateTo({
          url: "/pages/businessGoodsList/businessGoodsList"
        })
        // wx.navigateTo({
        //   url: "/pages/shopInfo/shopInfo"
        // })
      }

      else {
        wx.navigateTo({
          url: "/pages/goodsList/goodsList?mainCat=" + mainCat,
        })
      }
    },
  }
})
