const router = require('koa-router')();
const controller = require('../controller');

router.get('/', async (ctx, next) => {
    ctx.body = 'hello, here is liho xue!'
})
.post('/api/user',controller.user.saveUsers)
.post('/api/addtasks',controller.tasks.addTasks)
.get('/api/gettasks',controller.tasks.getTasks)
.post('/api/login', controller.user.login)
module.exports = router
