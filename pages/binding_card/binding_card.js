// pages/binding_card/binding_card.js
import { bind, bankCardget } from '../../http/api';
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    cardNum: '',
    accountName: '',
    idCardNum: '',
    mobile: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // bankCardget().then(resp => {
    //   debugger
    //   if (resp) {
    //     this.setData({
    //       cardNum: resp.item.cardNum,
    //       accountName: resp.item.accountName,
    //       idCardNum: resp.item.idCardNum,
    //       mobile: resp.item.mobile
    //     })
    //   }
    // }, e => {
    //   console.log(e);
    // })
  },
  bindidCardNumInput(e) {
    var val = e.detail.value;
    this.setData({
      idCardNum: val
    })
  },
  bindaccountNameInput(e) {
    var val = e.detail.value;
    this.setData({
      accountName: val
    })
  },
  bindcardNumInput(e) {
    var val = e.detail.value;
    this.setData({
      cardNum: val
    })
  },
  bindmobileInput(e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    })
  },

  card_binding: function(){
    bind({
        cardNum: this.data.cardNum,
        accountName: this.data.accountName,
        idCardNum: this.data.idCardNum,
        mobile: this.data.mobile,
    }).then(
      resp => {
        if (pages.length >= 2) {
          var prevPage = pages[pages.length - 2];
          prevPage.refreshData();
        }

        wx.navigateBack()   
      },
      e => {
        console.log(e)
        wx.showToast({
          title: e.message, icon: 'error'
        })
      }
    );    
  },
  clearIdNumber: function() {
    this.setData({ idCardNum: '' });
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
})