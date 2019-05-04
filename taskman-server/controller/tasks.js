/*
 * @Author: niho xue
 * @LastEditors: niho xue
 * @Date: 2019-04-08 10:27:53
 * @LastEditTime: 2019-05-04 12:30:09
 */
const Tasks = require('../db').Tasks;

module.exports = {

    //新增任务
    async addTasks(ctx, next) {

        let { task_name = '', has_pTasks = false, has_tasks = false, task_progress = 0, _openid = '', task_time = null, task_person = '' } = ctx.request.body;
        try {
            let tasks = new Tasks({ task_name, has_pTasks, has_tasks, task_progress, _openid, task_time, task_person });
            let res = await tasks.save();
            if (res._id != null) {
                ctx.body = {
                    code: 200,
                    msg: "任务新建成功!",
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
            console.log('error==', error);
            ctx.body = {
                code: 500,
                msg: '任务新建失败，服务器异常'
            }
        }
    },
    //查询任务
    async getTasks(ctx, next) {
        //console.log('ctx', ctx)
        let { _openid = '' } = ctx.query;
        //let res = Tasks.find({_openid: {$gt: _openid}});
        //console.log('res',res);
        try {
            let res = await Tasks.find({ _openid: _openid });
            ctx.body = {
                code: 200,
                msg: '查询成功！',
                data: res
            }
        } catch (e) {
            console.log(e);
            ctx.body = {
                code: 500,
                msg: '查询失败，服务器异常，请稍后再试!'
            }
        }
    },
    //按_id查询任务
    async getTasksById(ctx, next) {
        let { task_id = '' } = ctx.query;
        console.log("id,,,", task_id)
        try {
            let res = await Tasks.find({ _id: task_id });
            ctx.body = {
                code: 200,
                msg: '查询成功！',
                data: res
            }
        } catch (e) {
            console.log(e);
            ctx.body = {
                code: 500,
                msg: '查询失败，服务器异常，请稍后再试!'
            }
        }
    }
}