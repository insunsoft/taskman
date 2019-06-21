// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {

    try {
        return await db.collection('tasks-list').where({
                _id: event.task_id
            })
            .update({
                data: {
                    task_sender: event.task_sender,
                    task_receive: event.task_receive,
                    task_person: event.task_person,
                    task_personavater: event.task_personavater,
                },
                success: res => {},
                fail: err => {}
            })
    } catch (e) {
        console.error(e)

    }
}