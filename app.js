//app.js
const { UUID } = require("./utils/uuid")
const { MD5_encode } = require("./http/crypto");

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('code转换', res.code);
        this.globalData.code = res.code
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    code: null,
    userInfo: null,
    baseURL: 'https://www.yyss.link:8090/api/wx/v1/',
    requestSecret: MD5_encode(UUID()),
    token: null,
    registerToken: null,
    mobile: null,
    latitude: null,
    longitude: null,
    invitation: null,
    avatar: null,
    nick: null,
  }
})