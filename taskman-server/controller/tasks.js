/*
 * @Author: niho xue
 * @LastEditors: niho xue
 * @Date: 2019-04-08 10:27:53
 * @LastEditTime: 2019-06-21 15:16:17
 */
const Tasks = require('../db').Tasks

module.exports = {
    //新增任务
    async addTasks(ctx, next) {
        let {
            a = '',
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
        let {
            _openid = ''
        } = ctx.query
        try {
            let res = await Tasks.find({
                _openid: _openid
            })
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
        let {
            task_id = ''
        } = ctx.query
        try {
            let res = await Tasks.find({
                _id: task_id
            })
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
        let {
            _id = ''
        } = ctx.query
        try {
            let res = await Tasks.find({
                parent_id: _id
            })
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
        let {
            parentId = ''
        } = ctx.query
        try {
            let res = await Tasks.find({
                _id: parentId
            })
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
        let {
            _id = ''
        } = ctx.request.body
        console.log('删除的: ', _id)
        try {
            let res = await Tasks.remove({
                _id: _id
            })
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
        let {
            thisTask_pid = '', formData = [], _id = '', has_pTasks
        } = ctx.request.body
        console.log('thisTask_pid: ', thisTask_pid)
        let currentProgress = formData.task_progress // 当前任务的进度
        let process = 0
        let res = []
        try {
            if (thisTask_pid !== '') {
                res = await Tasks.find({
                    _id: thisTask_pid
                }) // _id不许为空 查出父任务数据
                console.log('res: ', res)
                let flag = has_pTasks // ---has_Ptasks???
                const resTmp = res[0]
                // let kk = 0
                let parentId = resTmp._id || '' // 父任务id
                while (flag) {
                    process = 0
                    let processDigits = 0
                    let currentProgressDigits = 0
                    let baseNum = 0
                    let lastData = 0
                    if (res.length !== 0) {
                        console.log('parentId: ', parentId.toString())

                        let allSonTasks = await Tasks.find({
                            parent_id: parentId
                        }) // 查出所有子节点
                        console.log('allSonTasks....', allSonTasks)
                        let processTemp = 0;
                        allSonTasks
                            .filter(item => item._id.toString() !== _id)
                            .map(item => {
                                processTemp = processTemp + item.task_progress // 计算其他任务的进度值
                            })
                        console.log('processTemp: ', processTemp)
                        // 处理数据
                        processDigits = (process.toString().split('.')[1] || '').length
                        currentProgressDigits = (currentProgress.toString().split('.')[1] || '').length
                        baseNum = Math.pow(10, Math.max(processDigits, currentProgressDigits))
                        lastData = (processTemp * baseNum + currentProgress * baseNum) / baseNum
                        process = lastData / allSonTasks.length //存为父任务的进度
                        // 更新父任务的进度值
                        console.log('process: ', process)
                        let updateFathertask = await Tasks.updateOne({
                            _id: thisTask_pid
                        }, {
                            $set: {
                                task_progress: process
                            }
                        }, {
                            upsert: true
                        })
                        console.log('updateFathertask', updateFathertask)
                    }
                    // 查出parentID
                    let rest = await Tasks.find({
                        _id: parentId
                    }) // 查出本条数据 获取has_tasks
                    console.log('rest: ', rest)
                    resTmpflag = rest[0]
                    flag = rest[0].has_pTasks
                    console.log('resTmpflag.parent_id: ', resTmpflag.parent_id)
                    parentId = flag ? resTmpflag.parent_id : '' // thisTask_pid标识本任务的parentId字段的值
                    thisTask_pid = parentId
                    currentProgress = 0 // 循环过一层任务后就没用了
                    console.log('flag: ', flag)
                }
            }
            //注意要更新数据
            let updateRes = await Tasks.updateOne({
                _id: _id
            }, {
                $set: {
                    ...formData
                }
            }, {
                upsert: true
            })
            console.log('updateRes', updateRes)
            ctx.body = {
                code: 200,
                msg: '成功',
                data: updateRes
            }
        } catch (error) {
            console.log('失败原因', error)
            ctx.body = {
                code: 500,
                msg: '失败',
                data: error
            }
        }
    }
}