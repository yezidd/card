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

module.exports = router;