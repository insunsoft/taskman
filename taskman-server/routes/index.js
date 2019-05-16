const router = require('koa-router')()
const controller = require('../controller')

router
	.get('/', async (ctx, next) => {
		ctx.body = 'hello, here is liho xue!'
	})
	.post('/api/user', controller.user.saveUsers)
	.post('/api/addtasks', controller.tasks.addTasks)
	.get('/api/gettasks', controller.tasks.getTasks)
	.get('/api/getTasksById', controller.tasks.getTasksById)
	.post('/api/login', controller.user.login)
	.post('/api/addSonTask', controller.tasks.addSonTasks)
	.get('/api/getSonTaskById', controller.tasks.getSonTaskById)
	.get('/api/getFatherTaskById', controller.tasks.getFatherTaskById)
    .post('/api/removeTask', controller.tasks.removeTask)
    .post('/api/updateTasks', controller.tasks.updateTasks)
module.exports = router
