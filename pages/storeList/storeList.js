// pages/storeList/storeList.js
import { createOrder, getGarages, getBrandList, getCitylist } from '../../http/api';
import { getCutString } from '../../utils/util';
const app = getApp()

Page({
  onShareAppMessage(e) {
    console.log("用户点击了按钮开始分享", e)
      return {
        title: '门店列表',
        path: '/pages/storeList/sharedGarage?id='+e.target.dataset.id,
        // success: function (res) {
        //   console.log('shared', res);
        //   wx.navigateTo({
        //     url: '/pages/storeList/sharedGarage?id='+e.target.dataset.id
        //   })
        // },
        // fail: function(res) {
        //   console.log(res);
        // }
      }      
  },

  data: {
    orderInfo: null,
    selected_garage_id: null,
    cityId: null,
    brandId: null,
    type: null,
    garageList: [],
    total_number_garage: 0,
    total_number_loaded_page: 0,
    page_size: 50,
    loaded_pg_num: 0,
    windowHeight: '',
    scrollHeight: '',
    filterCity: '城市',
    filterBrand: '品牌',
    filterType: '类型',
    popupQzCity: 'none',
    popupQzGarage: 'none',
    brandName: '',
    modalState: 'none',
    modalStateFull: 'none',
    carbrandListHeight: '',
    carbarandListView: 'none',
    TypeListView: 'none',    
    cityListView: 'none',
    citieslistShow: [],
    windowWidth: '',
    arrowStateType: 'dropdown-arrow-type',
    arrowStateBrand: 'dropdown-arrow-brand',
    arrowStateCity: 'dropdown-arrow-city',
    selected: [],
    star_on: "../../image/star_on.png",
    star_off: "../../image/star_off.png",
    garageTypes: ['', '一类综合修理厂', '二类综合修理厂', '4S店'],
    garageTypeList: [{id: 0, name:'全部'}, {id: 1, name:'一类综合修理厂'}, {id: 2, name:'二类综合修理厂'}, {id: 3, name:'4s店'}, ],
    colorType: ['#4DB628','#333333','#333333','#333333',],    
    colorCity: [[]],
    colorBrand: [[]],
    allscolor: '#4DB628',
    allCitycolor: '#333333',
    myProvinceId: 1,
    myCityId: '',
    myCityindex: 0,
    provinceList: [],
    inputShowed: true,
    inputVal: "",
    i: 0,
    result: "",
    noResultDisplayState: 'none',//flex
    focus: false,
    val: '',
    brandlist: [],
    nav: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    toView: "A",
    checkshow: 'block',
  },

  onLoad: function(options) {
    console.log("options.order === ", options.orderInfo)
    if (options.order) {      ///   when create order, show chexk roundbtn
      this.setData({   checkshow:'block',   }) 
    }  else{
      this.setData({   checkshow:'none',    }) 
    }

    const that = this
    const system = wx.getSystemInfoSync();
    const windowHeight = system.windowHeight;   

    // get order data if this came from create order page
    let order = null;
    if (options.order) {
      order = JSON.parse(options.order);
      console.log(order);
    }
    this.setData({      
      scrollHeight: windowHeight-100,
      carbrandListHeight: windowHeight-200,
      search: this.search.bind(this),
      result: "",
      windowHeight: system.windowHeight,
      orderInfo: order
    })     
    ///////////  get car brand list  ////////////////  
    getBrandList().then(resp => {
      console.log( 'brandlist === ', resp.items ) 
      if (resp.errCode) {
        wx.showToast({title: resp.message, icon: 'error'});
      } else {
          var copied = Object.assign([], resp.items);
          for(var ii=0; ii<copied.length; ii++){
            copied[ii]['id'] = ii + 1 ;
          }
          console.log("copoed id added === ",copied)
        this.setData({ brandlist: copied });
      }
    }, e => {
      console.log(e);
    })
    ///////////  get city list  ////////////////  
    console.log('latitude, longitude == ', app.globalData.latitude, app.globalData.longitude)    
    getCitylist().then(resp => {
      console.log( 'Citylist === ', resp.items ) 
      if (resp.errCode) {
        wx.showToast({title: resp.message, icon: 'error'});
      } else {
          var copied = Object.assign([], resp.items);
          for(var ii=0; ii<copied.length; ii++){
            copied[ii]['id'] = ii + 1 ;          // id option added to provinceList
          }         
          this.setData({ provinceList: copied });          
          var copied_city= [];                    //////   cities tree close ////
          for(var i=0; i<this.data.provinceList.length; i++){
            copied_city[i]="none"
          }
          /////////////////////
          try {
            var value = wx.getStorageSync('myProvinceId')     
            var myProvinceId       
            if (value) {
              console.log("local register myProvinceId : == ", value)    
              myProvinceId =  value
              copied_city[value] = 'block';     
            }else{}
          } catch (e) {}    
          // copied[this.data.myProvinceId-1] = "block";
          var copied_color = [];
          for(var i=0; i<this.data.provinceList.length; i++){
            copied_color[i] = [];
            for(var j=0; j<30; j++){
              copied_color[i][j]="#333333"
            }
          }             
          try {
            var valueC = wx.getStorageSync('myCityindex')
            if (valueC) {
              console.log("local register myCityindex : == ", valueC)     
              copied_color[myProvinceId][valueC] = "#36AA48";                
            }else{}
          } catch (e) {}    
          // copied_color[this.data.myProvinceId-1][this.data.myCityindex] = "#36AA48";        //cityesindex
          this.setData({
            citieslistShow: copied_city,
            colorCity: copied_color,
          })
      }
    }, e => {
      console.log(e);
    })
    ///////////////// get garage list   ///////////////
    that.requestData();
  },

  requestData() {
    let params = {
      pageNum: this.data.loaded_pg_num+1,
      pageSize: this.data.page_size,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    }
    ///////  Get CityID frome local storage    
    try {
      var value = wx.getStorageSync('cityId')
      if (value) {
        console.log("local register cityId : == ", value)
        params.cityId = value
      }else{        
        this.setData({
          popupQzCity:'flex', 
          modalStateFull: 'block',
        })
      }
    } catch (e) {}    
    try {
      var value = wx.getStorageSync('cityName')
      if (value) {
        console.log("local register cityName : == ", value)
        this.setData({
          filterCity: value
        })
      }else{
        this.setData({
          popupQzCity:'flex', 
          modalStateFull: 'block',
        })
      }
    } catch (e) {}    
    // add more params
    getGarages(params).then(resp => {
      if (resp.errCode) {
        wx.showToast({
          title: resp.message, icon: "error"
        })
      } else {
        console.log('storelist === ', params, resp);
        this.setData({garageList: resp.item.items || [], loaded_pg_num: resp.item.pageNum, total_number_garage: resp.item.total });
        if(this.data.garageList.length < 1){
          this.setData({
            noResultDisplayState: "flex",
          })
        }    
      }
    }, e => {
      console.log(e);
    })
  },

  onChooseGarage(e){
    if (this.data.orderInfo) {
      // need to raise confirm dialog
      this.setData({
        popupQzGarage:'flex', 
        modalStateFull: 'block',
        selected_garage_id: e.currentTarget.dataset.id,        
      }) 
    } else {  
    }
    var copied = [];
    for(var i=0; i< this.data.garageList.length; i++){
      copied[i] = 0
    }
    copied[e.currentTarget.dataset.index] = 1    
    this.setData({
      selected: copied
    })
    console.log("Garage selected number : ===", e.currentTarget.dataset.index, copied, this.data.selected)
  },

  loadMore: function() {
    if (this.data.total_number_garage > this.data.page_size*this.data.loaded_pg_num) {
      this.requestGarageList(this.data.loaded_pg_num, true);
    }
  },  

  search: function (value) {
    this.setData({ inputVal: value });
    this.requestGarageList(0);    
  },
  selectResult: function (e) {
      console.log('select result', e.detail)     
      this.setData({ 
        inputVal : "搜索结果2"
      })
      // new Promise((resolve, reject) => {
      //   resolve([])
      // })
      
  },

  ////////----car brandlist open //////////////
  drop_selectBrand: function() {     
    if(this.data.carbarandListView == 'none') {
      this.setData({
        carbarandListView:'block',         
        arrowStateBrand: 'dropdown-arrow-brand-r',
        cityListView:'none',
        arrowStateCity: 'dropdown-arrow-city',
        TypeListView:'none',  
        arrowStateType: 'dropdown-arrow-type',     
        modalState: 'block'
      })
    }else{
      this.setData({
        carbarandListView:'none',
        arrowStateBrand: 'dropdown-arrow-brand',
        modalState: 'none'
      })
    }
  },
  selectAllbrand: function(e){
    var copied = [] ;   
    for(var ii=0; ii<this.data.brandlist.length; ii++  ){
      copied[ii] = [];
      for(var jj=0; jj<this.data.brandlist[ii].list.length; jj++){
        copied[ii][jj] = '#333333';
      }
    }
    this.setData({
      loaded_pg_num: 0,
      colorBrand: copied,
      brandId: '0',
      filterBrand: '品牌',      
      allscolor: '#4DB628',
      garageList: [],
      noResultDisplayState: 'none',
      carbarandListView: 'none',
      modalState: 'none'
    })    
    this.requestGarageList(0)
  },
  selectCarBrand: function(e) {
    var copied = [] ;   
    let i = parseInt(e.currentTarget.dataset.init)-1; 
    let j = parseInt(e.currentTarget.dataset.index); 
    
    for(var ii=0; ii<this.data.brandlist.length; ii++  ){
      copied[ii] = [];
      for(var jj=0; jj<this.data.brandlist[ii].list.length; jj++){
        copied[ii][jj] = '#333333';
      }
    }
    copied[i][j] = '#4DB628';

    this.setData({
      loaded_pg_num: 0,
      colorBrand: copied,
      brandId: e.currentTarget.dataset.id,
      filterBrand: getCutString(e.currentTarget.dataset.name),
      allscolor: '#333333',
      garageList: [],
      noResultDisplayState: 'none',
      carbarandListView: 'none',
      modalState: 'none'
    })
    this.requestGarageList(0)  
  },

  setFocus: function () {
    this.setData({
      focus: !this.data.focus,
      val: ''
    })
  },
  toView:function(e){
    let i = parseInt(e.currentTarget.dataset.i);    
    this.setData({      
      toView: this.data.nav[i]     
    })
    // console.log(this.data.toView);
  },

  /////////
  ////////---- select type open //////////////
  drop_selectType: function() {     
    if(this.data.TypeListView == 'none') {
      this.setData({
        TypeListView:'block',
        arrowStateType: 'dropdown-arrow-type-r',
        carbarandListView:'none',
        arrowStateBrand: 'dropdown-arrow-brand',
        cityListView:'none',
        arrowStateCity: 'dropdown-arrow-city',
        modalState: 'block'
      })
    }else{
      this.setData({
        TypeListView:'none',
        arrowStateType: 'dropdown-arrow-type',
        modalState: 'none'
      })
    }
  },
  selectgarageType: function(e) {
    var copied = Object.assign([], this.data.colorType);
    for(var i=0; i<copied.length; i++){
      copied[i]="#333333"
    }
    copied[e.currentTarget.dataset.index] = '#4DB628';
    console.log(e.currentTarget.dataset.index)
    let type = e.currentTarget.dataset.id;
    let filterType = type == 0 ? '类型' : getCutString(e.currentTarget.dataset.name);
    this.setData({
      loaded_pg_num: 0,
      type: type,
      filterType: filterType,
      colorType: copied,
      garageList: [],
      noResultDisplayState: "none",
      modalState: 'none',
      TypeListView: 'none',
    })
    this.requestGarageList(0)
  },
  /////////////////
  ////////---- select City open //////////////
  drop_selectCity: function() {     
    if(this.data.cityListView == 'none') {
      this.setData({
        cityListView:'block',
        arrowStateCity: 'dropdown-arrow-city-r',
        carbarandListView:'none',
        arrowStateBrand: 'dropdown-arrow-brand',
        TypeListView:'none',
        arrowStateType: 'dropdown-arrow-type',
        modalState: 'block'
      })
    }else{
      this.setData({
        cityListView:'none',
        arrowStateCity: 'dropdown-arrow-city',
        modalState: 'none'
      })
    }
  },
  opencitiesList: function(e){
    var copied= [];
    // var copied = Object.assign([], this.data.citieslistShow);
    for(var i=0; i<this.data.provinceList.length; i++){
      copied[i]="none"
    }
    copied[e.currentTarget.dataset.idx] = 'block';    
    wx.setStorage({
      key:"myProvinceId",
      data: e.currentTarget.dataset.idx
    })
    this.setData({
      citieslistShow: copied,
      // brandName:
    })        
  },
  selectCityName: function(e) {
    var copied_color = [];
    for(var i=0; i<this.data.provinceList.length; i++){
      copied_color[i] = [];
      for(var j=0; j<30; j++){
        copied_color[i][j]="#333333"
      }
    }   
    console.log(e.currentTarget.dataset.pid)
    copied_color[e.currentTarget.dataset.pid-1][e.currentTarget.dataset.index] = "#36AA48";    
    console.log("e.currentTarget.dataset.index === ", e.currentTarget.dataset.index)    
    this.setData({
      // cityListView:'none',      
      // arrowStateType: 'dropdown-arrow-city',
      // modalState: 'none' ,
      loaded_pg_num: 0,
      cityId: e.currentTarget.dataset.id,
      filterCity: getCutString(e.currentTarget.dataset.name),
      myProvinceId: e.currentTarget.dataset.pid,
      myCityindex: e.currentTarget.dataset.index,
      colorCity: copied_color,
      allCitycolor: '#333333',
      garageList: [],
      noResultDisplayState: "none",
      modalState: 'none',
      cityListView: 'none',
    })
    console.log(this.data.colorCity)
    wx.setStorage({
      key:"myCityindex",
      data: '0'
    })
    wx.setStorage({
      key:"cityId",
      data: e.currentTarget.dataset.index + ''
    })
    wx.setStorage({
      key:"cityName",
      data: e.currentTarget.dataset.name
    })
    this.requestGarageList(0)
  },
  selectAllCity: function(e){
    var copied_color = [];
    for(var i=0; i<this.data.provinceList.length; i++){
      copied_color[i] = [];
      for(var j=0; j<30; j++){
        copied_color[i][j]="#333333"
      }
    }   
    this.setData({
      loaded_pg_num: 0,
      colorCity: copied_color,            
      allCitycolor: '#4DB628',
      cityId: '0',
      filterCity: '城市',
      garageList: [],
      noResultDisplayState: "none",
      modalState: 'none',
      cityListView: 'none',
    })
    this.requestGarageList(0)
  },
  onConfirmChooseGarage: function(e) {
    this.setData({
      popupQzGarage:'none', 
      modalStateFull: 'none' 
    }) 

    // call create garage api
    let order = Object.assign({}, this.data.orderInfo);
    order.garageId = this.data.selected_garage_id;
    createOrder(order).then(resp => {
      if (resp.errCode) {
        wx.showToast({title: resp.message, icon: 'error'});
      } else {
        // go to my order list page...........
        wx.navigateTo({
          url: '/pages/orderList/orderList',
        })
      }
    }, e => {
      console.log(e);
    })
  },
  onCancelChooseGarage: function(e) {
    let copied = Object.assign({}, this.data.garageList);
    for(var i=0; i<copied.length; i++){
      copied[i] = 0
    }    
    this.setData({
      selected: copied,
      popupQzGarage:'none', 
      modalStateFull: 'none'
    })    
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

  selectotherCity(){
    this.setData({
      popupQzCity:'none', 
      modalStateFull: 'none',
    })
    this.drop_selectCity()
  },
  cancleotherCity(){
    this.setData({
      popupQzCity:'none', 
      modalStateFull: 'none',
    })
  },

  requestGarageList(loaded_pg_num, appending) {
    if (loaded_pg_num && loaded_pg_num < this.data.loaded_pg_num) return;
    
    this.setData({ loaded_pg_num: this.data.loaded_pg_num + 1});
    let params = {
      pageNum: loaded_pg_num + 1,
      pageSize: this.data.page_size,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    }
    if( this.data.cityId != null && this.data.cityId != '0' ) { params.cityId = parseInt(this.data.cityId) }
    if( this.data.brandId != null && this.data.brandId != '0') { params.brandId = parseInt(this.data.brandId) }
    if( this.data.type != null && this.data.type != '0') { params.type = parseInt(this.data.type) }
    if( this.data.inputVal != null && this.data.inputVal != "") { params.keyword = this.data.inputVal }
    console.log(this.data.cityId, this.data.brandId, this.data.type, this.data.inputVal, params)
    getGarages(params).then(resp => {
      if (resp.errCode) {
        wx.showToast({
          title: resp.message, icon: "error"
        })
      } else {
        console.log('storelist === filter ', resp);
        let items = resp.item.items || [];
        if(items.length < 1){
          this.setData({
            noResultDisplayState: "flex",
          })
        }   
        if (appending) {
          items = this.data.garageList.concat(items);
        }
        this.setData({garageList: items, loaded_pg_num: resp.item.pageNum, total_number_garage: resp.item.total });           
      }      
    }, e => {
      console.log(e);
    })
     
  },

  sharingGarage(e){
    wx.navigateTo({
      url: '../storeList/sharedGarage?id='+e.currentTarget.dataset.id,
    })
  }
})