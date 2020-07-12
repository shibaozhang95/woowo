import OneArea from './area'

export default class woowoHousemate {
  id = '';

  wx_unionid = '';
  userInfo = {};

  phone = '';
  wx_id = '';
  wx_qr = '';

  sex = '';
  career = '';
  age = '';

  availableDate = 0;
  imgList = '';

  area = '';

  description = '';

  priceLow = 0;
  priceHigh = 0;

  type = '';        // 整租/合租/短租
  rentType = '';    // 公寓/房屋/studio

  ifCook = false;
  ifSmoke = false;
  ifPet = false;

  uploadTime = 0;

  constructor () {
    
  }

  formatDataFromServer (housemateInfo) {
    this.id = housemateInfo.id;
    
    this.wx_unionid = housemateInfo.wx_unionid;
    this.userInfo = JSON.parse(housemateInfo.userInfo);
    this.userInfo.username = decodeURIComponent(this.userInfo.username);

    this.uploadTime = Number(housemateInfo.uploadTime);

    this.phone = housemateInfo.phone;
    this.wx_id = housemateInfo.wx_id;
    this.wx_qr = housemateInfo.wx_qr;

    this.sex = housemateInfo.sex;
    this.career = housemateInfo.career;
    this.age = housemateInfo.age;

    this.availableDate = Number(housemateInfo.availableDate);
    this.imgList = housemateInfo.imgList;

    this.area = housemateInfo.area;
    this.description = decodeURI(housemateInfo.description);

    this.priceLow = Number(housemateInfo.priceLow);
    this.priceHigh = Number(housemateInfo.priceHigh);

    this.type = housemateInfo.type;
    this.rentType = housemateInfo.rentType;

    this.ifCook = housemateInfo.ifCook == '1' ? true : false;
    this.ifSmoke = housemateInfo.ifSmoke == '1' ? true : false;
    this.ifPet = housemateInfo.ifPet == '1' ? true : false;
  }

  formatToShowingData () {
    let id = this.id;
    let wx_unionid = this.wx_unionid;
    let userInfo = this.userInfo;
    let phone = this.phone;
    let wx_id = this.wx_id;
    let wx_qr = this.wx_qr;

    let sex = this.sex;
    let sexShortcut = sex;
    if (sexShortcut.includes('双人')) sexShortcut = '双人';

    let career = this.career;
    let age = this.age;

    let uploadTime = this.paresTime(this.uploadTime);

    let availableDate = this.parseDate(this.availableDate);
    let imgList = 
      this.imgList.length == 0 ? [] : this.imgList.split(';');
    
    let localityLs = [];
    let areasLs = this.area.split(';');
    for (let i = 0, len = areasLs.length; i < len; ++i) {
      let oneArea = areasLs[i].split(',');
      localityLs.push(oneArea[0])
    }
    let areasShortcut = localityLs.join('/');

    let description = this.description;
    let priceLow = this.priceLow;
    let priceHigh = this.priceHigh;

    let typeShorcut = this.type.replace(';', ' / ');
    let rentTypeShortcut = this.rentType.replace(';', ' / ');

    let ifCook = this.ifCook;
    let ifSmoke = this.ifSmoke;
    let ifPet = this.ifPet;

    return {
      id: id,
      wx_unionid: wx_unionid,
      userInfo: userInfo,
      phone: phone,
      wx_id: wx_id,
      wx_qr: wx_qr,
      sex: sex,
      sexShortcut: sexShortcut,
      career: career,
      age: age,
      availableDate: availableDate,
      imgList, imgList,
      areasShortcut: areasShortcut,
      description: description,
      priceLow: priceLow,
      priceHigh: priceHigh,
      typeShortcut: typeShorcut,
      rentTypeShortcut: rentTypeShortcut,
      ifCook: ifCook,
      ifSmoke: ifSmoke,
      ifPet: ifPet,

      uploadTime: uploadTime
    }
  }

  paresTime (timestampe) {
    let dateStr = this.parseDate(timestampe);

    let time = new Date(Number(timestampe));

    let hours = time.getHours();
    let minuts = time.getMinutes();

    return dateStr + ' ' + hours + ':' + minuts;
  }

  parseDate (timestampe) {
    let date = new Date(Number(timestampe));
    
    let year = date.getFullYear();
    let monthIndex = date.getMonth();
    let day = date.getDate();

    return year + '/' + (monthIndex+1) + '/' + day
  }

  updateWithFieldName (fieldName, value) {
    this[fieldName] = value;
  }

  getAreasList () {
    let areas = [];
    let areasLs = this.area.split(';');

    for (let i = 0, len = areasLs.length; i < len; ++i) {
      let area = areasLs[i].split(',');
      areas.push(new OneArea(area[0], area[1], area[2]))
    }

    return areas;
  }
}