// pages/carbrandList/carbrandList.js
const { getBrandList } = require('../../http/api.js')

Page({
  data: {    
    brands: [],
    nav: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    toView: ''
  },
  onLoad: function () {
    getBrandList().then(resp => {
      if (resp.errCode) {
        wx.showToast({title: resp.message, icon: 'error'});
      } else {
        this.setData({ brands: resp.items || [] });
      }
    }, e => {
      console.log(e);
    })
  },
  toView: function(e){
    let i = parseInt(e.currentTarget.dataset.i);
    this.setData({
      toView: this.data.nav[i]
    })
  },
  onChooseBrand: function(e){
    var pages = getCurrentPages();
    if (pages.length >= 2) {
      var prevPage = pages[pages.length - 2];
      prevPage.setData({ brand_id: e.currentTarget.dataset.id, brand_name: e.currentTarget.dataset.name, brand_url: e.currentTarget.dataset.url })
    }
    wx.navigateBack();
  },
  onShow: function () {

  },
})