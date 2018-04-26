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

router.post("/work/update", controllers.admin.postSubWork);

router.get("/work/current", controllers.admin.getCurrentWork);

router.get("/student/list", controllers.admin.getStudentList);

router.post("/student/del", controllers.admin.postDelBindStudent);

//获取到所有 的年级
router.get("/grade/list", controllers.admin.getGradeList);

//禁用和解禁 年级
router.post("/grade/update", controllers.admin.postUpdateGrade);

//添加年级
router.post("/grade/add", controllers.admin.postAddGrade);

//获取到所有的学院
router.get("/college/list", controllers.admin.getCollegeList);

//学院的禁用和解禁
router.post("/college/update", controllers.admin.postUpdateCollege);

//获取到一个学院所有的年级和班级
router.get("/class/select",controllers.admin.getClassSelect);

module.exports = router;