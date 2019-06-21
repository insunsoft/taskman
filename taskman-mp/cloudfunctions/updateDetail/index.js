// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {



    if (event.formData.task_time) {
        event.formData.task_time = new Date(event.formData.task_time);
    } else {
        event.formData.task_time = null;
    }
    try {

        return await db.collection('tasks-list').where({
                _id: _.eq(event.taskId)
            })
            .update({
                data: {
                    ...event.formData
                },
                success: res => {
                    console.log('res', res)
                },
                fail: err => {
                    console.log('err', err)
                }
            })
    } catch (e) {
        console.error(e)
    }
}