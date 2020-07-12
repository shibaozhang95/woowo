const app = getApp()
const LOAD_ITEM = 20;
const util = require('../../../../utils/util');

// schoolAreasApts.js
Component({
  /**
   * Component properties
   */
  properties: {
    monitorReachBottom: {
      type: Number,
      value: 0,
      observer (newVal, oldVal, path) {
        let that = this;

        if (newVal == 1) {
          console.log('First time to ');
          return;
        }

        that.fackOnReachBottom();
      }
    },

    reLoadTrigger: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        let that = this;


      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    schools: [{
      schoolName: '墨大(Parkville)',
      ifChosen: true,
      filter: {
        suburb: 'North Melbourne,Parkville,Carlton,Melbourne,Fitzroy',
        state: 'VIC'
      }
    }, {
      schoolName: '皇家理工(RMIT)',
      ifChosen: false,
      filter: {
        suburb: 'North Melbourne,Parkville,Carlton,Melbourne,Fitzroy',
        state: 'VIC'
      }
    }, {
      schoolName: '莫纳什(Caulfield)',
      ifChosen: false,
      filter: {
        suburb: 'Carnegie,Glen Huntly,Malvern East,Balaclava,Caulfield North,Caulfield East,Murrumbeena,St. Kilda,Prahran',
        state: 'VIC'
      }
    }, {
      schoolName: '莫纳什(Clayton)',
      ifChosen: false,
      filter: {
        suburb: 'Notting Hill,Mulgrave,Clayton,Clayton North,Clayton South,Oakleigh',
        state: 'VIC'
      }
    }, {
      schoolName: '迪肯(Burwood)',
      ifChosen: false,
      filter: {
        suburb: 'Burwood East,Box Hill South,Camberwell,Ashburton,Box Hill,Blackburn South,Mont Albert',
        state: 'VIC'
      }
    }, {
      schoolName: '墨大(Southbank)',
      ifChosen: false,
      filter: {
        suburb: 'Southbank,South Melbourne,South Yarra,Melbourne',
        state: 'VIC'
      }
    }],

    housesInfo: {
      ifReachBottom: false,
      ifLoading: false,
      ifNothing: false,
      previousPage: 0,
      nextPage: LOAD_ITEM,
      list: []
    },
  },

  ready: function () {
    let that = this;

    let currFilter = that.getSchoolAreasFilter();

    that.reRequestHouses(currFilter);
  },

  /**
   * Component methods
   */
  methods: {
    reLoadData: function () {
      let that = this;

      let currFilter = that.getSchoolAreasFilter();

      that.reRequestHouses(currFilter);
    },

    switchToAnotherSchool: function (event) {
      let that = this;
      let data = that.data;

      let index = event.currentTarget.dataset.index;

      for (let i = 0, len = data.schools.length; i < len; ++i) {
        data.schools[i].ifChosen = false;
      }

      data.schools[index].ifChosen = true;

      that.setData(data);

      // request data
      that.reRequestHouses(data.schools[index].filter);
      // that.reRequestHouses({});
    },

    reRequestHouses: function (filter) {
      let that = this;
      let data = that.data;
  
      data.housesInfo = {
        ifReachBottom: false,
        ifLoading: false,
        ifNothing: false,
        previousPage: 0,
        nextPage: LOAD_ITEM,
        list: []
      }
  
      data.housesInfo.ifLoading = true;
      that.setData(data);
  
      that.requestHouses(data.housesInfo, filter)
      .then(res => {
        data.housesInfo.ifLoading = false;
  
        if (res.code == 0) {
          data.housesInfo.list = res.data;
          data.housesInfo.previousPage = res.data.length;
  
          if (data.housesInfo.list.length == 0) {
            data.housesInfo.ifNothing = true;
          }
          else if (data.housesInfo.list.length < data.housesInfo.nextPage) {
            data.housesInfo.ifReachBottom = true;
          }
        }
  
        else {
          data.housesInfo.ifNothing = true;
  
          wx.showToast({
            title: '出错了，请稍后再试~',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }
  
        that.setData(data);
      })
    },

    fackOnReachBottom: function () {
      let that = this;
      let data = that.data;

      if (data.housesInfo.ifReachBottom || data.housesInfo.ifLoading
        || data.housesInfo.ifNothing) return;

      data.housesInfo.ifLoading = true;
      that.setData(data);

      let currFilter = that.getSchoolAreasFilter();

      that.requestHouses(data.housesInfo, currFilter) 
      .then(res => {
        data.housesInfo.ifLoading = false;

        if (res.code == 0) {
          let newList = res.data;

          data.housesInfo.list = data.housesInfo.list.concat(newList);
          data.housesInfo.previousPage += LOAD_ITEM;

          if (newList.length < data.housesInfo.nextPage) {
            data.housesInfo.ifReachBottom = true;
          }
        }

        else {
          wx.showToast({
            title: '加载失败，请稍后再试~',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          })
        }

        that.setData(data);
      })
    },
  
    requestHouses: function (housesInfo, filter) {
      let that = this;
      let data = that.data;
  
      // let filter = getSchoolAreasFilter();
  
      return new Promise((resolve, reject) => {
        util.requestHousingList(housesInfo.previousPage, housesInfo.nextPage, filter)
        .then(res => {
          resolve(res);
        })
      })
    },
  
    getSchoolAreasFilter: function () {
      let that = this;
      let data = that.data;
  
      for (let i = 0, len = data.schools.length; i < len; ++i) {
        if (data.schools[i].ifChosen) {
          return data.schools[i].filter;
        }
      }
  
      return {}
    }
  }
})
