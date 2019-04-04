// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event-->', event)
  console.log('context-->', context)

  try {
    return await db.collection('tasks-list').where({
      _id: _.eq(event.taskId)
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
