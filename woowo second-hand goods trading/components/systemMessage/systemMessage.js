Component({
  properties: {
    msgType: Number,
    // 0: system notifications
    msgContent: String,
    iconUrls: {
      type: Array,
      value: ["../../statics/images/icon_warning@2x.png"]
    },
    titleArray: {
      type: Array,
      value: ["系统通知"]
    }
  },
  data: {
    // iconUrls: {
    //   type: Array,
    //   value: ["../../statics/images/icon_warning@2x.png"]
    // },
    // titleArray: {
    //   type: Array,
    //   value: ["系统通知"]
    // }
  },
  methods: {
    
  }
})