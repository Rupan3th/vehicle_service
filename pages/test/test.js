
Page({
  data: {
    tabs: [],
    activeTab: 0,
    windowHeight: '',
    windowWidth:'',
    contentList:[],
    stateTextColor: 'red',
    orderTime: '2021-02-12 22:24',
    orderState: '已关闭',
    brandImgSrc: "../../image/bmw-logo.png",
    noresultImgSrc: "../../image/noresult.png",
    docImgSrc: "../../image/doc-img.png",
    brandName: "宝马",
    plateNum: "京Q 3RT68",
    compName: "北京国服信奥众汽车有限公司-奥迪",
    fixedLossAmount: "1,000.00",
    insuranceType: "正常维修",
    fixedLossRatio: 10,
    receivables: "1,000.00",
    orderNumber: "234324324242",
    detaildisplayState: "block", // none
    noResultDisplayState: "none" // flex
  },
  onShareAppMessage: function (e) {
    
    return {
      title: '自定义转发标题',
      path: '/test/test'
    }
  },
  onLoad() {
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
    // zenjia test 
    let query = wx.createSelectorQuery();
    query.select('.weui-tabs-bar__content').boundingClientRect();
    query.exec((res) => {console.log(res)
      // let listHeight = res[0].height; // 获取list高度
        // wx.getSystemInfo({
        //   success: function (height) {
        //     that.setData({
        //       scrollHeight: parseInt(height.windowHeight) - 64 - listHeight 
        //     });
        //   }
        // });
    })
    const titles = ['全部', '待受理', '待定损', '待结算', '已完成', '已关闭']
    // const tabs = titles.map(item => ({
    //   title: item
    // }))
    that.requestData(1,10);
   
    this.setData({
      tabs:titles,
      windowHeight,
      left
      
    })
  },
  onReady() {
    //this.videoContext = wx.createVideoContext('myVideo')
  },
  requestData(page,count) {
    if(!count){
      count=10
    }
    wx.request({
      url: 'https://api.apiopen.top/getJoke?page='+page+'&count='+count+'&type=video',
      success: (result) => {
        console.log(result.data.result)
        result.data.result.forEach(n => {
          n.isPlaying = false;
        })
        this.setData({
          contentList:result.data.result
        })
        console.log(this.data.contentList)
      }
    })
  },
  
  gotoDetail(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?sid='+e.currentTarget.dataset.sid,
    })
  },

  onTabClick(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index,
      contentList:[]
    }) 
    console.log(index)
    this.requestData(e.detail.index+1,10)
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index,
      contentList:[]
    })
    console.log(index)
    this.requestData(e.detail.index+1,10)
  },
  handleClick(e) {
    // wx.navigateTo({
    //   url: './webview',
    // })
  },
  onPullDownRefresh(){
    this.requestData(1,20)
  },
  refresh(e){
   
    wx.request({
      url: 'https://api.apiopen.top/getJoke?page='+1+'&count='+5+'&type=video',
      success: (result) => {
        console.log(result.data.result)
       var data=this.data.contentList.concat(result.data.result)
        this.setData({
          contentList:data
        })
        
      }
    })
  }
})