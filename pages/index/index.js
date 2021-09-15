//index.js
//获取应用实例
import { login, wxRefresh, announcement, wxRegister } from '../../http/api';
const app = getApp()

Page({
  data: {    
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    btnValue:'',
    navbarHeight: 0,
    statusBarHeight: 0,
    tabBarHeight: 0,
    announce: '滚动文字展示，不限字数，但少点好比较易于',
    modalStateFull: 'none',//block
    dialoglogin: 'none',//flex
  },
  login_modal(){
      this.setData({
        modalStateFull: 'block',
        dialoglogin: 'flex'
      })
  },
  unmodal(){
    this.setData({
      modalStateFull: 'none',
      dialoglogin: 'none'
    })
  },
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        mobile: app.globalData.mobile,
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
    //////////////////////////////////
    console.log(options)  
    if( options.url == "/pages/index/index?invitation=123456" ){
      app.globalData.invitation = options.invitation
      this.login_modal()
    }
    const MenuRect = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = wx.getSystemInfoSync().statusBarHeight; 
    const height = (MenuRect.top-statusBarHeight) * 2 + MenuRect.height +MenuRect.top;
    const tabBarHeight = 84;
    this.setData({ navbarHeight: height, statusBarHeight, tabBarHeight });
    if(app.globalData.token != null){      
      this.setData({
        modalStateFull: 'none',//block
        dialoglogin: 'none',//flex
      })      
    }
    // wx.clearStorage()
    announcement().then(
      resp => {
        console.log( 'announce === ', resp)                
        this.setData({
          announce: resp.item.content || '',
        })        
      },
      e => {
        console.log(e)
      }
    );
    
    wx.getLocation({
      type: 'wgs84',  // type:'gcj02', 
      success (res) {
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
      }
    })
  },
  
  myOrderList: function () {
    if(app.globalData.token != null){      
      wx.navigateTo({
        url: '../orderList/orderList'
      })     
    }else{
      this.setData({
        modalStateFull: 'block',//block
        dialoglogin: 'flex',//flex
      })   
    }    
  },

  storeList: function () {
    wx.navigateTo({      
      url: '../storeList/storeList'
    })    
  },

  serving: function () {    
    wx.navigateTo({      
      url: '../contactService/contactService'
    })    
  },

  sharing: function () {
    wx.getShareInfo({
      shareTicket: 'shareTicket',
    })    
  },

  gotoLogin: function(e){
    console.log("running gotologin -----", app.globalData.code)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('code转换', res.code);
        app.globalData.code = res.code
        // login({ code: app.globalData.code, });
        console.log(app.globalData.baseURL+'wxLogin')  
        wx.request({
          url: app.globalData.baseURL+'wxLogin',
          method: 'post',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: (result) => {
            console.log( "getPhoneNumber errMsg ====", e.detail.errMsg)
            console.log('registerToken -----', result.data.item.registerToken)        
            console.log('access token -----', result.data.item.token)       
            if(result.data.item.token != null){         
              app.globalData.token = result.data.item.token;
              this.setData({
                modalStateFull: 'none',//block
                dialoglogin: 'none',//flex
              })                    
              // wx.setStorageSync('token', result.data.token)   //wx.getStorageSync(a)
            }else{
              if(result.data.item.registerToken != null){
                app.globalData.registerToken = result.data.item.registerToken;   
                console.log( "getPhoneNumber errMsg ====", e.detail.errMsg)
                if (e.detail.errMsg == "getPhoneNumber:ok") {
                  //用户信息
                  let params = {
                    registerToken: result.data.item.registerToken, 
                    nick: this.data.userInfo.nickName,
                    avatar: this.data.userInfo.avatarUrl,       
                    mobileWeChat: e.detail.encryptedData,
                    iv: e.detail.iv,
                  }
                  if(app.globalData.invitation != null) { params.invitation =  app.globalData.invitation }
                  console.log('wxRegister params : ',params);
                  //后端获取参数进行解密
                  wxRegister(params).then(
                    resp => {
                      console.log(resp)
                      if( resp != null ){
                        if(resp.item.token != null){
                          app.globalData.token = resp.item.token;                     
                          app.globalData.mobile = resp.item.mobile;
                          app.globalData.invitation = resp.item.invitation;                              
                        }
                        console.log(app.globalData.token)        
                        this.unmodal()              
                      }
                    },
                    e => {
                      console.log(e)
                    }
                  );
                } else {
                  wx.navigateTo({
                    url: '/pages/verification_sms/verification_sms',
                  })
                }     
              }          
            }        
          },
          fail: function (res) {
            console.log("请求失败", res)
          }
        }) 
      }
    })
    
  },  

  onShareAppMessage: function (e) {
    console.log("用户点击了按钮开始分享", e)
    wxRefresh({
      nick: app.globalData.nick,
      avatar: app.globalData.avatar,
    }).then(
      resp => {
        console.log('profile refresh----', resp);
        if (!resp) return;
        this.setData({
          invitation: resp.item.invitation,
          token: resp.item.token,          
        })
        app.globalData.token = resp.item.avatar
        app.globalData.invitation = resp.item.nick
      },
      e => {
        console.log(e)
        wx.showToast({
          title: e.message, icon: 'error'
        })
      }
    );

    return {
      title: '瓜子推修',
      path: 'pages/index/index?invitation=' + app.globalData.invitation,
      success: function (e) {
        console.log('shared')
        wx.navigateTo({
          url: 'pages/index/index?invitation=' + app.globalData.invitation,
        })
      }
    }      
  },

})
