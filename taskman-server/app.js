const Koa = require('koa');
const app = new Koa();
const main = ctx => {
    ctx.response.body= 'Hello World!'
}
const cors = require('koa2-cors');
app.use(cors());
app.use(main)
app.listen(3000);