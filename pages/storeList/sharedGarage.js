// pages/storeList/sharedGarage.js
import { garageShared } from '../../http/api';
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    garage: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options.id)
    garageShared ({ id: options.id }).then(resp => {
      console.log( 'Shared garage === ', resp ) 
      if (resp.errCode) {
        wx.showToast({title: resp.message, icon: 'error'});
      } else {        
        this.setData({ 
          garage: resp.item,
        })
      }
    }, e => {
      console.log(e);
    })
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
    console.log("用户点击了按钮开始分享", e)
    return {
      title: '门店列表',
      path: 'pages/storeList/sharedGarage?id='+e.target.dataset.id,
      success: function (e) {
        console.log('shared')
        wx.navigateTo({
          url: 'pages/storeList/sharedGarage?id='+e.target.dataset.id
        })
      }
    }      
  },

  openMap(e){
    wx.getLocation({
      type: 'wgs84', //Returns the latitude and longitude that can be used for wx.openLocation
      success (res) {
        const latitude = parseFloat(e.currentTarget.dataset.latitude)
        const longitude = parseFloat(e.currentTarget.dataset.longitude)
        console.log((e.currentTarget.dataset.latitude), (e.currentTarget.dataset.longitude))
        console.log(app.globalData.latitude, app.globalData.longitude)
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
     })
  },
})