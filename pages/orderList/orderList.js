// pages/orderList/orderList.js
import { orderlist } from '../../http/api';
import { formatTime } from '../../utils/util';

Page({
  data: {
    tabs: [],
    page_size: 50,
    page_num: 1,
    total: 0,
    activeTab: 0,
    windowHeight: '',
    windowWidth:'',
    contentList:[],    
    orderTime: '2021-02-12 22:24',
    orderState: ['待受理','待定损','待结算','已完成','已关闭'],
    detaildisplayState: ["none","none","block","block","none"],// none
    stateTextColor: ['#CC0000','#CC0000','#CC0000','#36AA48','#A3A3A3'],
    brandImgSrc: "../../image/bmw-logo.png",
    noresultImgSrc: "../../image/no_order.png",
    docImgSrc: "../../image/doc-img.png",
    brandName: "宝马",
    plateNum: "京Q 3RT68",
    compName: "北京国服信奥众汽车有限公司-奥迪",
    fixedLossAmount: "1,000.00",
    insuranceType: ["自保","非自保"],
    fixedLossRatio: 10,
    receivables: "1,000.00",
    orderNumber: "234324324242",
    noResultDisplayState: "none" // flex
  },
  onShareAppMessage: function (e) {
    
    return {
      title: '自定义转发标题',
      path: '/orderList/orderList'
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
    // let query = wx.createSelectorQuery();
    // query.select('.tab-content').boundingClientRect();
    // query.exec((res) => {console.log('scrol--------', res)
    //   let listHeight = res[0].height; // 获取list高度
    //     wx.getSystemInfo({
    //       success: function (height) {
    //         that.setData({
    //           scrollHeight: parseInt(height.windowHeight) - 64 - listHeight 
    //         });
    //       }
    //     });
    // })
    const titles = ['全部', '待受理', '待定损', '待结算', '已完成', '已关闭']
    // const tabs = titles.map(item => ({
    //   title: item
    // }))
    that.requestData(0);
   
    this.setData({
      tabs:titles,
      windowHeight,
      left
      
    })
  },
  onReady() {
    //this.videoContext = wx.createVideoContext('myVideo')
  },
  requestData(tabnum, appending) {
    this.setData({
      noResultDisplayState: "none",
    })

    var params = { pageNum: this.data.page_num, pageSize: this.data.page_size };
    if (tabnum) params.status = tabnum - 1;

    orderlist(params).then(
      resp => {
        console.log('OrderList ==== ', resp.item.items)
        if( resp != null) {
          var items = resp.item.items || [];
          if (items.length < 1){
            this.setData({
              noResultDisplayState: "flex",
            })
          }    
          items = items.map(item => {
            item.time = formatTime(new Date(item.time*1));
            return item;
          })

          if (appending) {
            items = this.data.contentList.concat(items);
          }
          this.setData({  
            contentList: items,
            total: resp.item.total
          })              
        }                
      },
      e => {
        console.log(e)      
        this.setData({
          noResultDisplayState: "flex",
        }) 
      }
    );      
  },
  
  gotoDetail(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+ e.currentTarget.dataset.id,
    })
  },

  onTabClick(e) {
    const index = e.detail.index    
    this.setData({
      activeTab: index,
      contentList:[],
      page_num: 1,
    }) 
    this.requestData(index)
  },

  onChange(e) {
    const index = e.detail.index    
    this.setData({
      activeTab: index,
      contentList:[],
      page_num: 1,
    })
    this.requestData(index)
  },
  handleClick(e) {
    // wx.navigateTo({
    //   url: './webview',
    // })
  },
  onPullDownRefresh(){
    // this.requestData(1,20)
  },
  loadMore: function() {
    if (this.data.total > this.data.page_size*this.data.page_num) {
      console.log("loading more...")
      this.setData({ page_num: this.data.page_num + 1 });
      this.requestData(this.data.activeTab, true);
    }
  }
})