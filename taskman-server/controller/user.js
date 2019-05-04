/*
 * @Author: liho xue
 * @LastEditors: niho xue
 * @since: 2019-04-04 10:26:01
 * @LastEditTime: 2019-05-04 12:30:10
 */
const User = require('../db').User;
const Session = require('../db').Session;
const request = require('request');
const crypto = require('crypto');

module.exports = {
    //save test
    async saveUsers(ctx, next) {
        let { user_name = '', user_id = '' } = ctx.request.body;
        try {
            let user = new User({ user_name, user_id });
            let res = await user.save();
            if (res._id != null) {
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
            console.log('error==', error);
            ctx.body = {
                code: 500,
                msg: '授权失败，服务器异常'
            }
        }
    },
    async login(ctx, next) {
        let { code = '' } = ctx.request.body;
        let result = {}
        try {
            result = await new Promise((resolve, reject) => {
                request.get('https://api.weixin.qq.com/sns/jscode2session', {
                    json: true,
                    qs: {
                        appid: 'wx496b8304e5ad1384',
                        secret: 'a034679b68867176edf17e52c8dc9c9e',
                        js_code: code,
                        grant_type: 'authorization_code'
                    }
                }, function (err, response, data) {
                    if (response.statusCode === 200) {
                        //对session_key 和 openid md5加密
                        const md5skey = crypto.createHash('md5')
                            .update('data.session_key')
                            .update('data.openid')
                            .digest('hex');
                        let session = new Session({ sessionid: md5skey, _openid: data.openid })
                        let res = session.save(); //存到了mongodb中也可使用redis  
                        return resolve(res)
                    } else {
                        console.log("[error]", err)
                        return resolve(err)
                    }
                })
            })
            if (result._id != null) {
                ctx.body = {
                    code: 200,
                    data: result
                }
            }
        } catch (error) {
            console.log('error==', error);
            ctx.body = {
                code: 500,
                msg: '登录失败，服务器异常'
            }
        }

    }
}
