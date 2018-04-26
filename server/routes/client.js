/**
 * Created by yzdd on 2018/4/19.
 */
const router = require('koa-router')({
  prefix: '/client'
});

const controllers = require('../controllers');

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const {auth: {authorizationMiddleware, validationMiddleware}} = require('../qcloud');

//登录函数
router.get('/login', authorizationMiddleware, controllers.client.postLogin);

router.get('/user/info', validationMiddleware, controllers.client.getUserInfo);

//获取到所有的有效的活动列表
router.post('/activity/list', validationMiddleware, controllers.client.postActivityList);

//获取到单个活动的详情
router.post('/activity', validationMiddleware, controllers.client.postActivityInfoById);

//学生修改报名信息函数
router.post('/activity/modify/:id', validationMiddleware, controllers.client.postModifySignInfo);

//学生报名函数
router.post('/activity/sign', validationMiddleware, controllers.client.postSignActivity);

//获取到要签到的活动
router.post('/activity/check/list', validationMiddleware, controllers.client.postCheckList);

//签到活动
router.post('/activity/check/in', validationMiddleware, controllers.client.postCheckActivity);

//获取到所有的班级
router.get('/class/list', controllers.client.getClassList);

//获取到历史记录
router.post("/activity/history", validationMiddleware, controllers.client.postHistoryActivity);

//获取到单个历史记录的详情
router.post("/activity/history/item", validationMiddleware, controllers.client.postHistoryActivityById);

//活动反馈函数
router.post("/activity/feedback", validationMiddleware, controllers.client.postFeedBackActivity);

//绑定函数
router.post('/person/bind', validationMiddleware, controllers.client.postBindPerson);
module.exports = router;