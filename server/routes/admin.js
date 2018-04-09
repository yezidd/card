/**
 * ajax 后台管理路由集合
 */
const router = require('koa-router')({
  prefix: '/admin'
});

const controllers = require('../controllers');


router.get("/card/list/:year/:month/:day", controllers.admin.getCardList);

router.get("/card/not/list/:year/:month/:day", controllers.admin.getNotCardList);

router.get("/class/list", controllers.admin.getAdminClassList);

router.post("/class/add", controllers.admin.postAddClass);

router.post("/class/update", controllers.admin.postUpdateClass);

router.post("/class/allDel", controllers.admin.postDelAllClass);

module.exports = router;