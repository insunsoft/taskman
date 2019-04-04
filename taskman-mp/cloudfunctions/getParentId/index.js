// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    let getPTask = '';
    let parent_id_ptask = '';
    let otherSonProgress = 0;
    let  allTasksByOnePid = [];
    let  fatherProgress = 0;

  console.log("thisTask_pid",event.thisTask_pid)

  return new Promise((resolve,reject)=>{
    db.collection('tasks-list').where({
        _id: _.eq(event.thisTask_pid)
    }).get().then((res)=>{
        console.log('异步结果',res)
        getPTask = res.data[0],
        parent_id_ptask = res.data[0]._id||''//拿到父任务的id
              //需要处理reject
        return parent_id_ptask;
    }).then((parent_id_ptask)=>{
            let filterList_id = event.filterList_id;
           return db.collection('tasks-list').where({
                parent_id: _.eq(parent_id_ptask)
            }).get().then((res)=>{
                    allTasksByOnePid = res.data;
                    console.log("所有子任务",allTasksByOnePid)
                    //剔除本条数据
                    allTasksByOnePid.length!==0&&allTasksByOnePid.map(item=>{
                        console.log("每一项的进度",item.task_progress)
                        console.log("filterList_id",filterList_id)
                        if(item._id!==filterList_id){
                            otherSonProgress = item.task_progress + otherSonProgress;
                        }
                    })

                    if(allTasksByOnePid.length!==0){
                        console.log('当前任务进度',event.formData.task_progress)
                        console.log('其他进度',otherSonProgress)
                        fatherProgress = ((otherSonProgress + event.formData.task_progress).toFixed(10))/allTasksByOnePid.length
                    }
                    resolve({fatherProgress,getPTask});
            })
    })
  })
}
// {
//     success: (res)=>{
//         //保存父任务
//         console.log("父任务",res)
//         this.setData({
//             getPTask: res.data[0],
//             parent_id_ptask: this.data.getPTask.parent_id//拿到父任务的id
//         })
//         that.checkothertask(this.data.parent_id_ptask)
//     },
//     fail: (err)=>{
//         console.log("err",err)
//     }
// }