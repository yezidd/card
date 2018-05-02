/**
 * Created by yzdd on 2018/4/19.
 */
const router = require('koa-router')({
  prefix: '/admin'
});

const controllers = require('../controllers');

router.get("/type/list", controllers.activity.getActivityTypeList);

router.post("/type/update", controllers.activity.updateActivityType);

router.post("/type/add", controllers.activity.postAddType);

router.post("/activity/add", controllers.activity.postAddActivity);

router.get("/activity/list", controllers.activity.getActivityList);

//更新签到状态
router.post("/activity/check/update", controllers.activity.postUpdateCheckStatus);

//结束活动
router.post("/activity/finish", controllers.activity.postUpdateFinishStatus);

//下载报名excel数据
router.get("/download/sign", controllers.downExcelForSign);
//下载签到excel名单
router.get("/download/check", controllers.downExcelForCheck);
//获取到报名信息等
router.get("/activity/sign", controllers.activity.getActivitySignList);

//获取到签到信息
router.get("/activity/check", controllers.activity.getActivityCheckList);
//获取到反馈信息
router.get("/activity/feedback", controllers.activity.getActivityFeedBackList);

//获取到单个活动的详细信息
router.get("/activity/info",controllers.activity.getActivityInfo);

//活动的修改
router.post("/activity/modify",controllers.activity.postActivityModify);
module.exports = router;