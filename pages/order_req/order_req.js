const { uploadImage } = require("../../http/api");

// pages/order_req/order_req.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand_id: '',
    brand_name: '',
    brand_url: '',
    carnum: ['京', ],
    username: '',
    mobile: '',
    insurance_id: '',
    insurance_name: '',
    picker_03_data:[],
    note: '',
    car_pics: [{}, {}, {}, {}],
    driving_pics: [{}, {}],
    id_pics: [{}, {}],

    windowHeight: 0,
    incorrectPhone:'格式有误',
    arrivalTtimeplaceholder: '请选择预约到店时间', //请选择预约到店时间
    charNumber: 0,
    modalStateFull: 'none',
    
    isShow_03: false,
    listData_03:[ ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                  ['1日','2日','3日','4日','5日','6日','7日','8日','9日','10日','11日','12日','13日','14日','15日','16日',
                  '17日','18日','19日','20日','21日','22日','23日','24日','25日','26日','27日','28日','29日','30日','31日'],
                  ['0时','1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时',
                  '12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时']],
    // 省份简写
    provinces: [
      ['京', '津', '渝', '沪', '冀'],
      ['晋', '辽', '吉', '黑', '苏'],
      ['浙', '皖', '闽', '赣', '鲁'],
      ['豫', '鄂', '湘', '粤', '琼'],
      ['川', '贵', '云', '陕', '甘'],
      ['青', '蒙', '桂', '宁', '新'],
      ['藏', '台', '空', '港', '澳'],
      ['临', '警', '挂', '学', '使'],
      ['领', '海'],
    ],
    
    numbers: [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
      ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"],
      ["W", "X", "Y", "Z", "港", "澳", "学"]
    ],
    showNewPower: false,
    KeyboardState: 'none',
    KeyboardNumState: 'none',

    //////////////////////////
    focus: false,
    val: '',

    nav: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    toView: '',
  },
  // 选中点击设置
  bindChoose(e) {
    if (!this.data.carnum[6] || this.data.showNewPower) {
      var arr = [];
      arr[0] = e.target.dataset.val;
      console.log(this.data.carnum);
      if(this.data.carnum.length < 8){
        this.data.carnum = this.data.carnum.concat(arr)
      }      
      console.log(this.data.carnum);
      this.setData({
        carnum: this.data.carnum
      })      
    }
  },

  bindChooseProv(e) {    
      var arr = Object.assign([], this.data.carnum);   
      arr[0] = e.target.dataset.val;
      this.setData({
        carnum: arr,
        KeyboardState: "none",
        modalStateFull: "none",
      })
      console.log(this.data.carnum);
    
  },
  bindDelChoose() {
    if (this.data.carnum.length != 1) {
      this.data.carnum.splice(this.data.carnum.length - 1, 1);
      this.setData({
        carnum: this.data.carnum
      })
    }
  },
  showPowerBtn() {
    this.setData({
      showNewPower: true,
      KeyboardNumState: "block"
    })
  },
  closeKeyboard() {
    this.setData({
      KeyboardState: "none",
      modalStateFull: "none",
    })
  },
  closeNumKeyboard() {
    this.setData({
      KeyboardNumState: "none"
    })
  }, 
  openKeyboard() {
    this.setData({
      KeyboardState: "block",
      modalStateFull: "block",
      KeyboardNumState: "none",
    })
  },
  openNumKeyboard() {
    this.setData({
      KeyboardNumState: "block"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    const that = this
    const systemInfo = wx.getSystemInfoSync();
    this.setData({ windowHeight: systemInfo.windowHeight });
  },

   /***********    photo uploader   **********/
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            that.setData({
                files: that.data.files.concat(res.tempFilePaths)
            });            
        }
    })
  },
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.files // 需要预览的图片http链接列表
      })
  },
/***********    \\\\\photo uploader   **********/

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '发布推修单',
      path: 'pages/order_req/order_req'
    }
  },

  showPicker_03: function () {
    this.setData({
      isShow_03: true
    })
  },
  sureCallBack_03 (e) {
    let data = e.detail
    this.setData({
      isShow_03: false,
      arrivalTtimeplaceholder: "",
      picker_03_data: e.detail.choosedData,
    })
  },
  cancleCallBack_03 () {
    this.setData({
      isShow_03: false,
    })
  },

// 删除图片
clearImg:function(e){
  var nowList = [];//新数据
  var uploaderList = this.data.uploaderList;//原数据
  
  for (let i = 0; i < uploaderList.length;i++){
      if (i == e.currentTarget.dataset.index){
          continue;
      }else{
          nowList.push(uploaderList[i])
      }
  }
  this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
  })
},

gotoBrandList: function() {
  wx.navigateTo({
    url: '../carbrandList/carbrandList'
  })
},
openInsuranceList: function() {  
  wx.navigateTo({
    url: '../insuranceList/insuranceList'
  })
},


selectCarBrand: function(e) {
  this.setData({
    carbarandListView:'none',
    brandName: e.currentTarget.dataset.name
    // brandName: name
  })
  // console.log(e.currentTarget.dataset.n)
},

selectInsuranceList: function(e) {
  this.setData({
    insuranceListView:'none',
    insuranceCompany: e.currentTarget.dataset.name
  })
},

//////////////////////////////////////////////
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
  },
  onInputUsername: function(e) {
    this.setData({ username: e.detail.value });
  },
  onInputMobile: function(e) {
    const regex = /^1\d{0,10}$/;
    let value = e.detail.value;
    if (!!value && !regex.test(value)) {
      return this.data.mobile;
    } else {
      this.setData({ mobile: value });
    }
  },
  onInputNote: function(e) {
    this.setData({ note: e.detail.value });
  },
  onChooseDamagePic: function(e) {
    let index = e.detail.index;
    let path = e.detail.path;
    let _this = this;
    if (path) {
      uploadImage(path).then(resp => {
        let pics = Object.assign([], _this.data.car_pics);
        if (resp.errCode) {
          wx.showToast({title: resp.message, icon: 'error'});
        } else {
          pics[index] = resp.item;
          _this.setData({ car_pics: pics });
        }
      }, e => {
        console.log(e);
      })
    } else {
      let pics = Object.assign([], _this.data.car_pics);
      pics[index] = {};
      this.setData({ car_pics: pics });
    }
  },
  onChooseDrivingPic: function(e) {
    let index = e.detail.index;
    let path = e.detail.path;
    let _this = this;
    if (path) {
      uploadImage(path).then(resp => {
        let pics = Object.assign([], _this.data.driving_pics);
        if (resp.errCode) {
          wx.showToast({title: resp.message, icon: 'error'});
        } else {
          pics[index] = resp.item;
          _this.setData({ driving_pics: pics });
        }
      }, e => {
        console.log(e);
      })
    } else {
      let pics = Object.assign([], this.data.driving_pics);
      pics[index] = {};
      this.setData({ driving_pics: pics });
    }
  },
  onChooseIdPic: function(e) {
    let index = e.detail.index;
    let path = e.detail.path;
    let _this = this;
    if (path) {
      uploadImage(path).then(resp => {
        let pics = Object.assign([], _this.data.id_pics);
        if (resp.errCode) {
          wx.showToast({title: resp.message, icon: 'error'});
        } else {
          pics[index] = resp.item;
          _this.setData({ id_pics: pics });
        }
      }, e => {
        console.log(e);
      })
    } else {
      let pics = Object.assign([], this.data.id_pics);
      pics[index] = {};
      this.setData({ id_pics: pics });
    }
  },
  onClickNext: function() {
    if (!this.data.brand_id) {
      this.setData({ toView: 'block_brand'});
      wx.showToast({title: '请选择车辆品牌', icon: 'error'});
    } else if (this.data.carnum.length < 7) {
      this.setData({ toView: 'block_plate' });
      wx.showToast({title: '请输入车牌号', icon: 'error'});
    } else if (!this.data.username) {
      this.setData({ toView: 'block_username' });
      wx.showToast({title: '请输入车主姓名', icon: 'error'});
    } else if (this.data.mobile.length !== 11) {
      this.setData({ toView: 'block_mobile' });
      wx.showToast({title: '请输入车主电话', icon: 'error'});
    } else if (!this.data.insurance_id) {
      this.setData({ toView: 'block_insurance' });
      wx.showToast({title: '请选择保险公司', icon: 'error'});
    } else if (this.data.picker_03_data < 3) {
      this.setData({ toView: 'block_arrival' });
      wx.showToast({title: '请输入到店时间', icon: 'error'});
    } else {
      var damage_valid_pics = this.data.car_pics.filter(pic => !!pic.key);
      if (!damage_valid_pics.length) {
        this.setData({ toView: 'block_damage_pics' });
        wx.showToast({title: '请上传受损部位照片', icon: 'error'});
      } else {
        let plate_number = this.data.carnum.slice(1).join('');
        let car_pic_keys = this.data.car_pics.filter(pic => !!pic.key).map(pic => pic.key);

        let data = {
          brandId: this.data.brand_id,
          brandName: this.data.brand_name,
          brandUrl: this.data.brand_url,
          plateNumber: plate_number,
          userName: this.data.username,
          mobile: this.data.mobile,
          insuranceId: this.data.insurance_id,
          insuranceName: this.data.insurance_name,
          arrival: this._getTimeFromPickerData(),
          carPics: car_pic_keys
        }
        
        this.data.carnum[0] && (data.plate = this.data.carnum[0]);
        this.data.note && (data.note = this.data.note);
        this.data.driving_pics[0].key && (data.drivingLicenseFPic = this.data.driving_pics[0].key);
        this.data.driving_pics[1].key && (data.drivingLicenseBPic = this.data.driving_pics[1].key);
        this.data.id_pics[0].key && (data.idCardFPic = this.data.id_pics[0].key);
        this.data.id_pics[1].key && (data.idCardBPic = this.data.id_pics[1].key);

        wx.navigateTo({
          url: '/pages/storeList/storeList?order='+JSON.stringify(data),
        })
      }
    }
  }, 
  _getTimeFromPickerData: function() {
    let month = this.data.picker_03_data[0].substring(0, this.data.picker_03_data[0].length - 1);
    let day = this.data.picker_03_data[1].substring(0, this.data.picker_03_data[1].length - 1);
    let hour = this.data.picker_03_data[2].substring(0, this.data.picker_03_data[2].length - 1);
    let date = new Date();
    date.setMonth(month-1);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0);
    if (date < new Date()) {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.getTime();
  },
  catchtap() {
    
  }
})