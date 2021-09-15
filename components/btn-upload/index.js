Component({
  properties: {
    btnIndex: {
      type: Number,
      value: 0
    },
    image:  {
      type: String,
      value: ''
    },
  },
  data: {
    actionSheetHidden: true,
  },
  methods: {
    onClick: function(e) {
      this.setData({ actionSheetHidden: false });
    },
    onActionMenuClicked(e) {
      var tabIndex = e.currentTarget.dataset.index;
      let _this = this;
      this.setData({ actionSheetHidden: true });
      if (tabIndex == 0) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success(res) {
            var photo_src = res.tempFilePaths[0];
            _this.triggerEvent('selectPhoto', { index: _this.data.btnIndex, path: photo_src} );
          }
        })
      }
      else if (tabIndex == 1) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success(res) {
            var photo_src = res.tempFilePaths[0];
            _this.triggerEvent('selectPhoto', { index: _this.data.btnIndex, path: photo_src} );
          }
        })
      }
      else if (tabIndex == 2) {
        this.triggerEvent('selectPhoto', { index: this.data.btnIndex, path: null } );
      }
    },
    onCancelMenuClicked(e) {
      this.setData({ actionSheetHidden: true })
    },
    listenerActionSheet: function() {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
    },
    onClickImage: function() {
      wx.previewImage({
        urls: [this.properties.image]
      })
    }
  },
  attached() {

  }
});