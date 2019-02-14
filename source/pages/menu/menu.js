// pages/content/content.js
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
  ShopApi
} from "../../apis/shop.api.js";
import {
  ApiUtil
} from "../../apis/apiutil.js";


class Content extends AppBase {
  constructor() {

    super();
  }
  onLoad(options) {
    this.Base.needauth = false;
    this.Base.Page = this;
    //options.id=5;
    this.Base.setMyData({ num: 1, xz: 0, istrue: true, istrue1: true, istrue2: true, qweqwe: true, })
    super.onLoad(options);


  }
  brandtap(e) {
    //console.log(currentTarget);
    var id = e.currentTarget.id;

    this.Base.setMyData({ s: id })
  }

  onMyShow() {
    var that = this;
    this.Base.getAddress((location) => {
      console.log(location);
      var mylat = location.location.lat;
      var mylng = location.location.lng;
      this.Base.setMyData({
        mylocation: location.ad_info
      });
      var shopapi = new ShopApi();
      shopapi.shoplist({
        mylat,
        mylng
      }, (shoplist) => {
        for (var i = 0; i < shoplist.length; i++) {
          shoplist[i].mile = this.Base.util.GetDistance(mylat, mylng, shoplist[i].lat, shoplist[i].lng);

          shoplist[i].miletxt = this.Base.util.GetMileTxt(shoplist[i].mile);
        }
        this.Base.setMyData({ shoplist });
        if (AppBase.SHOPID == 0) {
          AppBase.SHOPID = shoplist[0].id;
        }
        this.setCurrent();
      });
    });


  }
  setCurrent() {
    var shop_id = AppBase.SHOPID;
    var shoplist = this.Base.getMyData().shoplist;
    for (var i = 0; i < shoplist.length; i++) {
      if (shoplist[i].id == shop_id) {
        this.Base.setMyData({ currentshop: shoplist[i] });

        var is = ApiUtil.checkInOpen(this.Base.getMyData().currentshop.openning);
        var shopapi = new ShopApi();
        shopapi.menucat({ menu_id: shoplist[i].menu_id }, (menucat) => {
          shopapi.menugoods({ menu_id: shoplist[i].menu_id }, (menugoods) => {
            var ret = [];
            var loc = 0;
            for (var i = 0; i < menucat.length; i++) {
              menucat[i].goods = [];
              menucat[i].asd = 0;
              for (var j = 0; j < menugoods.length; j++) {
                if (menucat[i].id == menugoods[j].cat_id) {
                  menucat[i].goods.push(menugoods[j]);
                  menucat[i].asd += parseInt(menugoods[j].ifnum);
                }


              }

              if (menucat[i].goods.length > 0) {
                menucat[i].scrollstart = loc;
                menucat[i].scrollend = loc + 37 + 110 * menucat[i].goods.length;
                loc = loc + 37 + 110 * menucat[i].goods.length;
                ret.push(menucat[i]);
              }
            }
            this.Base.setMyData({ menu: ret, selectcat_id: ret[0].id });
          });
          shopapi.menugoods({
            menu_id: shoplist[i].menu_id
          }, (menugoods) => {
            this.Base.setMyData({
              menugoods
            });

            this.calc();
            shopapi.shopscorelist({ shop_id: this.Base.getMyData().currentshop.id }, (pinglunlist) => {

              this.Base.setMyData({ pinglunlist });

            })
          });
          return;


        });
        return;
      }
    }





  }
  goodsscroll(e) {
    console.log(e);
    console.log(e.detail);

    var isgoto = this.Base.getMyData().isgoto;
    if (isgoto == true) {
      this.Base.setMyData({ isgoto: false });
    } else {
      var top = e.detail.scrollTop;
      var menu = this.Base.getMyData().menu;
      var selectcat_id = this.Base.getMyData().selectcat_id;
      var cat_id = 0;
      for (var item of menu) {
        if (item.scrollstart <= top && top < item.scrollend) {
          cat_id = item.id;
          break;
        }
      }
      if (selectcat_id != cat_id) {
        this.Base.setMyData({ selectcat_id: cat_id });

      }
    }
  }
  gotoCat(e) {
    var id = e.currentTarget.id;
    this.Base.setMyData({ "intocat_id": "cat_" + id, selectcat_id: id, isgoto: true });
  }
  selectgoods(e) {
    var id = e.currentTarget.id;
    var shopapi = new ShopApi();
    shopapi.goodsinfo({
      id: id
    }, (info) => {
      console.log(info);
      this.Base.setMyData(info);

      if (info.attrs.length == 0) {

        var data = this.Base.getMyData();
        var shopapi = new ShopApi();
        shopapi.addtocart({
          goods_id: data.id,
          vals: 0,
          num: 1,
          shop_id: data.currentshop.id
        }, (ret) => {


          this.calc();


        });




      } else {

        this.Base.setMyData({ istrue: false });

        this.loadprice();
      }
    });
  }

  selectgoods1(e) {
    var id = e.currentTarget.id;
    console.log(e);
    var shopapi = new ShopApi();
    shopapi.goodsinfo({
      id: id
    }, (info) => {
      console.log(info);
      this.Base.setMyData(info);

      this.Base.setMyData({ istrue1: false, xiaolian: e.currentTarget.dataset.id });
      this.loadprice();

    });
  }


  dataReturnCallback(data) {

  }
  chooseShop() {
    wx.navigateTo({
      url: '/pages/shopchoose/shopchoose',
    })
  }
  huadon(e) {


    var xz = e.detail.current;
    if (xz == 0) {

      this.Base.setMyData({
        xz: xz, qweqwe: true
      });
    }
    else {

      this.Base.setMyData({
        xz: xz, qweqwe: false
      });
    }

  }

  changetab(e) {
    var xz = e.currentTarget.id;
    if (xz == 0) {

      this.Base.setMyData({
        xz: xz, qweqwe: true
      });
    }
    else {

      this.Base.setMyData({
        xz: xz, qweqwe: false
      });
    }
  }




  loadprice() {
    var data = this.Base.getMyData();
    var price = parseFloat(data.price);
    console.log(price);

    var pricemsg = data.name + "¥" + data.price;
    var vals = [];

    var attrs = this.Base.getMyData().attrs;

    for (var i = 0; i < attrs.length; i++) {
      for (var j = 0; j < attrs[i].vals.length; j++) {
        if (attrs[i].vals[j].selected == "Y") {
          if (attrs[i].isshow == 'Y') {
            pricemsg += "+" + attrs[i].vals[j].sname + "¥" + attrs[i].vals[j].price;
          }
          vals.push(parseInt(attrs[i].vals[j].id));
          price = price + parseFloat(attrs[i].vals[j].price);
        }
      }
    }
    vals.sort();
    this.Base.setMyData({ pricemsg, totalprice: price, vals: vals.join(",") });
  }
  bindclosedetails() {

    this.Base.setMyData({ istrue: true });

  }

  bindclosedetails1() {

    this.Base.setMyData({ istrue1: true });

  }
  bindclosedetails2() {

    var cartorder = this.Base.getMyData().cartorder;
    if (cartorder.length != 0) {
      this.Base.setMyData({ istrue2: false });
    }

  }
  addToCart() {


    var data = this.Base.getMyData();
    if (data.vals == '') {
      var shopapi = new ShopApi();
      shopapi.addtocart({
        goods_id: data.id,
        vals: data.vals,
        num: data.num,
        shop_id: data.currentshop.id
      }, (ret) => {
        this.calc();
      });

    }
    else {

      this.Base.setMyData({ istrue1: true, istrue: false });

    }


  }
  addToCart1() {


    var data = this.Base.getMyData();

    var shopapi = new ShopApi();
    shopapi.addtocart({
      goods_id: data.id,
      vals: data.vals,
      num: data.num,
      shop_id: data.currentshop.id
    }, (ret) => {
      this.calc();
    });





  }


  calc() {
   
    var shopapi = new ShopApi();
    shopapi.cartlist({ shop_id: this.Base.getMyData().currentshop.id }, (cartorder) => {

      var menugoods = this.Base.getMyData().menugoods;
      var menu = this.Base.getMyData().menu;

     
    //  for (var q = 0; q < menu.length; q++) {
      
      //  for (var b = 0; b < goods.length; b++) {
          var caipinzonshu = 0;
          var totalprice1 = 0;
          var totalnum = 0;
          var cansales = [];
      var shuzu =new Array(menu.length).fill(0);
          for (var i = 0; i < cartorder.length; i++) {
            
            for (var q = 0; q < menu.length; q++) {
               
              var goods = menu[q].goods;
              for (var b = 0; b < goods.length; b++) {

                if (cartorder[i].goods_id == goods[b].goods_id) {
                
                  shuzu[q] += parseInt(cartorder[i].num);
                 
                }

              }
              

            }

           
            cartorder[i].cansales = 'N';
            var vallist = cartorder[i].vallist;
            var price = parseFloat(cartorder[i].goods_price);
            caipinzonshu += parseInt(cartorder[i].num);
            var valstr = [];
            for (var a of vallist) {
              valstr.push(a.sname);
              price += parseFloat(a.price);

            }
            totalnum += parseInt(cartorder[i].num);
            cartorder[i].valstr = valstr.join("/");


            cartorder[i].oneprice = price;

            for (var a of menugoods) {
              if (a.goods_id == cartorder[i].goods_id) {
                var price = cartorder[i].oneprice;
                console.log(a.discount);
                if (a.discount > 0) {
                  console.log("jkk");
                  cartorder[i].oldprice = cartorder[i].oneprice;
                  cartorder[i].oneprice = parseFloat((cartorder[i].oneprice * parseFloat(a.discount / 10.0)).toFixed(2));
                  cartorder[i].havediscount = "Y";
                }
                cartorder[i].cansales = "Y";
                break;
              }
            }
            cartorder[i].numprice = cartorder[i].oneprice * parseInt(cartorder[i].num);

            if (cartorder[i].checked_value == "Y" && cartorder[i].cansales == "Y") {
              totalprice1 += cartorder[i].numprice;

            }
         
      }
      console.log(totalprice1);
      console.log("进而");

      this.Base.setMyData({
        cartorder,
        shuzu:shuzu,
        totalprice1: totalprice1.toFixed(2),
        caipinzonshu: caipinzonshu
      });
      if (cartorder.length == 0) {
        this.Base.setMyData({
          istrue2: true
        });
      }
    });

  }







  selectval(e) {
    var id = e.currentTarget.id;
    id = id.split("_");
    var attr_id = id[0];
    var val_id = id[1];

    var attrs = this.Base.getMyData().attrs;
    for (var i = 0; i < attrs.length; i++) {
      if (attr_id == attrs[i].id) {
        for (var j = 0; j < attrs[i].vals.length; j++) {
          var s = attrs[i].vals[j].id == val_id ? "Y" : "N";
          attrs[i].vals[j].selected = s;
          console.log(attrs[i].vals[j].selected);

        }
      }
    }
    console.log(attrs[0].vals[0].selected);
    this.Base.setMyData({
      attrs
    });
    this.loadprice();
  }
  quxiaol() {

    this.Base.setMyData({ istrue2: true, istrue: true, istrue1: true });


  }
  jian(e) {
    var that = this;
    var ischange = false;
    var id = e.currentTarget.id;
    var num = 0;

    var cartorder = this.Base.getMyData().cartorder;
    for (var i = 0; i < cartorder.length; i++) {


      if (id == cartorder[i].id) {

        var num = parseInt(cartorder[i].num);
        num--;
        if (num == 0) {
        }
        cartorder[i].num = num;

        ischange = true;
        var shopapi = new ShopApi();
        shopapi.updatecartordernum({
          id: cartorder[i].id,
          num: num
        }, (qwe) => {
          this.Base.setMyData({
            cartorder
          });
          this.calc();

        });
      }

    }

    if (ischange) {


    }
  }
  jia(e) {
    var ischange = false;
    var id = e.currentTarget.id;

    var cartorder = this.Base.getMyData().cartorder;
    for (var i = 0; i < cartorder.length; i++) {
      if (id == cartorder[i].id) {
        var num = parseInt(cartorder[i].num);


        num++;
        cartorder[i].num = num;


        var shopapi = new ShopApi();
        shopapi.updatecartordernum({
          id: cartorder[i].id,
          num: num
        }, () => {
          this.Base.setMyData({
            cartorder
          });
          this.calc();

        });
        ischange = true;
      }

    }
    if (ischange) {


    }
  }
  gotoConfirm(e) {
    if (this.Base.getMyData().totalprice1 > 0) {

      var cartorder = this.Base.getMyData().cartorder;
      var expresstype = this.Base.getMyData().expresstype;
      var currentshop = this.Base.getMyData().currentshop;
      var ids = [];
      for (var i = 0; i < cartorder.length; i++) {
        if (cartorder[i].cansales == 'Y' && cartorder[i].checked_value == 'Y') {
          ids.push(cartorder[i].id);
        }
      }
      var ids = ids.join(",");
      wx.navigateTo({
        url: '/pages/orderdetails/orderdetails?shop_id=' + AppBase.SHOPID + "&orderids=" + ids + "&menu_id=" + currentshop.menu_id,
      })
    }
  }
  qingkon() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认清空购物车',
      success(e) {
        if (e.confirm) {
          var shopapi = new ShopApi();
          shopapi.updatecartordernum1({
            member_id: that.Base.getMyData().memberinfo.id,
            shop_id: that.Base.getMyData().currentshop.id
          }, () => {
            that.calc();

          });

        }
      }
    })









  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.setCurrent = content.setCurrent;
body.goodsscroll = content.goodsscroll;
body.gotoCat = content.gotoCat;
body.selectgoods = content.selectgoods;
body.selectgoods1 = content.selectgoods1;
body.chooseShop = content.chooseShop;
body.huadon = content.huadon;
body.changetab = content.changetab;
body.loadprice = content.loadprice;
body.bindclosedetails = content.bindclosedetails;
body.bindclosedetails1 = content.bindclosedetails1;
body.selectval = content.selectval;
body.addToCart = content.addToCart;
body.addToCart1 = content.addToCart1;
body.calc = content.calc;
body.bindclosedetails2 = content.bindclosedetails2;
body.quxiaol = content.quxiaol;
body.jia = content.jia;
body.jian = content.jian;
body.gotoConfirm = content.gotoConfirm;
body.qingkon = content.qingkon;
Page(body)