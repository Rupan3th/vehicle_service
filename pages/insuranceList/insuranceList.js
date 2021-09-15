const { getInsuranceList } = require("../../http/api");

// pages/insuranceList/insuranceList.js
Page({
  data: {    
    insuranceList: [],
  },
  onLoad: function () {
    getInsuranceList().then(resp => {
      if (resp.errCode) {
        wx.showToast({title: resp.message, icon: 'error'});
      } else {
        this.setData({ insuranceList: resp.items || [] });
      }
    }, e => {
      console.log(e);
    })
  },
  onChooseItem: function(e) {
    var pages = getCurrentPages();
    if (pages.length >= 2) {
      var prevPage = pages[pages.length - 2];
      prevPage.setData({ insurance_id: e.currentTarget.dataset.id, insurance_name: e.currentTarget.dataset.name })
    }
    wx.navigateBack();
  },
})