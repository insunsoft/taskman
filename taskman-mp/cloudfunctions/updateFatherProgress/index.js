// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {

    const parent_id = event.parent_id;
    const fatherProgress = event.fatherProgress;

    try {
        return await db.collection('tasks-list').where({
                _id: _.eq(parent_id)
            })
            .update({
                data: {
                    task_progress: fatherProgress
                },
                success: res => {},
                fail: err => {}
            })
    } catch (e) {
        console.error(e)
    }
}