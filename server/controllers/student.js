/**
 * Created by yzdd on 2018/3/31.
 */
const {mysql} = require('../qcloud');
const moment = require("moment");

//检查这个微信号是否绑定到学号里面
async function checkBindStudentId(ctx) {
  if (ctx.state.$wxInfo.loginState) {
    let result = await mysql.select('*').from("cStudentInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
    if (result.length === 0) {
      ctx.state.code = 401;
    } else {
      ctx.state.data = result[0];
    }
  } else {
    ctx.state.code = -1
  }
}

//获取到班级列表
async function getClassList(ctx) {

  let result = await mysql.select("id", "className").from("cClass").where("isActive", 1);
  ctx.state.data = result;

}

//学生信息绑定
async function bindStudentInfo(ctx) {
  console.log(ctx.request.body);
  if (ctx.state.$wxInfo.loginState) {

    //查询是否已经绑定
    let resultOne = await mysql("id").from("cStudentInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
    if (resultOne.length > 0) {
      ctx.state.code = 422;
      ctx.state.data = {message: "此用户已经绑定"};
    } else {

      let resultFour = await mysql("*").from("cStudentInfo").where("studentId", ctx.request.body.studentId);
      if (resultFour.length > 0) {
        ctx.state.code = 422;
        ctx.state.data = {message: "此学号已经绑定，如果有疑问，请联系辅导员"};
      } else {
        let resultInfo = await mysql.select('*').from("cSessionInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
        //拿到openId;
        let openId = ctx.state.$wxInfo.userinfo.openId;
        let uuid = resultInfo[0].uuid;
        let name = "";
        let classId = ctx.request.body.classId;
        let studentId = ctx.request.body.studentId;

        let insertResult = await mysql("cStudentInfo").insert({
          open_id: openId,
          uuid: uuid,
          name: name,
          classId: classId,
          studentId: studentId
        });
        console.log(insertResult, "增加的结果");
        ctx.state.code = 1;
        ctx.state.data = {message: "绑定成功"};
      }
    }
  } else {
    ctx.state.code = -1
  }
}

//打卡
async function cardSet(ctx) {
  console.log(ctx.request.body);
  if (ctx.state.$wxInfo.loginState) {
    let resultOne = await mysql("*").from("cStudentInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
    if (resultOne.length === 0) {
      ctx.state.code = 401;
      ctx.state.data = {message: "此用户还未绑定"};
    } else {
      //传递的参数
      //距离,其他服务端都可以拿到
      //先判断距离是否超出设定距离
      let resultTwo = await mysql.select("*").from("cWork").where('isActive', 1);
      if (resultTwo[0]) {
        if (Number(ctx.request.body.distance) > Number(resultTwo[0].distance)) {
          ctx.state.code = 422;
          ctx.state.data = {message: "距离标准点过远,打卡失败"};
        } else {
          console.log(resultOne[0], "------")
          //记录数据库
          let uuid = resultOne[0].uuid;
          let open_id = resultOne[0].open_id;
          let distance = ctx.request.body.distance;
          let checkFlag = 1;
          let workId = resultTwo[0].id;
          let resultThree = await mysql("cCardRecord").insert({
            uuid,
            open_id: open_id,
            distance,
            checkFlag,
            workId
          });
          if (resultThree) {
            ctx.state.code = 1;
            ctx.state.data = {
              message: "打卡成功"
            }
          }
        }
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//查看是否今天是否已经打过卡了
async function getCardStatus(ctx) {
  if (ctx.state.$wxInfo.loginState) {
    //查询是否绑定用户
    let resultTwo = await mysql.select("*").from("cStudentInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
    if (resultTwo.length === 0) {
      ctx.state.code = 401;
      ctx.state.data = {message: "此用户还未绑定"};
    } else {
      //查询激活的打卡任务
      let resultOne = await mysql.select("*").from("cWork").where('isActive', 1);

      if (resultOne.length === 0) {
        ctx.state.code = 422;
        ctx.state.data = {message: "暂无打卡任务"};
      } else {

        //拿到对于今天来说的起始时间和结束时间
        let dateTime = new Date();
        //获取到时和分
        let hour = resultOne[0].startTime.split(":")[0];
        let minutes = resultOne[0].startTime.split(":")[1];

        dateTime.setHours(Number(hour));
        dateTime.setMinutes(Number(minutes));

        let startTime = moment(dateTime).format("YYYY-MM-DD HH:mm");
        let endTime = moment(dateTime).add(parseFloat(Number(resultOne[0].timeLong) / 1000 / 3600), 'hours').format("YYYY-MM-DD HH:mm");
        console.log(startTime, endTime, "---起始和结束时间---");

        let resultThree = await mysql('cCardRecord').where(function () {
          this.where('time', '>', startTime).andWhere('time', '<', endTime)
        });
        if (resultThree.length === 0) {
          //没有 打卡
          ctx.state.code = 10;
        } else {
          //已经打卡
          ctx.state.code = 11;
        }
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

module.exports = {
  checkBindStudentId: checkBindStudentId,
  getClassList: getClassList,
  bindStudentInfo: bindStudentInfo,
  cardSet: cardSet,
  getCardStatus: getCardStatus
};