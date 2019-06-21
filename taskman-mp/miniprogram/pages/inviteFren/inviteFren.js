// miniprogram/pages/inviteFren/inviteFren.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        task_sender: '',
        task_id: '',
        task_receive: '',
        agreeBtn: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options) //task_sender   task_id
        //   const task_sender = 'oAyA75FePAScc5GWh6xir_xVauR4';
        //   const task_id = 'XIdSTcDR1TiN2dJz';
        this.setData({
            task_sender: options.task_sender,
            task_id: options.task_id,
        })
        //按taskId查询项目信息
        //把头像,项目信息显示在被分享者的小程序首页面上
        //等被分享者授权成功后，此时，分享者将分享函数回调，将被分享者的头像显示在首页面上

        //数据库加一个字段，邀请者和被邀请者
        //邀请时邀请人插入在对应项目下插入标识，被邀请也是这样
        //首页查询的时候，查询有自己标识的数据
        wx.cloud.callFunction({
            name: 'login',
            success: res => {
                console.log('task_receive: ', res.result.openid)
                this.setData({
                    task_receive: res.result.openid
                })
            },
            fail: err => {
                console.log('fail', err)
            },
        })
    },
    onGotUserInfo(e) {
        //  e.detail.errMsg  getUserInfo:ok    getUserInfo:fail auth deny
        if (e.detail.errMsg === 'getUserInfo:ok') {
            this.agreeJoin();
        } else if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
            wx.showToast({
                title: '请先微信授权后操作',
                icon: 'none',
                duration: 1500,
                mask: false,
                success: (result) => {},
                fail: () => {},
                complete: () => {}
            });
        }
    },
    agreeJoin: function () {
        const db = wx.cloud.database()
        const _ = db.command
        const task_sender = 'oAyA75FePAScc5GWh6xir_xVauR4';
        const task_id = 'XIdSTcDR1TiN2dJz';
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
                                userInfo: res.userInfo,
                                agreeBtn: true
                            })
                            wx.cloud.callFunction({
                                name: 'updateTask',
                                data: {
                                    task_sender: this.data.task_sender,
                                    task_receive: this.data.task_receive,
                                    task_id: this.data.task_id,
                                    task_person: this.data.userInfo.nickName,
                                    task_personavater: this.data.userInfo.avatarUrl,
                                    //task_person:  this.data.userInfo.nickName,
                                    //task_personavater: this.data.userInfo.avatarUrl,
                                },
                                success: res => {
                                    console.log('==success: ', res)
                                },
                                fail: err => {
                                    console.log('==fail', err)
                                },
                            })
                            wx.navigateTo({
                                url: '../index/index',
                                success: (result) => {},
                                fail: () => {},
                                complete: () => {}
                            });
                        }
                    })


                } else {
                    wx.showToast({
                        title: '请先微信授权',
                        icon: 'none',
                        duration: 1500,
                        mask: false,
                        success: (result) => {

                        },
                        fail: () => {},
                        complete: () => {}
                    });
                }
            },
            fail: err => {

            }
        })
    },
    //oAyA75FePAScc5GWh6xir_xVauR4
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

    }
})