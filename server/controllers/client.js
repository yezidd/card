/**
 * Created by yzdd on 2018/4/19.
 */
const {clearData} = require("../utils");

const {mysql} = require('../qcloud');
const moment = require("moment");

const PER_PAGE = 10;

//获取到活动列表，用于展示数据
//现在要针对某一个人群来限定活动范围,所以记录到班级来进行活动的分配
//这个时候需要登录态和绑定态
async function postActivityList(ctx) {

  let page = isNaN(Number(ctx.query.page)) ? 1 : ctx.query.page;

  if (ctx.state.$wxInfo.loginState) {
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    //查询是否绑定
    let bindResult = await mysql("cStudentInfo").select("*")
      .where("open_id", "=", open_id);
    if (bindResult.length === 0) {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "请先实名绑定信息"
      }
    } else {

      let dateTime = new Date();
      //获取到总数量
      let dataLength = await mysql.count("id").from("cActivity")
        .where("endTime", ">", dateTime);
      //获取到数据
      let data = await mysql.select(
        "cActivity.id",
        "cActivity.title",
        "cActivity.location",
        "cActivity.reward",
        "cActivity.rewardMark",
        "cActivity.startTime",
        "cActivity.endTime",
        "cActivity.createdTime",
        "cActivity.signNum",
        "cActivity.personNum",
        "cActivity.mess",
        "cActivity.pointClass",
        "cType.typeName"
      ).from("cActivity")
        .where("endTime", ">", dateTime)
        .orderBy("endTime", "asc")
        .join("cType", function () {
          this.on("cActivity.typeId", "=", "cType.id")
        })
        .limit(PER_PAGE)
        .offset((page - 1) * 10);

      console.log("====获取到的活动列表====", data);


      ctx.state.code = 1;
      ctx.state.data = {
        count: dataLength[0]["count(`id`)"],
        pageCount: Math.ceil(dataLength[0]["count(`id`)"] / PER_PAGE),
        perPage: PER_PAGE,
        currentPage: page,
        data: data
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//登录函数
async function postLogin(ctx) {
  if (ctx.state.$wxInfo.loginState) {
    let open_id = ctx.state.$wxInfo.userinfo.userinfo.openId;
    //查看是否绑定学号-姓名-班级
    let result = await mysql.select("*")
      .from("cStudentInfo")
      .where("open_id", "=", open_id)
      .join("cClass", function () {
        this.on("cClass.id", "=", "cStudentInfo.classId")
      });
    if (result.length === 0) {
      ctx.state.code = 1;
      ctx.state.data = Object.assign({}, {bind: false}, ctx.state.$wxInfo.userinfo);
    } else {
      ctx.state.code = 1;
      ctx.state.data = Object.assign({}, {bind: true}, result[0], ctx.state.$wxInfo.userinfo);
    }
  } else {
    ctx.state.code = -1;
  }
}

//获取用户信息函数
async function getUserInfo(ctx) {
  if (ctx.state.$wxInfo.loginState === 1) {
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    //查看是否绑定学号-姓名-班级
    let result = await mysql.select("*")
      .from("cStudentInfo")
      .where("open_id", "=", open_id)
      .join("cClass", function () {
        this.on("cClass.id", "=", "cStudentInfo.classId")
      });
    if (result.length === 0) {
      ctx.state.code = 1;
      ctx.state.data = Object.assign({}, {bind: false}, ctx.state.$wxInfo.userinfo);
    } else {
      ctx.state.code = 1;
      ctx.state.data = Object.assign({}, {bind: true}, result[0], ctx.state.$wxInfo.userinfo);
    }
  } else {
    ctx.state.code = -1
  }
}

//获取到一个活动的详情
async function postActivityInfoById(ctx) {
  //现在活动报名的信息需要修改了，那么就需要点开的时候判断 是否已经报名，并且加载报名的信息
  if (ctx.state.$wxInfo.loginState) {
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    let id = ctx.request.body.id;
    if (id) {
      //先查询本用户是否已经报名本项目
      let signResult = await mysql.select("id")
        .from("cSign").where("activityId", "=", id)
        .where("open_id", "=", open_id);
      //没有报名就返回当前活动的信息
      if (signResult.length === 0) {
        let result = await mysql.select(
          "cActivity.id",
          "cActivity.title",
          "cActivity.location",
          "cActivity.reward",
          "cActivity.rewardMark",
          "cActivity.startTime",
          "cActivity.endTime",
          "cActivity.createdTime",
          "cActivity.signNum",
          "cActivity.personNum",
          "cActivity.mess",
          "cType.typeName",
          "cActivity.isNeedCheck",
          "cActivity.locationId",
        )
          .from("cActivity")
          .where("cActivity.id", "=", id)
          .join("cType", function () {
            this.on("cActivity.typeId", "=", "cType.id")
          });
        if (result.length === 0) {
          ctx.state.code = 0;
        } else {
          ctx.state.code = 1;
          ctx.state.data = Object.assign({}, result[0], {sign: false});
        }
      } else {
        //如果之前报名过就返回报名信息
        let result = await mysql.select(
          "cActivity.id",
          "cActivity.title",
          "cActivity.location",
          "cActivity.reward",
          "cActivity.rewardMark",
          "cActivity.startTime",
          "cActivity.endTime",
          "cActivity.createdTime",
          "cActivity.signNum",
          "cActivity.personNum",
          "cActivity.mess",
          "cType.typeName",
          "cActivity.isNeedCheck",
          "cActivity.locationId",
          "cSign.studentId",
          "cSign.needCheckData",
        )
          .from("cActivity")
          .where("cActivity.id", "=", id)
          .join("cType", function () {
            this.on("cActivity.typeId", "=", "cType.id")
          })
          .join("cSign", function () {
            this.on("cSign.activityId", "=", "cActivity.id")
          });
        if (result.length === 0) {
          ctx.state.code = 0;
        } else {
          ctx.state.code = 1;
          ctx.state.data = Object.assign({}, result[0], {sign: true});
        }
      }
    } else {
      ctx.state.code = 0;
    }
  } else {
    ctx.state.code = -1;
  }
}

//修改活动报名信息
async function postModifySignInfo(ctx) {
  if (ctx.state.$wxInfo.loginState) {
    //修改 本次报名中needCheckData里面的值，直接替换
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    let id = ctx.params.id;
    let needCheckData = ctx.request.body.needCheckData;

    //查询是否有报名记录
    let signResult = await mysql("cSign").select("id").where("activityId", "=", id).where("open_id", "=", open_id);

    if (signResult.length !== 0) {
      let signUpdate = await mysql('cSign').update({
        needCheckData
      }).where("activityId", "=", id).where("open_id", "=", open_id);
      if (signUpdate) {
        ctx.state.code = 1;
      } else {
        ctx.state.code = 0;
        ctx.state.data = {
          message: "发生错误"
        }
      }
    } else {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "非法操作,你的ip和用户名已经被记录"
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//活动报名
async function postSignActivity(ctx) {
  console.log(ctx.state.$wxInfo, "--------------", "=======")
  if (ctx.state.$wxInfo.loginState) {
    //手机号，已经废弃，现在用的是needCheckData
    //要求填写的数据
    let phone = ctx.request.body.phone;
    let activityId = ctx.request.body.activityId;
    let needCheckData = ctx.request.body.needCheckData;
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    //查看绑定信息
    let bindMess = await mysql.select(
      "id",
      "uuid",
      "open_id",
      "studentId"
    ).from("cStudentInfo")
      .where("open_id", "=", open_id);
    if (bindMess.length === 0) {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "还未实名绑定信息"
      }
    } else {
      //查看是否已经报名
      let signMess = await mysql("cSign").select("id")
        .where("activityId", "=", activityId)
        .where("open_id", "=", open_id);
      if (signMess.length === 0) {
        //添加报名数据
        let uuid = bindMess[0].uuid;
        let studentId = bindMess[0].studentId;
        let bind = await mysql("cSign").insert({
          uuid,
          open_id,
          activityId,
          studentId,
          phone,
          needCheckData
        });
        console.log("-----bind-----", bind);
        if (bind) {
          //添加数据成功之后 选取 报名数量来刷新活动报名人数
          //获得数量之后刷新活动 的报名人数
          let signNumData = await mysql.count('id').from("cSign")
            .where("activityId", "=", activityId);

          let signNum = signNumData[0]['count(`id`)'];

          console.log("-----signNum-----", signNum);
          //获取活动额定报名人数
          let activityResult = await mysql("cActivity").select("*")
            .where("id", "=", activityId);

          //获取到额定的报名人数
          let personNum = activityResult[0].personNum;

          if (signNum <= personNum) {
            //人数不满，那么就更新报名人数
            let updateNum = await mysql("cActivity").where("id", "=", activityId)
              .update({
                signNum: signNum
              });
            if (updateNum) {
              ctx.state.code = 1;
            } else {
              ctx.state.code = 0;
              ctx.state.data = {
                message: "发生错误"
              }
            }
          } else {
            //报名人数已经满了的话那么就删掉这个报名记录
            let delSign = await mysql('cSign')
              .where('id', bind[0])
              .del();
            if (delSign) {
              ctx.state.code = 0;
              ctx.state.data = {
                message: "报名人数已满,请刷新页面"
              }
            } else {
              ctx.state.code = 0;
              ctx.state.data = {
                message: "发生错误"
              }
            }
          }
        } else {
          ctx.state.code = 0;
          ctx.state.data = {
            message: "发生错误"
          }
        }
      } else {
        ctx.state.code = 0;
        ctx.state.data = {
          message: "你已经报名此活动"
        }
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//获取到报名的没有被关闭的项目--也就是需要签到的项目
async function postCheckList(ctx) {
  if (ctx.state.$wxInfo.loginState) {
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    let sql = "SELECT cSign.id,cSign.activityId,cSign.signCheck,cActivity.title,cActivity.reward,cActivity.rewardMark,cActivity.location,cActivity.locationId,cActivity.isCheck,cActivity.distance,cActivity.startTime,cActivity.endTime,cActivity.createdTime,cActivity.isNeedCheck,cActivity.personNum,cActivity.signNum,cActivity.mess,cType.typeName FROM cActivity,cSign,cType WHERE cActivity.id = cSign.activityId AND cActivity.isActive = 1 AND cActivity.typeId = cType.id AND cActivity.isFinish = 0";
    let signList = await mysql.schema.raw(sql);
    ctx.state.code = 1;
    ctx.state.data = clear(signList[0]);
  } else {
    ctx.state.code = -1;
  }
}

function clear(data) {
  return JSON.parse(JSON.stringify(data));
}

//用户签到函数
async function postCheckActivity(ctx) {
  if (ctx.state.$wxInfo.loginState) {
    //查询本账号是否对应这个活动id
    //传递活动id
    let activityId = ctx.request.body.activityId;

    let signId = ctx.request.body.id;

    //传递当前的locationId  经纬度
    let locationId = ctx.request.body.locationId;
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    let signResult = await mysql.select("id").from("cSign")
      .where("activityId", "=", activityId)
      .where("open_id", "=", open_id);
    if (signResult.length === 0) {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "发生错误"
      }
    } else {
      //这样的话 就更新 签到的状态
      //判断当前距离点的距离
      //获取到活动的标准点
      let activityResult = await mysql("cActivity").select("*")
        .where("id", "=", activityId);
      if (activityResult.length === 0) {
        ctx.state.code = 0;
        ctx.state.data = {
          message: "发生错误"
        }
      } else {
        //配置点和标准点距离跟额定距离比较
        let locationIdActivity = JSON.parse(activityResult[0].locationId);
        let distance = activityResult[0].distance;
        let distanceReal = getFlatternDistance(Number(locationIdActivity.lat), Number(locationIdActivity.lon), Number(locationId.lat), Number(locationId.lon));
        console.log(Number(distanceReal), Number(distance))
        if (Number(distanceReal) > Number(distance) * 1000) {
          ctx.state.code = 0;
          ctx.state.data = {
            message: "签到失败，距离标准点过远"
          }
        } else {
          //签到成功
          //更新签到属性和事件
          let checkUpdate = await mysql("cSign")
            .update({
              signCheck: 1,
              checkTime: moment().format("YYYY-MM-DD HH:mm:ss")
            }).where("id", "=", signId);
          if (checkUpdate === 1) {
            ctx.state.code = 1;
          } else {
            ctx.state.code = 0;
            ctx.state.data = {
              message: "发生错误"
            }
          }
        }
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//传入两个坐标返回两个坐标的大致距离
var EARTH_RADIUS = 6378.137; //地球半径

//将用角度表示的角转换为近似相等的用弧度表示的角 java Math.toRadians
function rad(d) {
  return d * Math.PI / 180.0;
}

var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}

/**
 * approx distance between two points on earth ellipsoid
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  console.log(lat1, lng1, lat2, lng2, "-----")
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

//获取到所有的班级
async function getClassList(ctx) {
  let classList = await mysql("cClass").select("*").where("isActive", "=", 1);
  console.log(classList, "----")
  if (classList) {
    ctx.state.code = 1;
    ctx.state.data = classList;
  }
}

//绑定学号班级名字函数
async function postBindPerson(ctx) {
  // 班级姓名学号
  if (ctx.state.$wxInfo.loginState === 1) {
    let name = ctx.request.body.name;
    let studentId = ctx.request.body.studentId;
    let classId = ctx.request.body.classId;

    //首先得查询是否已经绑定过信息
    let bindMess = await mysql("cStudentInfo").select('id')
      .where("studentId", '=', studentId);
    if (bindMess.length !== 0) {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "你已经绑定过信息了，请刷新页面"
      }
    } else {
      let resultFour = await mysql("*").from("cStudentInfo").where("studentId", ctx.request.body.studentId);
      if (resultFour.length > 0) {
        ctx.state.code = 0;
        ctx.state.data = {message: "此学号已经绑定，如果有疑问，请联系辅导员"};
      } else {
        let resultInfo = await mysql.select('*').from("cSessionInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
        //拿到openId;
        let openId = ctx.state.$wxInfo.userinfo.openId;
        let uuid = resultInfo[0].uuid;
        let insertResult = await mysql("cStudentInfo").insert({
          open_id: openId,
          uuid: uuid,
          name: name,
          classId: classId,
          studentId: studentId
        });
        ctx.state.code = 1;
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//获取到活动结束的活动作为活动历史--->列表
async function postHistoryActivity(ctx) {
  if (ctx.state.$wxInfo.loginState === 1) {
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    //获取到历史记录
    $sql = `SELECT * FROM cType,cActivity,cSign WHERE cActivity.id = cSign.activityId AND cActivity.isFinish = 1` +
      ` AND cSign.open_id = '${open_id}' AND cType.id = cActivity.typeId`;

    const result = await mysql.schema.raw($sql);
    if (result) {
      ctx.state.code = 1;
      ctx.state.data = clear(result[0]);
    } else {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "发生错误"
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//获取到单个历史活动--->传递参数为csign的Id
async function postHistoryActivityById(ctx) {
  if (ctx.state.$wxInfo.loginState === 1) {
    let id = ctx.request.body.id;
    let open_id = ctx.state.$wxInfo.userinfo.openId;
    //获取到历史记录
    $sql = `SELECT * FROM cType,cActivity,cSign WHERE cActivity.id = cSign.activityId AND cActivity.isFinish = 1` +
      ` AND cSign.open_id = '${open_id}' AND cType.id = cActivity.typeId AND cSign.id = ${id}`;

    const result = await mysql.schema.raw($sql);
    if (result) {
      ctx.state.code = 1;
      ctx.state.data = clear(result[0])[0];
    } else {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "发生错误"
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

//活动反馈函数
async function postFeedBackActivity(ctx) {
  if (ctx.state.$wxInfo.loginState === 1) {
    let id = ctx.request.body.id;
    let feedbackMess = ctx.request.body.mess;
    //修改记录中的反馈，并且把反馈的标志作为1 
    let result = await mysql("cSign")
      .update({
        feedbackMess: feedbackMess,
        feedbackFlag: 1,
        feedTime: moment().format("YYYY-MM-DD HH:ss:mm")
      }).where("id", "=", id);

    if (result) {
      ctx.state.code = 1;
    } else {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "发生错误"
      }
    }
  } else {
    ctx.state.code = -1;
  }
}

module.exports = {
  postActivityList,
  postLogin,
  getUserInfo,
  postActivityInfoById,
  postSignActivity,
  postCheckList,
  postCheckActivity,
  getClassList,
  postBindPerson,
  postHistoryActivity,
  postHistoryActivityById,
  postFeedBackActivity,
  postModifySignInfo
};