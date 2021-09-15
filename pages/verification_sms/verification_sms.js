// pages/verification_sms/verification_sms.js
import { smsReq, wxRegister } from '../../http/api';
var zhenzisms = require('../../utils/zhenzisms.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    wrongPhoneColor: '#F9F9F9',//#CC0000
    wrongCodeColor: '#F9F9F9',//#CC0000
    codenoneBtnShow: 'none',
    codeBtnShow: 'block',
    hidden: true,
    btnValue:'获取验证码',
    btnDisabled:false,
    name: '',
    phone: '',
    code: '',
    second: 60,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mobile: '',
    invitation: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

//姓名输入
bindNameInput(e) {
  this.setData({
    name: e.detail.value
  })
},
//手机号输入
bindPhoneInput(e) {
  //console.log(e.detail.value);
  var val = e.detail.value;
  this.setData({
    phone: val
  })
  if(val != ''){
    this.setData({
      hidden: false,
      btnValue: '获取验证码'
    })
  }else{
    this.setData({
      hidden: true
    })
  }
},
//验证码输入
bindCodeInput(e) {
  this.setData({
    code: e.detail.value
  })
},
//获取短信验证码
getCode(e) {
  var that = this;
  var mobile = that.data.phone;
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    // wx.showToast({
    //   title: '手机号有误！',
    //   icon: 'success',
    //   duration: 1500
    // })
    this.setData({wrongPhoneColor: '#CC0000', });
    return ;
  }
  // wx.showToast({
  //   title: '手机号正确！',
  //   icon: 'success',
  //   duration: 1500
  // })
  this.setData({wrongPhoneColor: '#F9F9F9', wrongCodeColor: '#F9F9F9',});
  that.timer();
  smsReq({ registerToken:app.globalData.registerToken, mobile:that.data.phone}).then(
    resp => {
      if( resp != null){
        console.log(resp)
        console.log('smscode =====', resp.item.smsCode)
        // that.setData({
        //   code: resp.item.smsCode,
        // })
      }      
    },
    e => {
      console.log(e)
    }
  );  
},
timer: function () {
  let promise = new Promise((resolve, reject) => {
    let setTimer = setInterval(
      () => {
        var second = this.data.second - 1;
        this.setData({
          second: second,
          btnValue: second+'秒',
          btnDisabled: true
        })
        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            btnValue: '获取验证码',
            btnDisabled: false,
            codenoneBtnShow: 'none',
            codeBtnShow: 'block',
          })          
          resolve(setTimer)
        }
      }
      , 1000)
  })
  promise.then((setTimer) => {
    clearInterval(setTimer)
  })
},

showToast(msg){
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
},
//保存
save(e) {
    console.log("registerToken: ", app.globalData.registerToken )
    console.log("nick: ", this.data.userInfo.nickName )
    console.log("avatar: ", this.data.userInfo.avatarUrl )
    console.log("mobile: ", this.data.phone )
    console.log("smsCode: ", this.data.code )
    let params = {
      registerToken: app.globalData.registerToken, 
                  nick: this.data.userInfo.nickName,
                  avatar: this.data.userInfo.avatarUrl,       
                  // mobileWeChat: '',
                  // iv: '',
                  mobile: this.data.phone,
                  smsCode: this.data.code,
    }
    if(app.globalData.invitation != null){ params.invitation =  app.globalData.invitation }
    wxRegister(params).then(
      resp => {
        console.log(resp)
        if( resp != null ){
          if(resp.item.token != null){
            app.globalData.token = resp.item.token;
            this.setData({
              mobile: resp.item.mobile,
              invitation: resp.item.invitation,
            })
            app.globalData.mobile = resp.item.mobile;
            console.log(app.globalData.token)

            var pages = getCurrentPages();
            if (pages.length >= 2) {
              var prevPage = pages[pages.length - 2];
              prevPage.setData({ modalStateFull: 'none', dialoglogin: 'none' })
            }
            wx.navigateBack();
          }
          this.setData({wrongCodeColor: '#CC0000',});
          // console.log('smscode =====', resp.item.smsCode)
          // that.setData({
          //   code: resp.item.smsCode,
          // })
        }
      },
      e => {
        console.log(e)
      }
    );
    this.setData({      
      codenoneBtnShow: 'block',
      codeBtnShow: 'none',
    });
    if( this.data.phone == ''){
      this.setData({ wrongPhoneColor: '#CC0000',});
    }
    if( this.data.code == ''){
      this.setData({ wrongCodeColor: '#CC0000',});
    }
    if(this.data.btnDisabled == false) { this.timer()  }
      
}
})