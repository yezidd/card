/**
 * ajax 客户端路由集合
 */
const router = require('koa-router')({
  prefix: '/card'
});

const controllers = require('../controllers');

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const {auth: {authorizationMiddleware, validationMiddleware}} = require('../qcloud');

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login);
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user);

//用户是否绑定学号接口
router.post('/check', validationMiddleware, controllers.student.checkBindStudentId);

//获取到班级列表
router.get('/classList', validationMiddleware, controllers.student.getClassList);

//绑定学生信息
router.post("/studentBind", validationMiddleware, controllers.student.bindStudentInfo);

//打卡
router.post("/cardSet", validationMiddleware, controllers.student.cardSet);

//获取到任务列表
//任务永远是1的那条数据
router.get("/work", controllers.work.getWorkTask);

//获取当前距离标准点的距离
router.get("/distance", controllers.work.getDistance);

//查询当前用户今天的打卡状态
router.post('/checkCardSet', validationMiddleware, controllers.student.getCardStatus);

module.exports = router;
