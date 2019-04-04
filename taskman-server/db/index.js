/*
 * @Author: liho xue
 * @LastEditors: Do not edit
 * @since: 2019-04-03 17:09:46
 * @LastEditTime: 2019-04-04 10:18:27
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
    user_id: String,
})

exports.User = mongoose.model('User', userSchema);