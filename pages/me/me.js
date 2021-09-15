// pages/me/me.js
import { profile } from '../../http/api';
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    nick: '',
    mobile: '',
    avatar: '',
    integral: 0,
    showIntegral: 0,
    bindBank: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    noticeDispState: 'flex',//flex
    btnColor: 'red', // #D8D8D8
    picUrls: [],
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../binding_card/card_info_view'
    })
  },

  avatarpreview: function() {
   
  },

  /**
   * Lifecycle function--Called when page load
   */
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
    this.refreshData();
  },

  refreshData: function(e) {
    profile().then(
      resp => {
        console.log('profile----', resp);
        if (!resp) return;
        var picurls = [];
        picurls[0] = resp.item.avatar;
        this.setData({
          mobile: resp.item.mobile,
          avatar: resp.item.avatar,
          bindBank: resp.item.bindBank,
          nick: resp.item.nick,
          showIntegral: resp.item.showIntegral,
          integral: resp.item.integral,
          picUrls: picurls,
        })
        app.globalData.avatar = resp.item.avatar
        app.globalData.nick = resp.item.nick
      },
      e => {
        console.log(e)
        wx.showToast({
          title: e.message, icon: 'error'
        })
      }
    );
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    // this.refreshData();
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo    
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })    
  },

  gotoBindCard: function(e){
    wx.navigateTo({
      url: '../binding_card/binding_card',
    })
  },
  avatarpreview: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.file, // 当前显示图片的http链接
        urls: this.data.picUrls // 需要预览的图片http链接列表
    })
  },
})