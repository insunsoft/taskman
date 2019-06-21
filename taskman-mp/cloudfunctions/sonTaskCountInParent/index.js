// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {

    try {
        return await db.collection('tasks-list').where({
                _id: event.taskId
            })
            .update({
                data: {
                    son_Tasks_Count: _.inc(1)
                },
                success: res => {},
                fail: err => {}
            })
    } catch (e) {
        console.error(e)

    }
}