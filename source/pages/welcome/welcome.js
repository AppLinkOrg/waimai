// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
    //this.needauth=false;
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.indexbanner({}, (indexbanner)=>{
      this.Base.setMyData({ indexbanner});
    });
  }
  ydd(){
    this.Base.toast("即将开放");
  }
  ssxd(){

    wx.navigateTo({
      url: '/pages/shopchoose/shopchoose',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.comingsoon = content.comingsoon;
body.ssxd=content.ssxd;
body.ydd=content.ydd;
Page(body)