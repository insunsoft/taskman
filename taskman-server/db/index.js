/*
 * @Author: liho xue
 * @LastEditors: niho xue
 * @since: 2019-04-03 17:09:46
 * @LastEditTime: 2019-04-08 17:27:18
 */
const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser:true }, function(err){
    if(err){
        console.log(err)
    }else{
        console.log("Connection success!")
    }
})

const Schema = mongoose.Schema;

//用户
let userSchema = new Schema({
    user_name: String,
})

//任务列表
let TaskSchema = new Schema({
    _openid: String,
    has_pTasks: Boolean,
    has_tasks: Boolean,
    task_details: String,
    task_name: String,
    task_progress: Number,
    task_time: Date
})

//sessionid存储
let SessionSchema = new Schema({
    sessionid: String,
})

exports.User = mongoose.model('User', userSchema);
exports.Tasks = mongoose.model('Tasks', TaskSchema);
exports.Session = mongoose.model('Session', SessionSchema);