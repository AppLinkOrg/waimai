// pages/feedback/feedback.js
// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js"; 
import {
  ShopApi
} from "../../apis/shop.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
  }

  confirm(e) {
    var data = e.detail.value;
    if (data.yuanyin == '') {
      this.Base.info("请填写反馈意见");
      return;
    }
    if (data.wechat == '') {
      this.Base.info("请填写手机号");
      return;
    }
    

    var that = this;
    var wechat = data.wechat;
    var yuanyin = data.yuanyin;
    var memberinfo=this.Base.getMyData().memberinfo;
    var api = new ShopApi();



    wx.showModal({
      title: '',
      content: '确认提交意见反馈?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {

          api.addfeed({
            status:"A",
            member_id:memberinfo.id,
            mobile: wechat,
            feed: yuanyin
          }, (addfeed) => {
            
            wx.showToast({
              title: '提交成功',
              duration: 1000
            });
            wx.navigateBack({
              
            })
          });

        }
      }
    });

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.confirm = content.confirm; 
Page(body)