// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {ShopApi} from "../../apis/shop.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ ctt: 1 })
  }
  onMyShow() {
    var that = this;
    var shopapi = new ShopApi();
    shopapi.list({ status: 'K,V', expresstype: "B", orderby:'r_main.created_date'}, (list) => {
      this.Base.setMyData({ list });
    });

    shopapi.list({ status: 'S', expresstype: "B", orderby: 'r_main.created_date' }, (wclist) => {
      this.Base.setMyData({ wclist });
    });
  }
  updatesoncan(e) {
    var that=this;
    wx.showModal({
      title: '请确认开始送餐？',
      
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {
          var id=e.currentTarget.id;
          var shopapi = new ShopApi();
          shopapi.updatesoncan({order_id:id}, (updatesoncan) => {
            that.Base.setMyData({ updatesoncan });
            that.onMyShow();
          });
          
        }

      }
    });
    this.onMyShow();
    
  }
  updatearrival(e){
    var that = this;
    wx.showModal({
      title: '请确认外卖已送达？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {
          var id = e.currentTarget.id;
          var shopapi = new ShopApi();
          shopapi.updatearrival({ order_id: id }, (updatearrival) => {
            that.Base.setMyData({ updatearrival });
            that.onMyShow();
          });
          
        }
       
      }
    });
    
  }


  bindwaitcompleted(e) {
    this.Base.setMyData({ ctt: 2 })
  }
  bindcontact(e) {
    this.Base.setMyData({ ctt: 1 })
  }


}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.updatesoncan = content.updatesoncan;
body.updatearrival = content.updatearrival;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact;
Page(body)