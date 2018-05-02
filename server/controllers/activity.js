/**
 * Created by yzdd on 2018/4/19.
 */
const {mysql} = require('../qcloud');
const moment = require("moment");

const PER_PAGE = 10;

//添加活动日程
async function postAddActivity(ctx) {
  console.log(ctx.body);
  //标题
  let title = ctx.request.body.title;
  //类型ID
  let typeId = ctx.request.body.type;
  //活动开始时间
  let startTime = ctx.request.body.startDateTime;
  //活动报名截止时间
  let endTime = ctx.request.body.endDate;
  //奖励的数量
  let reward = ctx.request.body.reward;
  //奖励的类型
  let rewardMark = ctx.request.body.rewardMark;
  //报名需求
  let isNeedCheck = ctx.request.body.isNeedCheck;

  //目标学院id
  let pointCollege = ctx.request.body.pointCollege;

  //目标班级id
  let pointClass = ctx.request.body.pointClass;

  //活动地点
  let location = ctx.request.body.location;
  //活动经纬度
  let locationId = {
    lon: ctx.request.body.lon,
    lat: ctx.request.body.lat
  }
  //活动规定签到距离
  let distance = ctx.request.body.distance;
  //活动的备注
  let mess = ctx.request.body.mess;

  //额定人数
  let personNum = ctx.request.body.personNum;

  //是否开启签到
  let isCheck = ctx.request.body.check;
  let result = await mysql("cActivity").insert({
    title,
    typeId,
    startTime,
    endTime,
    reward,
    rewardMark,
    location,
    locationId: JSON.stringify(locationId),
    isCheck,
    distance,
    isNeedCheck: JSON.stringify(isNeedCheck),
    isActive: 1,
    personNum,
    mess,
    pointClass: JSON.stringify(pointClass),
    pointCollege: pointCollege
  });
  if (result) {
    ctx.state.code = 1;
    ctx.state.data = {
      message: "ok"
    }
  } else {
    ctx.state.code = 0;
    ctx.state.data = {
      error: "发生错误"
    }
  }
}

//获取到所有的活动类型列表
async function getActivityTypeList(ctx) {
  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);
  //获取数量
  let ActivityTypeListLength = await mysql
    .count("id")
    .from("cType");
  //获取数据
  let ActivityTypeListResult = await mysql
    .select("*")
    .from("cType");
  ctx.state.code = 1;
  ctx.state.data = {
    count: ActivityTypeListLength[0]["count(`id`)"],
    pageCount: Math.ceil(ActivityTypeListLength[0]["count(`id`)"] / ActivityTypeListLength[0]["count(`id`)"]),
    perPage: ActivityTypeListLength[0]["count(`id`)"],
    currentPage: 1,
    data: ActivityTypeListResult
  }
}

//更新活动类型状态
async function updateActivityType(ctx) {
  if (ctx.request.body.id) {
    let id = ctx.request.body.id;
    let isActive = ctx.request.body.isActive;
    let resultOne = await mysql("cType").where("id", id);
    if (resultOne.length === 0) {
      ctx.state.code = 0;
      ctx.state.data = {
        message: "发生错误"
      }
    } else {
      let result = await mysql('cClass')
        .where('id', id)
        .update({
          isActive: resultOne[0].isActive === 1 ? 0 : 1,
        });
      if (result) {
        ctx.state.code = 1;
        ctx.state.data = {
          message: "ok"
        }
      } else {
        ctx.state.code = 0;
        ctx.state.data = {
          message: "发生错误"
        }
      }
    }
  } else {
    ctx.state.code = -1;
    ctx.state.data = {
      message: "服务器错误"
    }
  }
}

//添加活动类型
async function postAddType(ctx) {
  if (ctx.request.body.name) {
    let name = ctx.request.body.name;
    console.log(name);
    let result = await mysql("cType").insert({
      typeName: name
    });
    if (result) {
      ctx.state.code = 1;
      ctx.state.data = {
        data: {
          id: result[0]
        },
        message: "ok"
      }
    }
  } else {
    ctx.state.code = -1;
    ctx.state.data = {
      message: "服务器错误"
    }
  }
}

//获取到活动的列表
async function getActivityList(ctx) {
  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);

  let resultLength = await mysql("cActivity").count("title")
    .join('cType', function () {
      this.on('cType.id', '=', 'cActivity.typeId')
    });

  let result = await mysql("cActivity").select(
    "cActivity.id",
    "cActivity.title",
    "cActivity.reward",
    "cActivity.rewardMark",
    "cActivity.location",
    "cActivity.locationId",
    "cActivity.isCheck",
    "cActivity.distance",
    "cActivity.startTime",
    "cActivity.endTime",
    "cActivity.createdTime",
    "cActivity.updatedTime",
    "cActivity.isNeedCheck",
    "cActivity.isActive",
    "cActivity.personNum",
    "cActivity.signNum",
    "cActivity.mess",
    "cType.id as cid",
    "cActivity.isFinish",
    "cType.typeName",
  )
    .join('cType', function () {
      this.on('cType.id', '=', 'cActivity.typeId')
    })
    .limit(PER_PAGE)
    .offset((page - 1) * 10)
    .orderBy('createdTime', 'desc');

  ctx.state.code = 1;
  ctx.state.data = {
    count: resultLength[0]["count(`title`)"],
    pageCount: Math.ceil(resultLength[0]["count(`title`)"] / PER_PAGE),
    perPage: PER_PAGE,
    currentPage: page,
    data: result
  }
}

//更新活动签到状态
async function postUpdateCheckStatus(ctx) {
  let id = ctx.request.body.id;
  let isCheck = ctx.request.body.isCheck;
  let result = await mysql("cActivity").update({
    isCheck: isCheck
  }).where("id", "=", id);
  if (result) {
    ctx.state.code = 1;
    ctx.state.data = {
      isCheck
    };
  } else {
    ctx.state.code = -1;
  }
}

//结束活动函数，活动结束之后，用户可以进行反馈
async function postUpdateFinishStatus(ctx) {
  let id = ctx.request.body.id;
  //先查询这个活动有没有关闭签到
  let activityResult = await mysql("cActivity").select("*").where("id", '=', id);
  if (activityResult.length === 0 || activityResult[0].isCheck === 1) {
    ctx.state.code = 0;
    ctx.state.data = {
      message: "请先关闭签到之后再结束活动"
    }
  } else {
    let result = await mysql("cActivity").update({
      isFinish: 1
    }).where("id", "=", id);
    if (result) {
      ctx.state.code = 1;
    } else {
      ctx.state.code = -1;
    }
  }
}

//获取到一个活动的签到情况
async function getActivitySignList(ctx) {
  let id = ctx.query.id;
  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);

  let signLength = await mysql("cSign").count("cSign.id")
    .join('cStudentInfo', function () {
      this.on("cStudentInfo.open_id", '=', 'cSign.open_id')
    })
    .join('cClass', function () {
      this.on("cStudentInfo.classId", '=', 'cClass.id')
    })
    .where("cSign.activityId", "=", id);

  let signList = await mysql("cSign").select("*")
    .join('cStudentInfo', function () {
      this.on("cStudentInfo.open_id", '=', 'cSign.open_id')
    })
    .join('cClass', function () {
      this.on("cStudentInfo.classId", '=', 'cClass.id')
    })
    .where("cSign.activityId", "=", id)
    .limit(PER_PAGE)
    .offset((page - 1) * 10)
    .orderBy('cSign.createTime', 'desc');

  console.log(signLength)

  ctx.state.code = 1;
  ctx.state.data = {
    count: signLength[0]["count(`cSign`.`id`)"],
    pageCount: Math.ceil(signLength[0]["count(`cSign`.`id`)"] / PER_PAGE),
    perPage: PER_PAGE,
    currentPage: page,
    data: signList
  }

}

//获取到签到列表
//传递参数为id  为活动id  flag = 1|0表示签到的名单或者是未签到名单
async function getActivityCheckList(ctx) {
  let id = ctx.query.id;
  let flag = (!!Number(ctx.query.flag)) ? 1 : 0;
  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);

  console.log(flag, '=====', ctx.query.flag);

  let checkLength = await mysql("cSign").count("cSign.id")
    .join('cStudentInfo', function () {
      this.on("cStudentInfo.open_id", '=', 'cSign.open_id')
    })
    .join('cClass', function () {
      this.on("cStudentInfo.classId", '=', 'cClass.id')
    })
    .where("cSign.activityId", "=", id)
    .where("cSign.signCheck", "=", flag);

  let checkList = await mysql("cSign").select(
    "cSign.id",
    "cSign.activityId",
    "cSign.signCheck",
    "cSign.checkTime",
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
    .where("cSign.signCheck", "=", flag)
    .where("cSign.activityId", "=", id)
    .limit(PER_PAGE)
    .offset((page - 1) * 10)
    .orderBy('cSign.checkTime', 'desc');

  ctx.state.code = 1;
  ctx.state.data = {
    count: checkLength[0]["count(`cSign`.`id`)"],
    pageCount: Math.ceil(checkLength[0]["count(`cSign`.`id`)"] / PER_PAGE),
    perPage: PER_PAGE,
    currentPage: page,
    data: checkList
  }
}

//获取到反馈信息
async function getActivityFeedBackList(ctx) {
  let id = ctx.query.id;
  let flag = (!!Number(ctx.query.flag)) ? 1 : 0;
  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);


  let feedbackLength = await mysql("cSign").count("cSign.id")
    .join('cStudentInfo', function () {
      this.on("cStudentInfo.open_id", '=', 'cSign.open_id')
    })
    .join('cClass', function () {
      this.on("cStudentInfo.classId", '=', 'cClass.id')
    })
    .where("cSign.activityId", "=", id)
    .where("cSign.feedbackFlag", "=", flag);

  let feedbackList = await mysql("cSign").select(
    "cSign.id",
    "cSign.activityId",
    "cSign.feedbackFlag",
    "cSign.feedTime",
    "cSign.feedbackMess",
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
    .where("cSign.feedbackFlag", "=", flag)
    .where("cSign.activityId", "=", id)
    .limit(PER_PAGE)
    .offset((page - 1) * 10)
    .orderBy('cSign.checkTime', 'desc');

  ctx.state.code = 1;
  ctx.state.data = {
    count: feedbackLength[0]["count(`cSign`.`id`)"],
    pageCount: Math.ceil(feedbackLength[0]["count(`cSign`.`id`)"] / PER_PAGE),
    perPage: PER_PAGE,
    currentPage: page,
    data: feedbackList
  }
}

//获取到单个活动的详情
async function getActivityInfo(ctx) {
  //传递的参数是活动的id
  let id = ctx.query.id;

  let activityResult = await mysql("cActivity").select("*")
    .where('id', "=", id);
  if (activityResult.length === 0) {
    ctx.state.code = 0;
    ctx.state.data = {
      message: "发生错误"
    }
  } else {
    ctx.state.code = 1;
    ctx.state.data = activityResult[0];
  }
}

async function postActivityModify(ctx) {
  //活动id
  let id = ctx.request.body.id;
  //标题
  let title = ctx.request.body.title;
  //类型ID
  let typeId = ctx.request.body.type;
  //活动开始时间
  let startTime = ctx.request.body.startDateTime;
  //活动报名截止时间
  let endTime = ctx.request.body.endDate;
  //奖励的数量
  let reward = ctx.request.body.reward;
  //奖励的类型
  let rewardMark = ctx.request.body.rewardMark;
  //报名需求
  let isNeedCheck = ctx.request.body.isNeedCheck;

  //目标学院id
  let pointCollege = ctx.request.body.pointCollege;

  //目标班级id
  let pointClass = ctx.request.body.pointClass;

  //活动地点
  let location = ctx.request.body.location;
  //活动经纬度
  let locationId = {
    lon: ctx.request.body.lon,
    lat: ctx.request.body.lat
  }
  //活动规定签到距离
  let distance = ctx.request.body.distance;
  //活动的备注
  let mess = ctx.request.body.mess;

  //额定人数
  let personNum = ctx.request.body.personNum;

  //是否开启签到
  let isCheck = ctx.request.body.check;
  let result = await mysql("cActivity").update({
    title,
    typeId,
    startTime,
    endTime,
    reward,
    rewardMark,
    location,
    locationId: JSON.stringify(locationId),
    isCheck,
    distance,
    isNeedCheck: JSON.stringify(isNeedCheck),
    isActive: 1,
    personNum,
    mess,
    pointClass: JSON.stringify(pointClass),
    pointCollege: pointCollege
  }).where("id", "=", id);
  if (result) {
    ctx.state.code = 1;
    ctx.state.data = {
      message: "ok"
    }
  } else {
    ctx.state.code = 0;
    ctx.state.data = {
      error: "发生错误"
    }
  }
}

module.exports = {
  getActivityTypeList,
  updateActivityType,
  postAddType,
  postAddActivity,
  getActivityList,
  postUpdateCheckStatus,
  postUpdateFinishStatus,
  getActivitySignList,
  getActivityCheckList,
  getActivityFeedBackList,
  getActivityInfo,
  postActivityModify
};