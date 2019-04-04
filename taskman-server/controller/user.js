/*
 * @Author: liho xue
 * @LastEditors: Do not edit
 * @since: 2019-04-04 10:26:01
 * @LastEditTime: 2019-04-04 10:26:48
 */
const User = require('../db').User;
module.exports = {
    //save test
    async saveUsers(ctx, next){
        console.log('sss',ctx.request.body)
        let { user_name = '', user_id = '' } = ctx.request.body; 
        try {
            let user = new User({user_name, user_id});
            let res = await user.save();
            if(res._id != null){
                    ctx.body = {
                    code: 200,
                    msg: "用户保存成功!",
                    data: {
                        _id: res._id,
                        user_name,
                    }
                }
            }
        } catch (error) {
            console.log('error==',error);
            ctx.body = {
                code: 500,
                msg:'授权失败，服务器异常'
            }
        }
    }
}
