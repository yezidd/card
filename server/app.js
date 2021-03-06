const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
// const router = require('./routes');
const routerAdmin = require("./routes/admin");
const routerActivity = require("./routes/activity");
const routerClient = require("./routes/client");
// app.use(router.routes());
app.use(routerAdmin.routes());
app.use(routerClient.routes());
app.use(routerActivity.routes());
// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
