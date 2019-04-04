// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async(event, context) => {

    const parent_id = event.parent_id;
    const fatherProgress = event.fatherProgress;
        console.log('parent_id',parent_id);
        console.log('fatherProgress',fatherProgress);

    // const pTaskProgress = event.formData.task_progress;
    // const sonTasks = event.formData.sonTasks;
    // let count = 0;
    // sonTasks.map(item=>{
    //     count = item.task_progress/100 + count
    // })
    // console.log('count',count);

    try {
            //将fatherProgress 插入父节点的任务进度中
        return await db.collection('tasks-list').where({
            _id: _.eq(parent_id)
        })
          .update({
            data: {
                task_progress: fatherProgress
            },
          success: res =>{
              console.log('更新父节点的进度---',res)
          },
          fail: err =>{
            console.log('更新父节点的进度--err', err)
          }
        })
    } catch (e) {
        console.error(e)
    }
}
