import Icons from "./icons";
const _ = require('../utils/underscore-min');

export default class woowoHouse {
  houseId = '';
  type = '整租';  //整租, 合租, 短租
  userInfo = {};
  uploadTime = '';
  status = '';   
  // for the post house info: check/posted/deleted

  view = 0;
  liked = 0;
  /**
   *  #List Number: 图片
   */ 
  imageUrls = '';

  /**
   *  #List 1: 房屋位置
   */
  location = {
    street: '',
    suburb: '',  // Filter
    state: '',   // Filter
    postalCode: Number,

    latlng: '',

    unitNum: ''
  }

  /**
   *  #List 2: 设施服务
   */
  facilities = {
    indoor: '',
    furniture: '',
    public: '',
    nearby: ''
  }

  /**
   *  #List 3: 房屋描述
   */
  description = {
    rentType: '',  // Filter: 房屋类型: 公寓/房屋/studio
    houseType: {       
      bedroomNum: Number,  // Filter
      bathroomNum: Number, // Filter
      parkingNum: Number,  // Filter
    }, 
    houseArea: Number,
    houseTitle: '',
    houseDetail: '',
    roomInfo: {
      ifBathroom: false,
      ifWindows: false
    }
  }

  /**
   *  #List 4: 规则说明
   */
  rules = {
    avaliableDate: Number, // Filter
    expireDate: Number,    // Filter
    tenantRestrict: {
      ifMaleAllowed: false,
      ifFemaleAllowed: false,
      ifCookAllowed: false,
      ifSmookAllowed: false,
      ifPetsAllowed: false
    },
    others: ''
  }

  /**
   *  #List 5: 价格设置
   */
  price = {
    pricePerWeek: Number,  // Filter
    includedBills: ''
  }

   /**
   *  #List 6: 身份认证
   */
  contact = {
    phone: '',
    wechat: '',
    wechatCodeUrl: ''
  }

  /**
   *  FOR AGENT
   */
  companyId = ''
  companyDetail = {}
  
  constructor (houseInfo) {
    this.houseId = houseInfo.id ? 
      houseInfo.id : (houseInfo.houseId ? houseInfo.houseId : this.houseId);
    this.type = houseInfo.type ? houseInfo.type : this.type;
    this.userInfo = houseInfo.userInfo ? houseInfo.userInfo : this.userInfo;
    
    this.status = houseInfo.status ? houseInfo.status : this.status;
    this.uploadTime = houseInfo.uploadTime;
    this.view = houseInfo.view ? houseInfo.view : this.view;
    this.liked = houseInfo.liked ? houseInfo.liked : this.liked;

    this.imageUrls = houseInfo.imageUrls ? houseInfo.imageUrls : this.imageUrls;
    this.location = houseInfo.location ? houseInfo.location : this.location;
    this.facilities = houseInfo.facilities ? houseInfo.facilities : this.facilities;
    this.description = houseInfo.description ? houseInfo.description : this.description;
    this.rules = houseInfo.rules ? houseInfo.rules : this.rules;
    this.price = houseInfo.price ? houseInfo.price : this.price;
    this.contact = houseInfo.contact ? houseInfo.contact : this.contact;

    // agent company
    this.companyId = houseInfo.companyId ? houseInfo.companyId : this.companyId;
    this.companyDetail = houseInfo.companyDetail ? houseInfo.companyDetail : this.companyDetail;

    if (typeof(this.location) == 'string') 
      this.location = JSON.parse(this.location);
    if (typeof(this.facilities) == 'string') 
      this.facilities = JSON.parse(this.facilities);
    if (typeof(this.description) == 'string') 
      this.description = JSON.parse(this.description);
    if (typeof(this.rules) == 'string') 
      this.rules = JSON.parse(this.rules);
    if (typeof(this.price) == 'string') 
      this.price = JSON.parse(this.price);
    if (typeof(this.contact) == 'string') 
      this.contact = JSON.parse(this.contact);
    if (typeof(this.companyDetail) == 'string') 
      this.companyDetail = JSON.parse(this.companyDetail);

    // decode URIComponent for for editing
    try {
      this.description.houseTitle = decodeURIComponent(this.description.houseTitle);
    } catch (e) {}
    try {
      this.userInfo.username = decodeURIComponent(this.userInfo.username);
    } catch (e) {}
    try {
      this.contact.phone = decodeURIComponent(this.contact.phone);
    } catch (e) {}
    try {
      this.contact.wechat = decodeURIComponent(this.contact.wechat);
    } catch (e) {}
    try {
      this.description.houseDetail = decodeURIComponent(this.description.houseDetail);
    } catch (e) {}
    try {
      this.rules.others = decodeURIComponent(this.rules.others);
    } catch (e) {}
      
  }

  updateFromPostPageData (uploadingList) {
    for (let i = 0, len = uploadingList.length; i < len; ++i) {
      let fieldName = uploadingList[i].fieldName;

      this[fieldName] = uploadingList[i].fieldObj;
    }
  }

  updateCompanyInfo (companyDetail, companyId) {
    
    this.companyDetail = companyDetail;
    this.companyId = companyId;
  }

  formatToShowingData () {
    let houseId = this.houseId;
    let pricePerWeek = this.price.pricePerWeek;
    let houseTitle = this.description.houseTitle;
    // houseTitle = _.escape(decodeURIComponent(houseTitle));
    
    let view = Number(this.view);
    let liked = Number(this.liked);
    let imageUrls = this.imageUrls.split(';');
    let status = this.status;

    let houseHolderInfo = this.userInfo;
    if (typeof(houseHolderInfo) == 'string') houseHolderInfo = JSON.parse(decodeURIComponent(houseHolderInfo));
    // houseHolderInfo.username = decodeURIComponent(houseHolderInfo.username);

    let houseAddress = this.location.street + ', ' + this.location.suburb
      + ' ' + this.location.state;
    if (this.location.postalCode) {
      houseAddress = houseAddress + ' ' + this.location.postalCode;
    }
    if (this.location.unitNum) {
      houseAddress = this.location.unitNum + '/' + houseAddress;
    }

    let houseSuburb = this.location.suburb;

    let houseLatlng = this.location.latlng;

    // Need to change
    let postDate = this.paresTime(this.uploadTime);

    let rentType = this.type;  // 整租，合租，短租
    let rentType2 = this.description.rentType;  // 多少平米： 公寓，房子，工作室
    if (this.description.houseArea > 0) {
      houseType2 = this.description.houseArea + '㎡ / ';
    }
    
    let houseType = '';   // 几室，几卫，几车位
    if (this.description.houseType.bedroomNum > 0) {
      houseType += (this.description.houseType.bedroomNum + '室');
    }
    if (this.description.houseType.bathroomNum > 0) {
      houseType += (this.description.houseType.bathroomNum + '卫');
    }
    if (this.description.houseType.parkingNum > 0) {
      houseType += (this.description.houseType.parkingNum) + '车位'
    }
    let houseType2 = '';  // 出租房间信息
    let houseType2Ls = []
    if (this.description.roomInfo) {
      if (this.description.roomInfo.ifBathroom) {
        houseType2Ls.push('独立卫浴');
      }
      if (this.description.roomInfo.ifWindows) {
        houseType2Ls.push('有窗');
      }
    }
    houseType2 = houseType2Ls.join(',');

    let avaliableDate = this.parseDate(this.rules.avaliableDate);
    let expireDate = this.parseDate(this.rules.expireDate);

    // Contact info
    let phone = this.contact.phone;

    let wechat = this.contact.wechat;

    let wechatCodeUrl = this.contact.wechatCodeUrl;

    let houseDetail = this.description.houseDetail;

    let rules = {};
    rules.gender = '';
    if (this.rules.tenantRestrict.ifFemaleAllowed && this.rules.tenantRestrict.ifMaleAllowed) {
      rules.gender = '男女皆可';
    }
    else if (!this.rules.tenantRestrict.ifFemaleAllowed && !this.rules.tenantRestrict.ifMaleAllowed) {
      rules.gender = '男女皆可';
    }
    else {
      if (this.rules.tenantRestrict.ifMaleAllowed) {
        rules.gender = '仅限男生';
      }
      else {
        rules.gender = '仅限女生';
      }
    }
    rules.ifCookAllowed = this.rules.tenantRestrict.ifCookAllowed;
    rules.ifSmookAllowed = this.rules.tenantRestrict.ifSmookAllowed;
    rules.ifPetsAllowed = this.rules.tenantRestrict.ifPetsAllowed;
    rules.others = this.rules.others;
    // rules.others = decodeURIComponent(this.rules.others);

    // this is all about icon;
    let allIcons = {
      indoor: this.facilities.indoor,
      furniture: this.facilities.furniture,
      public: this.facilities.public,
      nearby: this.facilities.nearby,
      bills: this.price.includedBills
    }

    let detailShowingIcons = new Icons().getDetailShowingIcons(allIcons)

    //  For agent
    let ifAgent = false;
    let companyInfo = {};

    // console.log(this.companyId != '0');
    if (this.companyId != '0' && this.companyId) {
      ifAgent = true;

      let logos = this.companyDetail.logo.split(';');

      companyInfo = {
        companyId: this.companyId,
        name: this.companyDetail.name,
        level: this.companyDetail.level,
        roundLogo: logos[0],
        squareLogo: logos[1] ? logos[1] : ''
      }
    }

    return {
      houseId: houseId,
      imageUrls: imageUrls,   // Array
      pricePerWeek: pricePerWeek,
      houseTitle: houseTitle,
      status: status,
      view: view,
      liked: liked,
      houseHolderInfo: houseHolderInfo,
      houseAddress: houseAddress,
      houseLatlng: houseLatlng,
      postDate: postDate,
      rentType: rentType,
      rentType2: rentType2,
      houseType: houseType,
      houseType2: houseType2,
      avaliableDate: avaliableDate,
      expireDate: expireDate,

      contactPhone: phone,
      contactWechat: wechat,
      contactWechatCodeUrl: wechatCodeUrl,

      houseDetail: houseDetail,

      rules: rules,

      allIcons: allIcons,
      detailShowingIcons: detailShowingIcons,

      // for create QR Code
      houseSuburb: houseSuburb,

      // for agent
      ifAgent: ifAgent,
      companyInfo: companyInfo,
    }
  }

  parseDate (timestampe) {
    let date = new Date(Number(timestampe));
    
    let year = date.getFullYear();
    let monthIndex = date.getMonth();
    let day = date.getDate();

    return year + '/' + (monthIndex+1) + '/' + day
  }

  paresTime (timestampe) {
    let dateStr = this.parseDate(timestampe);

    let time = new Date(Number(timestampe));

    let hours = time.getHours();
    let minuts = time.getMinutes();

    return dateStr + ' ' + hours + ':' + minuts;
  }
}