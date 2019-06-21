// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command;
const MAX_LIMIT = 100
exports.main = async (event, context) => {
    // 先取出集合记录总数
    const countResult = await db.collection('tasks-list').count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection('tasks-list').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get({
            success(res) {}
        })
        tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
    }))
}