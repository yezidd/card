var nodeExcel = require('excel-export')
const {mysql} = require('../qcloud');
const moment = require("moment");

//下载 签到或者未签到 名单数据
module.exports = async (ctx, next) => {
  console.log('------')
  var conf = {};
// uncomment it for style example
  conf.stylesXmlFile = __dirname + "/../static/styles.xml";
  //获取到本id的签到情况
  let id = ctx.query.id;
  //根据flag来选取是签到情况还是未签到情况
  let flag = (!!Number(ctx.query.flag)) ? 1 : 0;
  //查询本活动的详情
  let activityResult = await mysql("cActivity").select("*")
    .where("id", '=', id);

  conf.cols = [{
    caption: '学号',
    captionStyleIndex: 1,
    type: 'string',
    width: 30
  },
    {
      caption: '姓名',
      captionStyleIndex: 1,
      type: 'string',
      width: 30
    },
    {
      caption: '班级',
      captionStyleIndex: 1,
      type: 'string',
      width: 30
    },
    {
      caption: '活动名称',
      captionStyleIndex: 1,
      type: 'string',
      width: 60
    }];


  console.log(conf.cols);

  let dataArray = [];

  let checkList = await mysql("cSign").select(
    "cStudentInfo.name",
    "cStudentInfo.studentId",
    "cClass.className"
  )
    .join('cStudentInfo', function () {
      this.on("cStudentInfo.open_id", '=', 'cSign.open_id')
    })
    .join('cClass', function () {
      this.on("cStudentInfo.classId", '=', 'cClass.id')
    })
    .where("signCheck", "=", flag)
    .where("cSign.activityId", "=", id)
    .orderBy('cStudentInfo.classId', 'desc');
  console.log("======checkList", checkList, flag, id,ctx.query.flag);
  checkList.forEach((v, i) => {
    let item = Object.values(v);
    item.push(activityResult[0].title);
    dataArray.push(item);
  });

  conf.rows = dataArray;


  var result = nodeExcel.execute(conf);


  let name = !!flag ? "check" : "uncheck";

  let data = new Buffer(result, 'binary');
  ctx.res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  ctx.res.setHeader("Content-Disposition", name + ".xlsx");
  // ctx.res.end(result, 'binary');
  ctx.response.body = data;
}