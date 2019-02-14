import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  MemberApi
} from '../../apis/member.api';
import {
  ShopApinotify
} from "../../apis/shop.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);


    this.Base.setMyData({
      fenshu: 0, inputVal: "", start_photo: []
    });
  }
  onMyShow() {
    var that = this;
    var that = this;
    var shopapi = new ShopApi();
    shopapi.orderinfo({ id: this.Base.options.id }, (info) => {
      info.amount = parseFloat(info.amount);

      this.Base.setMyData({ info });

    });

  }
  pingfen(e) {

    this.Base.setMyData({
      fenshu: parseInt(e.currentTarget.id) + 1
    });
  }
  startuploadimg(e) {
    var that = this;
    var id = e.currentTarget.id;
    var start_photo = [];
    this.Base.uploadImage("shop", (ret) => {
      start_photo.push(ret);
      that.Base.setMyData({
        start_photo
      });
    }, () => { }, 3);
  }

  uploadimgone(e) {
    var that = this;
    var id = e.currentTarget.id;
    this.Base.uploadImage("shop", (ret) => {
      that.Base.setMyData({
        photo: ret
      });
    }, 1);
  }
  uploadimgtwo(e) {
    var that = this;
    var id = e.currentTarget.id;
    this.Base.uploadImage("shop", (ret) => {
      that.Base.setMyData({
        photo2: ret
      });
    }, 1);
  }
  uploadimgthree(e) {
    var that = this;
    var id = e.currentTarget.id;
    this.Base.uploadImage("shop", (ret) => {
      that.Base.setMyData({
        photo3: ret
      });
    }, 1);
  }



  tijiao() {

    var fenshu = this.Base.getMyData().fenshu;
    var pinglun = this.Base.getMyData().inputVal;

    var photo = this.Base.getMyData().start_photo[0];
    var photo2 = this.Base.getMyData().start_photo[1];
    var photo3 = this.Base.getMyData().start_photo[2];

    var dianpu = this.Base.getMyData().info.shop_id;
    var member = this.Base.getMyData().memberinfo.id;
    var ordergroup	=this.Base.options.id;
    if (fenshu != 0 && pinglun != "") {
      var shopapi = new ShopApi();
      shopapi.addshopscore({
        shop_id: dianpu, member_id: member, score: fenshu, content: pinglun, picture: photo, picture2: photo2, picture3: photo3, 
        ordergroup_id: ordergroup

      }, (huidiao) => {
        this.Base.toast("评论完成");
        wx.navigateBack({

        })

      })

    }



  }

  shuru(e) {
    this.Base.setMyData({
      inputVal: e.detail.value
    });

  }


}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.pingfen = content.pingfen;
body.startuploadimg = content.startuploadimg;
body.tijiao = content.tijiao;
body.shuru = content.shuru; 
body.uploadimgone = content.uploadimgone;
body.uploadimgtwo = content.uploadimgtwo;
body.uploadimgthree = content.uploadimgthree;
Page(body)