/*
 * @Author: niho xue
 * @LastEditors: niho xue
 * @Date: 2019-04-08 10:27:53
 * @LastEditTime: 2019-05-15 23:36:55
 */
const Tasks = require('../db').Tasks

module.exports = {
	//新增任务
	async addTasks(ctx, next) {
		let {
			task_name = '',
			has_pTasks = false,
			has_tasks = false,
			task_progress = 0,
			_openid = '',
			task_time = null,
			task_person = ''
		} = ctx.request.body
		try {
			let tasks = new Tasks({
				task_name,
				has_pTasks,
				has_tasks,
				task_progress,
				_openid,
				task_time,
				task_person
			})
			let res = await tasks.save()
			if (res._id != null) {
				ctx.body = {
					code: 200,
					msg: '任务新建成功!',
					data: {
						_id: res._id,
						task_name: res.task_name,
						has_pTasks: res.has_pTasks,
						has_tasks: res.has_tasks,
						task_progress: res.task_progress,
						_openid: res._openid,
						task_time: res.task_time,
						task_person: res.task_person
					}
				}
			}
		} catch (err) {
			console.log('error==', error)
			ctx.body = {
				code: 500,
				msg: '任务新建失败，服务器异常'
			}
		}
	},
	//查询任务
	async getTasks(ctx, next) {
		let { _openid = '' } = ctx.query
		try {
			let res = await Tasks.find({ _openid: _openid })
			ctx.body = {
				code: 200,
				msg: '查询成功！',
				data: res
			}
		} catch (e) {
			console.log(e)
			ctx.body = {
				code: 500,
				msg: '查询失败，服务器异常，请稍后再试!'
			}
		}
	},
	//按_id查询任务
	async getTasksById(ctx, next) {
		let { task_id = '' } = ctx.query
		try {
			let res = await Tasks.find({ _id: task_id })
			ctx.body = {
				code: 200,
				msg: '查询成功！',
				data: res
			}
		} catch (e) {
			console.log(e)
			ctx.body = {
				code: 500,
				msg: '查询失败，服务器异常，请稍后再试!'
			}
		}
	},
	/**
	 * 添加子任务
	 * @param {ctx} ctx
	 * @param {next} next
	 */
	async addSonTasks(ctx, next) {
		//需要传openId过去
		let {
			task_name = '',
			parent_id = '',
			has_pTasks = true,
			has_tasks = true, // 默认是有子任务
			task_progress = 0,
			_openid = ''
		} = ctx.request.body
		try {
			let tasks = new Tasks({
				task_name,
				has_pTasks,
				has_tasks,
				task_progress,
				parent_id,
				_openid
			})
			let res = await tasks.save()
			if (res._id != null) {
				ctx.body = {
					code: 200,
					msg: '子任务新建成功!',
					data: {
						_id: res._id,
						tak_name: res.task_name,
						has_pTasks: res.has_pTasks,
						has_tasks: res.has_tasks,
						task_progress: res.task_progress,
						parent_id: res.parent_id,
						_openid: res._openid
					}
				}
			}
		} catch (error) {
			ctx.body = {
				code: 500,
				msg: '子任务新建失败，服务器异常'
			}
		}
	},
	/**
	 * 查询当前任务下的子任务列表
	 */
	async getSonTaskById(ctx, next) {
		let { _id = '' } = ctx.query
		try {
			let res = await Tasks.find({ parent_id: _id })
			ctx.body = {
				code: 200,
				msg: '查询成功！',
				data: res
			}
		} catch (error) {
			ctx.body = {
				code: 500,
				msg: error
			}
		}
	},

	/**
	 * 查询当前任务下的父任务列表
	 */
	async getFatherTaskById(ctx, next) {
		let { parentId = '' } = ctx.query
		try {
			let res = await Tasks.find({ _id: parentId })
			ctx.body = {
				code: 200,
				msg: '查询父任务成功！',
				data: res
			}
		} catch (error) {
			ctx.body = {
				code: 500,
				msg: error
			}
		}
	},
	/**
	 * 删除当前任务
	 */
	async removeTask(ctx, next) {
		let { _id = '' } = ctx.request.body
		console.log('删除的: ', _id)
		try {
			let res = await Tasks.remove({ _id: _id })
			ctx.body = {
				code: 200,
				msg: '删除成功',
				data: res
			}
		} catch (error) {
			ctx.body = {
				code: 500,
				msg: error,
				data: '服务器错误'
			}
		}
	},
	/**
	 * 查找父任务
	 */
	async updateTasks(ctx, next) {
		let { thisTask_pid = '', formData = [], _id = '' } = ctx.request.body
		console.log('thisTask_pid: ', thisTask_pid)
		try {
            if(thisTask_pid!==''){
                let res = await Tasks.find({ _id: thisTask_pid })  //----->_id不许为空
                let process = 0
                if (res.length !== 0) {
                    const parentId = res[0]._id
                    let allSonTasks = await Tasks.find({ parent_id: parentId }) // 查出所有子节点
                    console.log('allSonTasks: ', allSonTasks)
    
                    for (item in allSonTasks) {
                        process = process + item.task_progress
                    }
                    process = process.toFixed(10) / allSonTasks.length
                    console.log('process: ===>', process)
                }
            }
			
			// 注意要更新数据
			let updateRes = await Tasks.findOneAndUpdate(
				{ _id: _id },
				{ ...formData }
			)
			console.log('updateRes: ', updateRes)

			// 更新出错！！！！！
			ctx.body = {
				code: 200,
				msg: '成功',
				data: process
			}
		} catch (error) {
			ctx.body = {
				code: 200,
				msg: '失败',
				data: error
			}
		}
	}
}
