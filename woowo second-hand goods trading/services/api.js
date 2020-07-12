const ApiRootUrl = 'https://woniu-xcx.xyz/api/wx/';
const TestRootUrl = 'http://woniu-admin.com/api/wx/';

const TestMode = false;

const RealRoot = TestMode ? TestRootUrl : ApiRootUrl;

module.exports = {
  DecUnionId: RealRoot + 'wx_dec/dec_unionid.php',
  SelectProductByKind: RealRoot + 'post_select_product_by_kind.php',

  InsertUser: RealRoot + 'post_insert_user.php',
  UpdateUser: RealRoot + 'post_upgrade_user_info.php',
  InsertProduct: RealRoot + 'post_insert_product.php',

  GetAllUser: RealRoot + 'get_all_wx_user.php',
  GetAllProduct: RealRoot + 'get_all_wx_product.php',
  GetCertainProduct: RealRoot + 'post_get_certain_product.php',
  GetSellerAllProduct: RealRoot + 'post_product_by_user_unionid.php',
  GetCertainUsers: RealRoot + 'post_user_by_user_id.php',

  ChangeProductStatus: RealRoot + 'post_shelf_status.php',
  LikeProduct1: RealRoot + 'post_liked_user_collection.php',
  LikeProduct2: RealRoot + 'post_liked_the_product.php',
  FollowSeller: RealRoot + 'post_upgrade_like_user.php',
  ReportProduct: RealRoot + 'post_complain_text.php',
  LetProductTop: RealRoot + 'post_product_renew.php',

  GetAllNotifications: RealRoot + 'post_get_user_notify.php',
  ReadAllNotifications: RealRoot + 'post_user_notify_check.php',

  GetHottestProduct: RealRoot + 'post_hot_product.php',

  GetFilteredProduct: RealRoot + 'post_select_product_with.php',

  ValidatePhoneNumber: RealRoot + 'msg/post_send_msg.php',

  GoogleReversGeocoding: 'https://maps.googleapis.com/maps/api/geocode/json?',

  GetQiniuToken: RealRoot + 'qiniu/get_qiniu_upload_token.php',
  WrappedGoogleReversGeocoding: RealRoot + 'encapsulate/googlemap.php',
  WrappedBingReverGeocoding: RealRoot + 'encapsulate/bingMapSearchPoint.php',

  GetQRCodeBase64: RealRoot + 'post_qrcode_create.php',

  // new from Bleve
  ViewCountAddUp: RealRoot + 'post_add_view_count_product.php',
  EditProductInfo: RealRoot + 'post_upgrade_product_info.php',
  ActiviesFormSubmit: RealRoot + 'dynamic/FormSubmitActivies.php',
  
  // Check the limitation
  CheckStuffsLimitation: RealRoot + 'post_check_stuffs_over.php',
  
  CollectFormId: RealRoot + 'msg/post_collect_user_data.php',

  /**
   *  Bing maps
   */
  BingSearch: RealRoot + 'map/post_bing_search.php',
  BingLocationByQuery: RealRoot + 'map/post_bing_location_by_query.php',
  BingLocationByPoint: RealRoot + 'map/post_bing_location_by_point.php',

  /**
   *  FOR SHOP
   */
  ShopInfoUpdate: RealRoot + 'shop/post_insertOrUpdate_shop.php',
  FetchShop: RealRoot + 'shop/post_fetch_shop_with.php',
  SelectShopProduct: RealRoot + 'shop/post_select_shop_product.php',
  FollowShops: RealRoot + 'shop/post_modfiy_like_shop.php',
  FetchUserLikedShop: RealRoot + 'shop/post_fetch_user_liked_shop.php',

  /**
   *  For data analysis
   */
  // PostAddUpTimesCode: RealRootUrl + 'post_add_up_times_code.php'
  // PostAddUpTimesCode: 'https://woniu-xcx.xyz/api/admin/post_add_up_times_code.php',
  PostAddUpTimesCode: RealRoot + 'post_add_up_times_code.php',
  

  /**
   *  For popular goods
   */
  GetAllPopularProduct: RealRoot + 'get_all_hot_product.php'
}