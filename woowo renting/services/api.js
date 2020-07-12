const ApiRootUrl = 'https://woowo.xyz/api/wx_zf/';
const TestRootUrl = 'http://woniu-admin.com/api/wx_zf/';

const TestMode = false;

const RealRootUrl = TestMode ? TestRootUrl : ApiRootUrl;

module.exports = {
  /**
   * Login and Register
   */
  DecUnionId: RealRootUrl + 'wx_dec/dec_unionid.php',
  InsertUser: RealRootUrl + 'post_insert_user.php',
  GetSessionKey: RealRootUrl + 'encapsulate/apiwx.php',
  UpdateUser: RealRootUrl + 'post_update_user_info.php',

  /**
   * Messages
   */
  GetAllMsgByUserId: RealRootUrl + 'msg/post_get_all_msg_by_user_id.php',
  GetCertainMsgByUserId: RealRootUrl + 'msg/post_get_certain_msg_by_user_id.php',
  UpdateMsgWithTwoId: RealRootUrl + 'msg/post_update_msg_with_two_id.php',
  DeleteMsgBetweenUsers: RealRootUrl + 'msg/post_delete_msg.php',
  SendMsgWithTwoId: RealRootUrl + 'msg/post_update_msg_with_two_id.php',
  SetMsgsAsRead: RealRootUrl + 'msg/post_update_read_msg.php',

  /**
   * Address
   */
  PostSearchAddress: RealRootUrl + 'map/post_search_address.php',
  ReverseGeocoding: RealRootUrl + 'map/post_google_map_two.php',

  /**
   *  POST HOUSE
   */
  CreateNewHouseId: RealRootUrl + 'post_init_house.php',
  UpdateHouseInfo2: RealRootUrl + 'post_update_house.php',
  DeleteHouse: RealRootUrl + 'post_delete_house_by_id.php',

  /**
   *  REQUEST HOUSES
   */
  SelectHouseWith: RealRootUrl + 'post_select_house_with.php',
  GetHousesByIds: RealRootUrl + 'post_get_house_by_id.php',
  GetHousesByUserId: RealRootUrl + 'post_get_house_by_userId.php',
  AddViewCountHouse: RealRootUrl + 'post_add_view_count_house.php',
  RenewHouse: RealRootUrl + 'post_renew_house.php',

  /**
   *  INTERECTING WITH USRERS AND HOUSED
   */
  UpgradeLikeUser: RealRootUrl + 'post_upgrade_like_user.php',
  LikedTheHouse: RealRootUrl + 'post_liked_the_house.php',
  FetchUserById: RealRootUrl + 'post_fetch_user_by_id.php',

  /**
   *  API FROM ERSHOU
   */
  VerifyingPhoneNumber: 'https://woniu-xcx.xyz/api/wx/' + 'msg/post_send_msg.php',
  GetQiniuToken: 'https://woniu-xcx.xyz/api/wx/' + 'qiniu/get_qiniu_upload_token.php',

  /**
   *  Bing maps
   */
  BingSearch: RealRootUrl + 'map/post_bing_search.php',
  BingLocationByQuery: RealRootUrl + 'map/post_bing_location_by_query.php',
  BingLocationByPoint: RealRootUrl + 'map/post_bing_location_by_point.php',

  /**
   *  CREAT QR CODE
   */
  QRCodeCreate: 'https://woniu-xcx.xyz/api/wx/post_qrcode_create_zf.php?',

  /**
   *  GET NEWS
   */
  FetchNews: RealRootUrl + 'post_fetch_news.php',


  /**
   *  ABOUT AGENTS
   */
  getHotInter: RealRootUrl + 'inter/post_select_company.php',
  getCompanyInfo: RealRootUrl + 'inter/post_get_company_by_id.php',

  /**
   *  POST HOUSEMATE
   */
  CreateAHousemate: RealRootUrl + 'partner/post_insert_post.php',

  /**
   *  REQEUST HOUSEMATE
   */
  SelectHousemateWith: RealRootUrl + 'partner/post_search_post_with.php',
  GetHousemateByIds: RealRootUrl + 'partner/post_fetch_post_by_id.php',
  LikedHousemate: RealRootUrl + 'partner/post_liked_post.php',
  GetHousemateByUnionid: RealRootUrl + 'partner/post_fetch_all_post_by_wxUnionId.php',
  UpdateHousemate: RealRootUrl + 'partner/post_update_post.php',
  ChangedHousemateStatus: RealRootUrl + 'partner/post_change_post_status.php',
  
  /**
   *  For data analysis
   */
  PostAddUpTimesCode: RealRootUrl + 'post_add_up_times_code.php'
  
}