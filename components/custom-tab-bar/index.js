const app = getApp()
Component({
  properties: {
    activeIndex: {
      type: Number,
      value: 0
    }
  },
  data: {
    color: "#333333",
    selectedColor: "#333333",
    centerButtonLeft: 0,
    list: [{
      "pagePath": "/pages/index/index",
      "text": "首页",
      "iconPath": "../../image/icon_home_inactive.png",
      "selectedIconPath": "../../image/icon_home.png"
    },
    {
      "pagePath": "/pages/order_req/order_req",
      "text": "发布推修单",
      "iconPath": "../../image/icon_component.png",
      "selectedIconPath": "../../image/icon_component_HL.png"
    },
    {
      "pagePath": "/pages/me/me",
      "text": "我的",
      "iconPath": "../../image/icon_me_inactive.png",
      "selectedIconPath": "../../image/icon_me.png"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const selectedIndex = data.index;
      if(selectedIndex == 2){
        if(app.globalData.token != null){      
          const url = this.data.list[selectedIndex].pagePath;      
          wx.switchTab({url})
        }else{
          var pages = getCurrentPages();
          var prevPage = pages[0];
          prevPage.setData({ modalStateFull: 'block', dialoglogin: 'flex' })        
        }          
      }else{
        const url = this.data.list[selectedIndex].pagePath;      
        wx.switchTab({url})
      }    
      // this.setData({
      //   selected: data.index
      // })
    },

    gotoReq(){
      if(app.globalData.token != null){      
        wx.navigateTo({
          url: '/pages/order_req/order_req',
        })  
      }else{
        var pages = getCurrentPages();
        var prevPage = pages[0];
        prevPage.setData({ modalStateFull: 'block', dialoglogin: 'flex' })        
      }          
    }
  }
})