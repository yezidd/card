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
  let req = ctx.request.body.req;
  let isNeedCheck = {};

  req.forEach((v, i) => {
    isNeedCheck[v] = true;
  });
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
    mess
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

module.exports = {
  getActivityTypeList,
  updateActivityType,
  postAddType,
  postAddActivity,
  getActivityList,
  postUpdateCheckStatus,
  postUpdateFinishStatus
};