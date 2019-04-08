const router = require('koa-router')();
const controller = require('../controller');

router.get('/', async (ctx, next) => {
    ctx.body = 'hello, here is liho xue!'
})
.post('/api/user',controller.user.saveUsers)
.post('/api/addtasks',controller.tasks.addTasks)

module.exports = router
