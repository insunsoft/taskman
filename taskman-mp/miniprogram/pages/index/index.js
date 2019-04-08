//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    TabCur: 0,
    scrollLeft: 0,
    taskStyle: false,
    fileStyle: true,
    currDate: '',
    modalShow: false,
    inputTxt:'',
    tasksData: [],
    openId: '',
    annexRecord: [],
    datatest: [{name: 1},{name: 2},{name :3}],
    getDate: null,
    dayTime: '',
    isIPXr: app.globalData.isIPXr,
    isIOS: app.globalData.isIOS,
  },
  tabSelect(e) {
    const taskStyle = e.currentTarget.dataset.id === 0 ? false : true;
    const fileStyle = e.currentTarget.dataset.id === 1 ? false : true;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      taskStyle: taskStyle,
      fileStyle: fileStyle
    });
  },
  addTask: function() {
    this.setData({
      modalShow: true
    })
  },
  addTaskCancel: function(){
    this.setData({
      modalShow: false
    })
  },
  itemClick: function(){
    wx.navigateTo({
        url: '../detailTasks/detailTasks',
      })
  },
  formSubmit: function(e){
    //添加任务确定---云开发版
    // if(e.detail.value.input){
    //     const db = wx.cloud.database()
    //     db.collection('tasks-list').add({
    //       data: {
    //         task_name: e.detail.value.input,
    //         has_pTasks: false,
    //         has_tasks: true,//默认有子任务
    //         task_progress: 0,
    //         //task_time: null, 插入时不会报错
    //         //task_task_person: '' 插入时不会报错
    //       }
    //     }).then(res => {
    //       //console.log(res)
    //       this.setData({
    //         inputTxt: '',
    //       })
    //       wx.showToast({
    //         title: '添加成功',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //       this.onLoad();
    //     })
    // }else{
    //     wx.showToast({
    //         title: '先要填写任务名称',
    //         icon: 'none',
    //         duration: 2000,
    //         mask: false
    //       })
    // }
    //添加任务确定---node.js版本
    if(e.detail.value.input){
        let that = this;
            wx.request({
                url: 'http://localhost:9981/api/addtasks',
                data: {
                        task_name: e.detail.value.input,
                        has_pTasks: false,
                        has_tasks: true,//默认有子任务
                        task_progress: 0,
                        //task_time: null, 插入时不会报错
                        //task_task_person: '' 插入时不会报错
                },
                method: 'POST',
                header: {
                'content-type': 'application/json' // 默认值
                },
                success(res) {
                console.log('添加返回信息',res)
                that.setData({
                        inputTxt: '',
                })
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.onLoad();
                }
            })
        }else{
            wx.showToast({
                title: '先要填写任务名称',
                icon: 'none',
                duration: 2000,
                mask: false
            })
        }

    this.setData({
      modalShow: false
    })
  },
  addTaskX: function(){
    this.setData({
      modalShow: false
    })
  },
  onLoad: function() {

    wx.request({
        url: 'http://localhost:9981/api/user', // 仅为示例，并非真实的接口地址
        data: {
            user_name: 'xsm',
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log('node-koa2',res)
        }
      })



    const date = new Date();
    const currDate = date.toLocaleDateString();
    let that = this;
    
    this.setData({
      currDate: currDate,
    })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    //获取系统名称
    // wx.getSystemInfo({
    //     success: function (res) {
    //         console.log(",,,,",res)
    //       that.setData({
    //         systemInfo: res
    //       });
    //     }
    // })
    //获取任务列表  需要优化最多一次取 100 条
    const db = wx.cloud.database()
    console.log(this.data.userInfo)
    // db.collection('tasks-list').where({
    // })
    //   .get({
    //     success:(res)=> {
    //       // res.data 是包含以上定义的两条记录的数组
    //       console.log("=--=>",res.data)
    //       const { data: tasksData } = res;
         
    //       tasksData.map((item)=>{
    //          item.time_start = item.time_start.substring(0,11)
    //       })
    //       this.setData({
    //         tasksData: res.data
    //       },()=>{
    //            console.log("tasksData",this.data.tasksData)
    //       })
    //     }
    //   })
    wx.cloud.callFunction({
        name: 'login',
        success: res => {
          this.setData({
              openId: res.result.openid
          })
          console.log(this.data.openId)
          wx.cloud.callFunction({
            name: 'queryTasks',
            data: {
                _openid:  this.data.openId,
            },
            success: res => {
              console.log('成功信息: ', res)
              const { data: tasksData } = res.result;
                tasksData.map((item)=>{
                    item.task_time = item.task_time?item.task_time.substring(0,10):null;
                })
                // 按进度大小排序
                let tasksDataT = tasksData.sort((x, y) => {
                    console.log('ss')
                    return x.task_progress - y.task_progress;
                })
                this.setData({
                    tasksData: tasksDataT
                })
            },
            fail: err => {
                console.log('失败信息', err)
            },
          })
        },
        fail: err => {
          
        }
    })
    //   db.collection('tasks-list').get().then(res => {
    //     // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    //     // 查询 task_sender == 当前openid   task_receive == 当前openid
    //       const { data: tasksData } = res;
    //       tasksData.map((item)=>{
    //         item.task_time = item.task_time?item.task_time.toLocaleDateString():null;
    //       })
    //       this.setData({
    //         tasksData: tasksData
    //       })
    //   })

      
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
                app.globalData.avatarUrl = res.userInfo.avatarUrl;
                app.globalData.userInfo = res.userInfo;
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })

        }
      }
    }),
    // 获取文档接口
    wx.request({
      url: 'https://wct.suixingpay.com/wx/findAll', // 仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:(res)=> {
            let dateRec = res.data.data || []
            //let that = that;
            let dateRecSort = dateRec.sort((x, y) => {
                return y.createdDate - x.createdDate;
            })
            dateRecSort.map((item)=>{
                
                let date = new Date(item.createdDate)
                const y = date.getFullYear();
                const m = date.getMonth()+1;
                const d = date.getDate();
                const h = date.getHours();
                const mm = date.getMinutes();
                const s = date.getSeconds();
                item.createdDate = y+'/'+that.add0(m)+'/'+that.add0(d)+' '+that.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
                item.createdDay = y+'/'+that.add0(m)+'/'+that.add0(d)
                if(date.getHours()>=0&&date.getHours()<=12){
                    item.relativeUrl = '上午';
                }else {
                    item.relativeUrl = '下午';
                }
            })
           
           this.setData({
            annexRecord: dateRecSort,
           })
           console.log("记录",this.data.annexRecord)
        }
      })
},
add0: function (m) {
    return m<10?'0'+m:m 
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  openDocument: function(e){
      const { annexRecord } = this.data;
      console.log("e",e)
      const dUrl = e.currentTarget.dataset.durl;
    wx.downloadFile({
        // 示例 url，并非真实存在
        url: dUrl,
        success(res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath,
            success(res) {
              console.log('打开文档成功')
            }
          })
        }
      })
  }

})
