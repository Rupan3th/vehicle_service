// pages/orderDetail/orderDetail.js
import { orderdetail } from '../../http/api';
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    windowHeight: '',
    brandImgSrc: '../../image/bmw-logo.png',
    brandName: '宝马',
    plateNum: '京Q 3RT68',
    carownerName: '王迪',
    carownerPhone: '18812341234',
    insuranceComp: '中华联合车险永安车险',
    EetimatedArrivalTime: '2021/3/6 13:30',
    remarks: '如果没有内容就只显示 - 即可，现在是多\n文字的显示演示',
    fixedLossAmount: '1000.00',
    insuranceType: ['自保','非自保'],
    instype: 0,
    dispute: ['无','进店争议','定损价格争议','结算比例争议'],
    controversial: 0,
    idCardFPicUrl: "",
    idCardBPicUrl: "",
    settlementRat: 10,
    settlementAmount: '100.00',
    settlementStatus: ['未结算','已结算'],
    setState: 0,
    carPicUrls: [],
    damagePicUrls: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const that = this
    var windowHeight = '',left=''
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        let height=res.windowHeight
        windowHeight = height
        left=(res.screenWidth - 50)/2
      }
    })
    console.log('parameter ======= ', options.id)
    orderdetail({ id: options.id}).then(
      resp => {
        console.log('orderdetail ==== ', resp)
        if( resp != null){              
          this.setData({  
              brandName: resp.item.brand ,
              brandImgSrc: resp.item.brandUrl,
              plateNum: resp.item.plate ,
              carownerName: resp.item.userName,
              carownerPhone: resp.item.mobile ,
              insuranceComp: resp.item.insuranceName,
              EetimatedArrivalTime: util.formatTime(new Date(resp.item.arrival*1)),
              remarks: resp.item.note || '',
              fixedLossAmount: resp.item.damageAmount || '',
              instype: resp.item.insuranceType || 0,
              controversial: resp.item.dispute || 0,
              idCardFPicUrl: resp.item.idCardFPicUrl,
              idCardBPicUrl: resp.item.idCardBPicUrl,
              settlementRat: resp.item.settlementRate || '',
              settlementAmount: resp.item.settlementAmount || '',
              setState: resp.item.settlementStatus, 
              carPicUrls: resp.item.carPicUrls, 
              damagePicUrls: resp.item.damagePicUrls || [], 
          })
            
        }      
      },
      e => {
        console.log(e)
      }
    );  
  },

  gotoPhotoView: function(e){
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../logs/logs?sid='+e.currentTarget.dataset.sid,
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

  },

  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.file, // 当前显示图片的http链接
        urls: this.data.carPicUrls // 需要预览的图片http链接列表
    })
  },
  previewIdCard: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: [this.data.idCardFPicUrl, this.data.idCardBPicUrl]// 需要预览的图片http链接列表
    })
  },
  damageImage: function(e){
    wx.previewImage({
        current: e.currentTarget.dataset.file, // 当前显示图片的http链接
        urls: this.data.damagePicUrls // 需要预览的图片http链接列表
    })
  },
})