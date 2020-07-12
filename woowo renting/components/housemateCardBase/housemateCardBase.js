// components/housemateCardBase/housemateCardBase.js
import WoowoHousemate from '../../utils/woowoHousemate'

Component({
  /**
   * Component properties
   */
  properties: {
    housemateInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    woowoHousemate: {},
    showingHousemateInfo: {}
  },

  ready: function () {
    let that = this;
    let data = that.data;

    data.woowoHousemate = new WoowoHousemate();
    data.woowoHousemate.formatDataFromServer(data.housemateInfo);

    data.showingHousemateInfo = data.woowoHousemate.formatToShowingData();

    that.setData(data);
  },
  /**
   * Component methods
   */
  methods: {

  }
})
