//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      // 判断设备是否为 iPhone X
      this.checkIsIPhoneXOrMaxOrXr()
    }
  },
  globalData : {
    formData: {},
    isIPX: false, //当前设备是否为 iPhone X
    isIPXs: false, //当前设备是否为 iPhone Xs
    isIPXr: false, //当前设备是否为 iPhone Xr
    isIPXsMax: false, //当前设备是否为 iPhone XsMax
    isIOS: false,
    _openid: '',
    baseUrl: 'http://localhost:9981', // 本地调试
    // baseUrl: 'https://task.xueshiming.cn', // 线上版本
  },
  
  checkIsIPhoneXOrMaxOrXr: function() {
    const self = this
    wx.getSystemInfo({
      success: function (res) {
        // 根据 model 进行判断
        if (res.model.search('iPhone X') != -1) {
          self.globalData.isIPX = true
        }
        if (res.model.search('iPhone XS') != -1) {
            self.globalData.isIPXs = true
        }
        if (res.model.search('iPhone XR') != -1) {
            self.globalData.isIPXr = true
        }
        if (res.model.search('iPhone XS Max') != -1) {
            self.globalData.isIPXsMax = true
        }
        if(res.system.search('iPhone')){
            self.globalData.isIOS = true
        }
        // 或者根据 screenHeight 进行判断
        // if (res.screenHeight == 812) {
        //   self.globalData.isIPX = true
        // }
      }
    })
  },
})
