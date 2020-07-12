import OneArea from "./area";

export default class FilterForHm {
  area = [];
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

  filterList = [this.type, this.rentType];

  ifCookOpts = ['不限', '是', '否'];
  ifDefaultCook = '不限';
  ifCookValue = this.ifDefaultCook;
  ifSmokeOpts = ['不限', '是', '否'];
  ifDefaultSmoke = '不限';
  ifSmokeValue = this.ifDefaultSmoke;
  ifPetsOpts = ['不限', '是', '否'];
  ifDefaultPet = '不限';
  ifPetValue = this.ifDefaultPet;

  pricePerWeekLow = -1;
  pricePerWeekHigh = -1;

  sexOpts = ['仅限男', '仅限女', '仅限单人', '不限性别'];
  sexValue = '不限';

  schoolsRange = ['墨大/RMIT', '莫纳什(Caulfield)', '莫纳什(Clayton)', '迪肯(Burwood)', '墨大(Southbank)', '不限学区'];
  schoolValue = -1;

  schools = [{
    schoolName: '墨大/RMIT',
    suburb: 'North Melbourne,Parkville,Carlton,Melbourne,Fitzroy',
    state: 'VIC',
    country: 'Australia'
  }, {
    schoolName: '莫纳什(Caulfield)',
    suburb: 'Carnegie,Glen Huntly,Malvern East,Balaclava,Caulfield North,Caulfield East,Murrumbeena,St. Kilda,Prahran',
    state: 'VIC',
    country: 'Australia'
  }, {
    schoolName: '莫纳什(Clayton)',
    suburb: 'Notting Hill,Mulgrave,Clayton,Clayton North,Clayton South,Oakleigh',
    state: 'VIC',
    country: 'Australia'
  }, {
    schoolName: '迪肯(Burwood)',
    suburb: 'Burwood East,Box Hill South,Camberwell,Ashburton,Box Hill,Blackburn South,Mont Albert',
    state: 'VIC',
    country: 'Australia'
  }, {
    schoolName: '墨大(Southbank)',
    suburb: 'Southbank,South Melbourne,South Yarra,Melbourne',
    state: 'VIC',
    country: 'Australia'
  }];

  addAreasForSchool () {
    let newAreas = [];

    if (this.schoolValue >= 0 && this.schoolValue < this.schools.length) {
      let suburbLs = this.schools[this.schoolValue].suburb.split(',');
      let state = this.schools[this.schoolValue].state;
      let country = this.schools[this.schoolValue].country;

      for (let i = 0, len = suburbLs.length; i < len; ++i) {
        let oneArea = [suburbLs[i], state, country]
        newAreas.push(oneArea.join(','));
      }
    }

    return newAreas;
  }

  updateTheWholeFilter (obj) {
    this.type.choices = obj.filterList[0].choices;
    this.rentType.choices = obj.filterList[1].choices;
    this.pricePerWeekLow = obj.pricePerWeekLow;
    this.pricePerWeekHigh = obj.pricePerWeekHigh;
    this.ifCookValue = obj.ifCookValue;
    this.ifSmokeValue = obj.ifSmokeValue;
    this.ifPetValue = obj.ifPetValue;
  }

  updateWithFieldName (fieldName, value) {
    this[fieldName] = value;
  }

  formatFilter () {
    let formatFilter = {};

    // for areas
    let areasLs = [];
    for (let i = 0, len = this.area.length; i < len; ++i) {
      let oneArea = [this.area[i].locality, this.area[i].state, this.area[i].country];
      areasLs.push(oneArea.join(','));
    }
    // for school areas
    let schoolAreasLs = this.addAreasForSchool();
    areasLs = areasLs.concat(schoolAreasLs);

    if (areasLs.length > 0) {
      formatFilter.area = areasLs.join(';');
    }

    // for type
    let typesLs = [];
    for (let i = 0, len = this.type.choices.length; i < len; ++i) {
      if (this.type.choices[i].ifChosen) {
        typesLs.push(this.type.choices[i].value);
      }
    }
    if (typesLs.length > 0) {
      formatFilter.type = typesLs.join(';');
    }

    // for rentType
    let rentTypesLs = [];
    for (let i = 0, len = this.rentType.choices.length; i < len; ++i) {
      if (this.rentType.choices[i].ifChosen) {
        rentTypesLs.push(this.rentType.choices[i].value);
      }
    }
    if (rentTypesLs.length > 0) {
      formatFilter.rentType = rentTypesLs.join(';');
    }

    //['仅限男', '仅限女', '仅限单人', '不限'];
    // for sex
    if (this.sexValue == '仅限男') {
      formatFilter.sex = '男';
    }
    else if (this.sexValue == '仅限女') {
      formatFilter.sex = '女';
    }
    else if (this.sexValue == '仅限单人') {
      formatFilter.sex = '男;女';
    }

    // for Price
    if (this.pricePerWeekLow > -1) {
      formatFilter.pricePerWeekLow = this.pricePerWeekLow;
    }
    if (this.pricePerWeekHigh > -1) {
      formatFilter.pricePerWeekHigh = this.pricePerWeekHigh;
    }

    // for rules
    if (this.ifCookValue != '不限') {
      formatFilter.ifCook 
        = this.ifCookValue == '是' ? true : false;
    }
    if (this.ifSmokeValue != '不限') {
      formatFilter.ifSmoke 
        = this.ifSmokeValue == '是' ? true : false;
    }
    if (this.ifPetValue != '不限') {
      formatFilter.ifPet 
        = this.ifPetValue == '是' ? true : false;
    }

    return formatFilter;
  }
}