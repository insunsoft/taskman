/*
 * @Author: niho xue
 * @LastEditors: niho xue
 * @Date: 2019-04-08 10:27:53
 * @LastEditTime: 2019-04-09 18:08:00
 */
const Tasks = require('../db').Tasks;

module.exports = {

    //新增任务
    async addTasks(ctx, next){

        let { task_name = '', has_pTasks = false, has_tasks = false, task_progress = 0 } = ctx.request.body;
        try {
            let tasks = new Tasks({ task_name, has_pTasks, has_tasks, task_progress });
            let res = await tasks.save();
            if(res._id != null){
                ctx.body = {
                code: 200,
                msg: "任务新建成功!",
                data: {
                    _id: res._id,
                    task_name: res.task_name,
                    has_pTasks: res.has_pTasks,
                    has_tasks: res.has_tasks,
                    task_progress: res.task_progress,
                    _openid: res._openid
                }
            }
        }
        } catch (err) {
            console.log('error==',error);
            ctx.body = {
                code: 500,
                msg:'任务新建失败，服务器异常'
            }
        }
    },
    //查询任务
    async getTasks(ctx, next) {
        ctx.body = {
            code: 200
        }
    }
}