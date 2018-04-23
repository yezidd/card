/**
 * Created by yzdd on 2018/4/19.
 */
const router = require('koa-router')({
  prefix: '/admin'
});

const controllers = require('../controllers');

router.get("/type/list",controllers.activity.getActivityTypeList);

router.post("/type/update",controllers.activity.updateActivityType);

router.post("/type/add",controllers.activity.postAddType);

router.post("/activity/add",controllers.activity.postAddActivity);

router.get("/activity/list",controllers.activity.getActivityList);

//更新签到状态
router.post("/activity/check/update",controllers.activity.postUpdateCheckStatus);

//结束活动
router.post("/activity/finish",controllers.activity.postUpdateFinishStatus);

//下载excel数据
router.get("/download/sign",controllers.downExcel);

//获取到签到信息等
router.get("/activity/sign",controllers.activity.getActivitySignList);

module.exports = router;