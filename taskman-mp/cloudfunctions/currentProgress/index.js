// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {

  const taskId = event.taskId;


  try {
    //将fatherProgress 插入父节点的任务进度中
    return await db.collection('tasks-list').where({
      _id: _.eq(taskId)
    })
      .update({
        data: {
          task_progress: 0
        },
        success: res => {
          console.log('更新父节点的进度---', res)
        },
        fail: err => {
          console.log('更新父节点的进度--err', err)
        }
      })
  } catch (e) {
    console.error(e)
  }
}
