export default class Icons {

  indoor = [{
    title: '空调',
    iconUrl: '/statics/icons/icon_indoor_facilities_aircon.png',
    ifChosen: false
  },{
    title: '烤箱',
    iconUrl: '/statics/icons/icon_indoor_facilities_oven.png',
    ifChosen: false
  }, {
    title: '洗碗机',
    iconUrl: '/statics/icons/icon_indoor_facilities_dishwasher.png',
    ifChosen: false
  }, {
    title: '微波炉',
    iconUrl: '/statics/icons/icon_indoor_facilities_microwave.png',
    ifChosen: false
  }];

  furniture = [{
    title: '洗衣机',
    iconUrl: '/statics/icons/icon_furniture_washingmachine.png',
    ifChosen: false
  }, {
    title: '烘干机',
    iconUrl: '/statics/icons/icon_furniture_dryer.png',
    ifChosen: false
  }, {
    title: '梳妆台',
    iconUrl: '/statics/icons/icon_furniture_makeup.png',
    ifChosen: false
  }, {
    title: '冰箱',
    iconUrl: '/statics/icons/icon_furniture_frige.png',
    ifChosen: false
  }, {
    title: '床',
    iconUrl: '/statics/icons/icon_furniture_bed.png',
    ifChosen: false
  }, {
    title: '床头柜',
    iconUrl: '/statics/icons/icon_furniture_bedsidetable.png',
    ifChosen: false
  }, {
    title: '衣柜',
    iconUrl: '/statics/icons/icon_furniture_closet.png',
    ifChosen: false
  }, {
    title: '浴缸',
    iconUrl: '/statics/icons/icon_furniture_bathtub.png',
    ifChosen: false
  }, {
    title: '电视',
    iconUrl: '/statics/icons/icon_furniture_tv.png',
    ifChosen: false
  }, {
    title: '沙发',
    iconUrl: '/statics/icons/icon_furniture_sofa.png',
    ifChosen: false
  }, {
    title: '学习桌',
    iconUrl: '/statics/icons/icon_furniture_desk.png',
    ifChosen: false
  }, {
    title: '椅子',
    iconUrl: '/statics/icons/icon_furniture_chair.png',
    ifChosen: false
  }, {
    title: '书柜',
    iconUrl: '/statics/icons/icon_furniture_bookcase.png',
    ifChosen: false
  }, {
    title: '吹风机',
    iconUrl: '/statics/icons/icon_furniture_hairdryer.png',
    ifChosen: false
  }];

  public = [{
    title: '监控',
    iconUrl: '/statics/icons/icon_building_facilities_cctv.png',
    ifChosen: false
  }, {
    title: '健身房',
    iconUrl: '/statics/icons/icon_building_facilities_gym.png',
    ifChosen: false
  }, {
    title: 'BBQ',
    iconUrl: '/statics/icons/icon_building_facilities_bbq.png',
    ifChosen: false
  }, {
    title: '游泳池',
    iconUrl: '/statics/icons/icon_building_facilities_pool.png',
    ifChosen: false
  }, {
    title: '空中花园',
    iconUrl: '/statics/icons/icon_building_facilities_garden.png',
    ifChosen: false
  }, {
    title: '桑拿房',
    iconUrl: '/statics/icons/icon_building_facilities_steaming.png',
    ifChosen: false
  }, {
    title: '瑜伽室',
    iconUrl: '/statics/icons/icon_building_facilities_yoga.png',
    ifChosen: false
  }, {
    title: '休闲娱乐',
    iconUrl: '/statics/icons/icon_building_facilities_entertainment.png',
    ifChosen: false
  }];

  nearby = [{
    title: '超市',
    iconUrl: '/statics/icons/icon_nearby_supermarket.png',
    ifChosen: false
  }, {
    title: '电车站',
    iconUrl: '/statics/icons/icon_nearby_tramstation.png',
    ifChosen: false
  }, {
    title: '火车站',
    iconUrl: '/statics/icons/icon_nearby_trainstation.png',
    ifChosen: false
  }, {
    title: '巴士站',
    iconUrl: '/statics/icons/icon_nearby_busstation.png',
    ifChosen: false
  }, {
    title: '加油站',
    iconUrl: '/statics/icons/icon_nearby_gasstation.png',
    ifChosen: false
  }, {
    title: '咖啡厅',
    iconUrl: '/statics/icons/icon_nearby_coffee.png',
    ifChosen: false
  }, {
    title: '健身房',
    iconUrl: '/statics/icons/icon_nearby_gym.png',
    ifChosen: false
  }, {
    title: '图书馆',
    iconUrl: '/statics/icons/icon_nearby_library.png',
    ifChosen: false
  }, {
    title: '公园',
    iconUrl: '/statics/icons/icon_nearby_garden.png',
    ifChosen: false
  }, {
    title: '篮球馆',
    iconUrl: '/statics/icons/icon_nearby_basketballcourt.png',
    ifChosen: false
  }, {
    title: '足球场',
    iconUrl: '/statics/icons/icon_nearby_footballfield.png',
    ifChosen: false
  }, {
    title: '医院',
    iconUrl: '/statics/icons/icon_nearby_hospital.png',
    ifChosen: false
  }];

  bills = [{
    title: 'WiFi',
    iconUrl: '/statics/icons/icon_bill_wifi.png',
    ifChosen: false
  }, {
    title: '水费',
    iconUrl: '/statics/icons/icon_bill_water.png',
    ifChosen: false
  }, {
    title: '电费',
    iconUrl: '/statics/icons/icon_bill_electricity.png',
    ifChosen: false
  }, {
    title: '煤气费',
    iconUrl: '/statics/icons/icon_bill_gas.png',
    ifChosen: false
  }]


  iconPriority = ['public', 'nearby', 'bills', 'furniture', 'indoor']
  
  getDetailShowingIcons (chosenIcons) {
    let resIcons = [];

    for (let i = 0, len = this.iconPriority.length; i < len; ++i) {
      let currField = this.iconPriority[i];

      let chosenList = chosenIcons[currField].split(';');
      let allList = this[currField];

      for (let k = 0, kLen = chosenList.length; k < kLen; ++k) {
        for (let p = 0, pLen = allList.length; p < pLen; ++p) {
          if (chosenList[k] == allList[p].title) {
            resIcons.push(allList[p]);
          }
        }
      }
    }

    return resIcons;
  }

  getAllShowingIcons (chosenIcons) {
    let resIcons = {};

    Object.getOwnPropertyNames(chosenIcons).forEach(key => {
      // console.log(chosenIcons[key]);
      // return;
      let currList = chosenIcons[key].split(';');
      
      resIcons[key] = [];

      for (let i = 0, len = currList.length; i < len; ++i) {
        for (let j = 0, jLen = this[key].length; j < jLen; ++j) {
          if (currList[i] == this[key][j].title) {
            resIcons[key].push(this[key][j]);
          }
        }
      }
      
    });

    return resIcons;
  }
}