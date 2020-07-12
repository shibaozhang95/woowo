import OneArea from "./area";

export default class Filter {

  areas = [];
  areasText = '';

  type = {
    title: '出租类型',
    fieldName: 'type',
    titleIconUrl: '',
    choices: [{
      text: '整租',
      ifChosen: false,
      value: '整租'
      }, {
      text: '合租',
      ifChosen: false,
      value: '合租'
      }, {
      text: '短租',
      ifChosen: false,
      value: '短租'
    }]
  };

  rentType = {
    title: '房型',
    fieldName: 'rentType',
    titleIconUrl: '',
    choices: [{
      text: '房屋',
      ifChosen: false,
      value: '房屋'
    }, {
      text: '公寓',
      ifChosen: false,
      value: '公寓'
    }, {
      text: '工作室',
      ifChosen: false,
      value: '工作室'
    }]
  };

  bedroomNum = {
    title: '卧室',
    fieldName: 'bedroomNum',
    titleIconUrl: '',
    choices: [{
      text: '一居',
      ifChosen: false,
      value: '1'
    }, {
      text: '两居',
      ifChosen: false,
      value: '2'
    }, {
      text: '三居',
      ifChosen: false,
      value: '3'
    }, {
      text: '四居',
      ifChosen: false,
      value: '4'
    }, {
      text: '四+',
      ifChosen: false,
      value: '5'
    }]
  };

  bathroomNum = {
    title: '卫浴',
    fieldName: 'bathroomNum',
    titleIconUrl: '',
    choices: [{
      text: '一卫',
      ifChosen: false,
      value: '1'
    }, {
      text: '两卫',
      ifChosen: false,
      value: '2'
    }, {
      text: '三卫',
      ifChosen: false,
      value: '3'
    }, {
      text: '四卫',
      ifChosen: false,
      value: '4'
    }, {
      text: '四+',
      ifChosen: false,
      value: '5'
    }]
  };

  parkingNum = {
    title: '车位',
    fieldName: 'parkingNum',
    titleIconUrl: '',
    choices: [{
      text: '一个',
      ifChosen: false,
      value: '1'
    }, {
      text: '两个',
      ifChosen: false,
      value: '2'
    }, {
      text: '三个',
      ifChosen: false,
      value: '3'
    }, {
      text: '四个',
      ifChosen: false,
      value: '4'
    }, {
      text: '四+',
      ifChosen: false,
      value: '5'
    }]
  };

  agentSortValue = 0;
  // 0 mix
  // 1 only agent
  // 2 only personal
  
  pricePerWeekLow = -1;
  pricePerWeekHigh = -1;

  filterList = [this.type, this.rentType, this.bedroomNum
    , this.bathroomNum, this.parkingNum];    // for showing

  orderStr = '';   // priceLH,priceHL

  constructor () {
    console.log(this);
  }

  updateFromFilterComponent (filterData) {
    this.filterList = filterData.filterList;
    this.pricePerWeekHigh = filterData.pricePerWeekHigh;
    this.pricePerWeekLow = filterData.pricePerWeekLow;
  }

  initializeType (type) {
    for (let i = 0, len = this.type.choices.length; i < len; ++i) {
      if (type == this.type.choices[i].text) {
        this.type.choices[i].ifChosen = true;
        return;
      }
    }
  }

  updateFilterAreas (areas) {
    this.areas = areas;
    // updating the text
    let list = [];
    for (let i = 0, len = this.areas.length; i < len; ++i) {
      list.push(this.areas[i].locality);
    }

    this.areasText = list.join('; ');
  }

  changeTheOrderWay (newOrderWay) {
    this.orderStr = newOrderWay;
  }

  addCompanyAsFilter (companyId) {
    this.companyId = companyId
  }

  changeAgentSortValue (value) {
    this.agentSortValue = value;
  }

  formatFilter () {
    let tempFormatFilter = {};
    let formatFilter = {};

    for (let i = 0, len = this.filterList.length; i < len; ++i) {
      let fieldName = this.filterList[i].fieldName;
      let ls = [];
      for (let j = 0, jLen = this.filterList[i].choices.length; j < jLen; ++j) {
        if (this.filterList[i].choices[j].ifChosen) {
          ls.push(this.filterList[i].choices[j].value);
        }
      }

      tempFormatFilter[fieldName] = ls.join(',');
      if (tempFormatFilter[fieldName].length > 0) {
        formatFilter[fieldName] = tempFormatFilter[fieldName];
      }
    }

    if (this.pricePerWeekLow > -1) {
      formatFilter['pricePerWeekLow'] = this.pricePerWeekLow;
    }
    if (this.pricePerWeekHigh > -1) {
      formatFilter['pricePerWeekHigh'] = this.pricePerWeekHigh;
    }
    if (this.orderStr.length > 0) {
      formatFilter['orderStr'] = this.orderStr;
    }
    
    // this is for state and suburb
    if (this.areas.length > 0) {
      let localities = [];
      let states = [];
      for (let i = 0, len = this.areas.length; i < len; ++i) {
        localities.push(this.areas[i].locality);
        states.push(this.areas[i].state)
      }

      formatFilter['suburb'] = localities.join(',');
      formatFilter['state'] = states.join(',');
    }

    // for agents
    if (this.companyId) {
      formatFilter['companyId'] = this.companyId;
    }

    // for agent sort
    if (this.agentSortValue == 1) {
      formatFilter['interOnly'] = true;
    }
    else if (this.agentSortValue == 2) {
      formatFilter['interOnly'] = false;
    }

    return formatFilter;
  }
}