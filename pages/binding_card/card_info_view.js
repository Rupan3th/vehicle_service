// pages/binding_card/card_info_view.js
import { bankCardget } from '../../http/api';
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    banckcardNumber: '',
    userName: '',
    phoneNumber: '',
    idcardNumber: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    bankCardget().then(
        resp => {
          if(resp != null) {
            console.log( 'bankCard === ', resp)    
            this.setData({
              banckcardNumber: resp.item.cardNum,
              userName: resp.item.accountName,
              phoneNumber: resp.item.mobile,
              idcardNumber: resp.item.idCardNum,
            })   
          }              
        },
        e => {
          console.log(e)
          wx.showToast({
            title: e.message, icon: "error"
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

  }
})