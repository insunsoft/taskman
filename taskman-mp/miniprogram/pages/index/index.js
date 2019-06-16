//index.js
const app = getApp()
const promisify = require('../../utils/promisify')
Page({
    data: {
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        TabCur: 0,
        scrollLeft: 0,
        taskStyle: false,
        fileStyle: true,
        currDate: '',
        modalShow: false,
        inputTxt: '',
        tasksData: [],
        openId: '',
        annexRecord: [],
        getDate: null,
        isIPXr: app.globalData.isIPXr,
        isIOS: app.globalData.isIOS,
        baseUrl: app.globalData.baseUrl,
    },
    tabSelect(e) {
        const taskStyle = e.currentTarget.dataset.id === 0 ? false : true
        const fileStyle = e.currentTarget.dataset.id === 1 ? false : true
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            taskStyle: taskStyle,
            fileStyle: fileStyle
        })
    },
    addTask: function() {
        this.setData({
            modalShow: true
        })
    },
    addTaskCancel: function() {
        this.setData({
            modalShow: false
        })
    },
    itemClick: function() {
        wx.navigateTo({
            url: '../detailTasks/detailTasks'
        })
    },
    formSubmit: function(e) {
        const {
            baseUrl
        } = this.data;
        //添加任务确定
        if (e.detail.value.input) {
            wx.request({
                url: `${baseUrl}/api/addtasks`,
                data: {
                    task_name: e.detail.value.input,
                    has_pTasks: false,
                    has_tasks: true, //默认有子任务
                    task_progress: 0,
                    _openid: wx.getStorageSync('_openid'),
                    task_time: null, //插入时不会报错
                    task_person: '' //插入时不会报错
                },
                method: 'POST',
                success: res => {
                    console.log('添加返回信息', res)
                    this.setData({
                        inputTxt: ''
                    })
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.onLoad()
                }
            })
        } else {
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
    addTaskX: function() {
        this.setData({
            modalShow: false
        })
    },
    onLoad: function() {
        const date = new Date()
        const currDate = date.toLocaleDateString()
        const {
            baseUrl
        } = this.data
        this.setData({
            currDate: currDate
        })
        if (!wx.cloud) {
            wx.redirectTo({
                url: '../chooseLib/chooseLib'
            })
            return
        }
        //获取任务列表  需要优化最多一次取 100 条
        console.log(this.data.userInfo)
        wx.login({
            success: res => {
                var code = res.code
                if (code) {
                    promisify(wx.request)({
                            url: `${baseUrl}/api/login`,
                            data: {
                                code: code
                            },
                            method: 'POST'
                        })
                        .then(res => {
                            const {
                                _openid = ''
                            } = res.data.data
                            console.log('res.data: ', _openid);
                            /**
                             * 需要优化
                             */
                            wx.setStorage({
                                key: '_openid',
                                data: _openid,
                            })
                            // 查询当前openId下的所有小任务
                            promisify(wx.request)({
                                url: `${baseUrl}/api/gettasks?_openid=${_openid}`,
                                method: 'GET'
                            }).then(res => {
                                const {
                                    data: tasksData
                                } = res.data

                                tasksData.map(item => {
                                    item.task_time = item.task_time ?
                                        item.task_time.substring(0, 10) :
                                        null
                                })
                                // 按进度大小排序
                                let tasksDataT = tasksData.sort((x, y) => {
                                    return x.task_progress - y.task_progress
                                })
                                this.setData({
                                    tasksData: tasksDataT
                                })
                            })
                        })
                        .catch(res => {
                            console.log('异常信息', res)
                        })
                } else {
                    console.log('获取用户登录态失败：' + res.errMsg)
                }
            }
        })
        // 获取用户信息
        wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                app.globalData.avatarUrl = res.userInfo.avatarUrl
                                app.globalData.userInfo = res.userInfo
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
                success: res => {
                    let dateRec = res.data.data || []
                    let dateRecSort = dateRec.sort((x, y) => {
                        return y.createdDate - x.createdDate
                    })
                    dateRecSort.map(item => {
                        let date = new Date(item.createdDate)
                        const y = date.getFullYear()
                        const m = date.getMonth() + 1
                        const d = date.getDate()
                        const h = date.getHours()
                        const mm = date.getMinutes()
                        const s = date.getSeconds()
                        item.createdDate =
                            y +
                            '/' +
                            this.add0(m) +
                            '/' +
                            this.add0(d) +
                            ' ' +
                            this.add0(h) +
                            ':' +
                            this.add0(mm) +
                            ':' +
                            this.add0(s)
                        item.createdDay = y + '/' + this.add0(m) + '/' + this.add0(d)
                        if (date.getHours() >= 0 && date.getHours() <= 12) {
                            item.relativeUrl = '上午'
                        } else {
                            item.relativeUrl = '下午'
                        }
                    })

                    this.setData({
                        annexRecord: dateRecSort
                    })
                }
            })
    },
    add0: function(m) {
        return m < 10 ? '0' + m : m
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
    openDocument: function(e) {
        const dUrl = e.currentTarget.dataset.durl
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