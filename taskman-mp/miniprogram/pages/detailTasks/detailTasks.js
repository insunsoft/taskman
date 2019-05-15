// miniprogram/pages/detailTasks/detailTasks.js
const app = getApp()
const promisify = require('../../utils/promisify')

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		taskId: '',
		closeModalShow: false,
		date: '',
		visible: false,
		hasFather: false,
		hasSon: false,
		sliderEdit: false,
		closeModalShow: false,
		listData: [],
		sonTasks: [],
		fatherTasks: [],
		filterList: {},
		pageDisplay: true,
		sonTasksCount: 0,
		formData: {},
		inviteModal: false,
		valueSonTasksInput: '',
		haSonTag: false,
		fatherProgress: 0,
		otherSonProgress: 0,
		getPTask: {},
		parent_id_ptask: '',
		isIPX: app.globalData.isIPX,
		isIPXr: app.globalData.isIPXr,
		isIPXs: app.globalData.isIPXr, //当前设备是否为 iPhone Xs
		isIPXsMax: app.globalData.isIPXr,
		baseUrl: app.globalData.baseUrl,
		IPAdapt: false,
		parentId: 'ww'
	},
	onAllTasks: function() {
		const { baseUrl } = this.data
		// 调用云函数
		promisify(wx.request)({
			url: `${baseUrl}/api/getTasksById`,
			data: {
				task_id: this.data.taskId
			}
		}).then(res => {
			this.setData({
				filterList: res.data.data[0]
			})
			console.log('本条数据', res.data.data[0])
			// 根据_id查找子任务
			const _id = this.data.filterList._id
			promisify(wx.request)({
				url: `${baseUrl}/api/getSonTaskById`,
				data: {
					_id: _id
				}
			}).then(res => {
				const { data: records } = res
				if (records.code === 200) {
					this.setData({
						hasSon: true,
						sonTasks: records.data
					})
				}
			})
			// 查找父节任务
			const parentId = this.data.filterList.parent_id
			promisify(wx.request)({
				url: `${baseUrl}/api/getFatherTaskById`,
				data: {
					parentId: parentId
				}
			}).then(res => {
				const { data: records } = res
				if (records.code === 200) {
					this.setData({
						fatherTasks: records.data[0],
						hasFather: true
					})
				}
			})
		})
	},
	hide() {
		this.setData({
			visible: false
		})
	},
	onChange(e) {
		this.setData({
			visible: e.detail.visible
		})
	},
	bindDateChange(e) {
		this.setData({
			date: e.detail.value
		})
	},
	formSubmitSonTask: function(e) {
		const { baseUrl } = this.data
		/**
		 * 添加子任务
		 */
		if (e.detail.value.task_name) {
			promisify(wx.request)({
				url: `${baseUrl}/api/addSonTask`,
				data: {
					task_name: e.detail.value.task_name,
					parent_id: this.data.taskId,
					has_pTasks: true,
					has_tasks: true, // 默认是有子任务
					task_progress: 0,
					_openid: wx.getStorageSync('_openid')
				},
				method: 'POST'
			}).then(res => {
				this.setData({
					valueSonTasksInput: ''
				})
				wx.showToast({
					title: '添加成功',
					icon: 'success',
					duration: 2000
				})
				this.setData({
					closeModalShow: false,
					hasSon: true
				})
				//this.onLoad();
			})

			//将父任务的子任务个数+1
			wx.cloud.callFunction({
				name: 'sonTaskCountInParent',
				data: {
					taskId: this.data.taskId
				}
			})

			this.onLoad({ id: this.data.taskId })
		} else {
			wx.showToast({
				title: '先要填写任务名称',
				icon: 'none',
				duration: 2000,
				mask: false
			})
		}
	},
	addTaskCancel: function() {
		this.setData({
			closeModalShow: false
		})
	},
	addTaskX: function() {
		this.setData({
			closeModalShow: false
		})
	},
	bindDateChange(e) {
		this.setData({
			task_date: e.detail.value
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo
			})
		}
		const { isIPX, isIPXr, isIPXs, isIPXsMax } = this.data
		//适配信息
		if (isIPX || isIPXr || isIPXs || isIPXsMax) {
			this.setData({
				IPAdapt: true
			})
		}
		this.setData({
			taskId: options.id
		})
		wx.showShareMenu({
			withShareTicket: true
		})
		this.onAllTasks()
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},

	closeTask: function() {
		wx.showModal({
			title: '提示',
			content: '确定删除吗',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定')
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	formSubmitDetail: function(e) {
		wx.showToast({
			title: '你点击了完成'
		})
		const formDataT = e.detail.value
		let time = this.data.task_date
		formDataT.task_time = time //换名字存入数据库
		formDataT.task_progress = formDataT.task_progress / 100
		this.setData({
			formData: { ...this.data.formData, ...formDataT }
		})
		//更新数据
		const db = wx.cloud.database()
		const _ = db.command
		console.log('表单详情', this.data.formData)
		//根据其parentId查出它父任务的_id,再根据_id查出所有子节点并计算进度值
		//循环一下

		let thisTask_pid = this.data.filterList.parent_id //拿到本条数据的父任务的_id
		//while(this.data.parentId){
		promisify(wx.request)({
			url: `${baseUrl}/api/getParentId`,
			method: 'POST',
			data: {
				thisTask_pid: thisTask_pid,
				filterList_id: this.data.filterList._id,
				formData: this.data.formData
			}
		}).then(res => {
			console.log('getParentId', res)
			this.setData({
				parentId: res.result.getPTask.parent_id || ''
			})

			wx.cloud.callFunction({
				name: 'updateFatherProgress',
				data: {
					parent_id: thisTask_pid,
					fatherProgress: res.result.fatherProgress
				}
			})
		})
		console.log('===>', this.data.parent_id)
		//延时加载访问数据库
		wx.cloud.callFunction({
			name: 'updateDetail',
			data: {
				formData: this.data.formData,
				taskId: this.data.taskId
			},
			success: res => {
				console.log('返回', res)
			},
			fail: err => {
				console.log('错误返回', err)
			}
		})
		wx.showToast({
			icon: 'success',
			title: '保存成功'
		})
		wx.redirectTo({
			url: '../index/index',
			success: result => {},
			fail: () => {},
			complete: () => {}
		})
	},
	getParentId: function(thisTask_pid) {
		const db = wx.cloud.database()
		const _ = db.command
		let that = this

		return new Promise(function(resolve, reject) {
			db.collection('tasks-list')
				.where({
					_id: _.eq(thisTask_pid)
				})
				.get({
					success: res => {
						//保存父任务
						console.log('父任务', res)
						that.setData({
							getPTask: res.data[0],
							parent_id_ptask: that.data.getPTask.parent_id || '' //拿到父任务的id
						})
						return resolve(res.data) //????
					},
					fail: err => {
						console.log('err', err)
					}
				})
		})
	},
	addSonTasks: function() {
		this.setData({
			closeModalShow: true
		})
	},
	sliderChange: function(e) {
		const { formData } = this.data
		console.log('调查', formData)
		const value = e.detail.value / 100
		formData.task_progress = value
		const list = this.data.filterList
		list.task_progress = e.detail.value
		this.setData({
			formData: formData,
			filterList: list
		})
	},
	deleteTasks: function() {
        const { taskId, baseUrl } = this.data;
		if (this.data.sonTasks.length === 0) {
			wx.showModal({
				title: '提示',
				content: '确定要删除子任务吗',
				success: res => {
					if (res.confirm) {
						promisify(wx.request)({
							url: `${baseUrl}/api/removeTask`,
							data: { _id: taskId },
							method: 'POST'
						}).then(res => {
                            const { data: reslut } = res;
                            console.log('reslut.code', reslut)
                            if(reslut.code===200){
                                wx.showToast({
                                    title: reslut.msg,
                                    icon: 'success',
                                    duration: 1000,
                                })
                            }else{
                                wx.showToast({
                                    title: reslut.msg,
                                    icon: 'none',
                                    duration: 2000,
                                })
                            }
						})
						wx.redirectTo({
							url: '../index/index'
						})
					}
				}
			})
		} else {
            wx.showModal({
                title: '无子任务',
            })
			this.setData({ haSonTag: true })
		}
	},
	tasksPrograss: function() {
		this.setData({
			sliderEdit: false
		})
		wx.showToast({
			icon: 'none',
			title: '又点到我了'
		})
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},
	inviteFriends: function() {
		this.setData({
			inviteModal: true
		})
	},
	hideInviteModal: function() {
		this.setData({
			inviteModal: false
		})
	},
	inviteFriendBtn: function() {
		this.setData({
			inviteModal: false
		})
	},
	/**
	 * 用户点击按钮分享
	 */
	onShareAppMessage: function(res, options) {
		console.log('id', this.data.taskId)

		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res)
		} //taskId
		return {
			title: '给你分配了新任务',
			path: `pages/inviteFren/inviteFren?task_id=${
				this.data.taskId
			}&task_sender=${this.data.openId}`,
			success: function(res) {
				var shareTickets = res.shareTickets
				if (shareTickets.length == 0) {
					return false
				}
				wx.getShareInfo({
					shareTicket: shareTickets[0],
					success: function(res) {
						var encryptedData = res.encryptedData
						var iv = res.iv
						console.log('res', res)
					}
				})
				console.log('转发成功')
			},
			fail: function(res) {
				// 转发失败
				console.log('转发失败')
			}
		}
	}
})
