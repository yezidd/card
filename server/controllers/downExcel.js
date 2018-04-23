var nodeExcel = require('excel-export')
const {mysql} = require('../qcloud');
const moment = require("moment");

module.exports = async (ctx, next) => {
  console.log('------')
  var conf = {};
// uncomment it for style example
conf.stylesXmlFile = __dirname+"/../static/styles.xml";
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
      caption: '手机号',
      captionStyleIndex: 1,
      type: 'string',
      width: 30
    }];

  //获取到本id的报名情况
  let id = ctx.query.id;

  //查询本活动的详情
  let activityResult = await mysql("cActivity").select("*")
    .where("id",'=',id);

  //获取到签到的人员
  let signResult =await mysql("cSign").select(
    "cStudentInfo.studentId",
    "cStudentInfo.name",
    "cClass.className",
    "cSign.phone"
  )
    .join('cStudentInfo',function(){
      this.on("cStudentInfo.open_id",'=','cSign.open_id')
    })
    .join('cClass',function(){
      this.on("cStudentInfo.classId",'=','cClass.id')
    })
    .where("cSign.activityId","=",id)
    .orderBy('cSign.createTime', 'desc');

  let dataArray = [];
  signResult.forEach((v,i)=>{
    dataArray.push(Object.values(v));
  });

  conf.rows = dataArray;


  var result = nodeExcel.execute(conf);


  let data = new Buffer(result, 'binary');
  ctx.res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  ctx.res.setHeader("Content-Disposition", "sign.xlsx");
  // ctx.res.end(result, 'binary');
  ctx.response.body = data;
}