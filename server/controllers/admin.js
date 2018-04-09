/**
 * Created by yzdd on 2018/4/3.
 */
const {mysql} = require('../qcloud');
const moment = require("moment");

const PER_PAGE = 10;

async function getCardList(ctx) {

  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);

  if (ctx.params.year && ctx.params.month && ctx.params.day) {

    let dateTime = new Date();
    //获取年份
    let year = ctx.params.year;
    let month = ctx.params.month;
    let day = ctx.params.day;

    dateTime.setFullYear(year, month - 1, day);

    dateTime.setHours(0);
    dateTime.setMinutes(0);

    let startDay = moment(dateTime).format("YYYY-MM-DD HH:mm");
    let endDay = moment(dateTime).add(1, 'days').format("YYYY-MM-DD HH:mm");

    //总的数量
    let cardListLength = await mysql("cCardRecord").count("uuid").where(function () {
      this.where('time', '>', startDay).andWhere('time', '<', endDay)
    });
    let cardList =
      await mysql
        .select(
          "cCardRecord.uuid",
          "cCardRecord.open_id",
          "cCardRecord.distance",
          "cCardRecord.checkFlag",
          "cCardRecord.time",
          "cWork.startTime",
          "cWork.timeLong",
          "cWork.title",
          "cWork.mess",
          "cWork.distance as workDistance",
          "cWork.isActive",
          "cClass.className",
          "cStudentInfo.name",
          "cStudentInfo.studentId",
          "cSessionInfo.user_info"
        )
        .from("cCardRecord")
        .limit(PER_PAGE)
        .offset((page - 1) * 10)
        .where(function () {
          this.where('cCardRecord.time', '>', startDay).andWhere('cCardRecord.time', '<', endDay)
        })
        .join('cStudentInfo', function () {
          this.on(function () {
            this.on('cCardRecord.open_id', '=', 'cStudentInfo.open_id')
          })
        })
        .join('cSessionInfo', function () {
          this.on(function () {
            this.on('cCardRecord.open_id', '=', 'cSessionInfo.open_id')
          })
        })
        .join('cWork', function () {
          this.on(function () {
            this.on('cCardRecord.workId', '=', 'cWork.id')
          })
        })
        .join('cClass', function () {
          this.on(function () {
            this.on('cStudentInfo.classId', '=', 'cClass.id')
          })
        });
    ctx.state.code = 1;
    ctx.state.data = {
      count: cardListLength[0]["count(`uuid`)"],
      pageCount: Math.ceil(cardListLength[0]["count(`uuid`)"] / PER_PAGE),
      perPage: PER_PAGE,
      currentPage: page,
      data: cardList
    };
  } else {
    ctx.state.code = 0;
  }
}

//未打卡学生信息
async function getNotCardList(ctx) {

  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);

  if (ctx.params.year && ctx.params.month && ctx.params.day) {

    let dateTime = new Date();
    //获取年份
    let year = ctx.params.year;
    let month = ctx.params.month;
    let day = ctx.params.day;

    dateTime.setFullYear(year, month - 1, day);

    dateTime.setHours(0);
    dateTime.setMinutes(0);

    let startDay = moment(dateTime).format("YYYY-MM-DD HH:mm");
    let endDay = moment(dateTime).add(1, 'days').format("YYYY-MM-DD HH:mm");

    //总的数量
    // .count("uuid")

    let cardNotListLength = await mysql.count("uuid").from("cStudentInfo").whereNotIn("open_id", function () {
      this.select('open_id').from('cCardRecord').where(function () {
        this.where('time', '>', startDay).andWhere('time', '<', endDay)
      });
    }).join('cClass', function () {
      this.on(function () {
        this.on('cStudentInfo.classId', '=', 'cClass.id')
      })
    });
    //数据

    let cardNotList = await mysql.select('*').limit(PER_PAGE)
      .offset((page - 1) * 10).from("cStudentInfo").whereNotIn("open_id", function () {
        this.select('open_id').from('cCardRecord').where(function () {
          this.where('time', '>', startDay).andWhere('time', '<', endDay)
        });
      }).join('cClass', function () {
        this.on(function () {
          this.on('cStudentInfo.classId', '=', 'cClass.id')
        })
      });


    ctx.state.code = 1;
    ctx.state.data = {
      count: cardNotListLength[0]["count(`uuid`)"],
      pageCount: Math.ceil(cardNotListLength[0]["count(`uuid`)"] / PER_PAGE),
      perPage: PER_PAGE,
      currentPage: page,
      data: cardNotList
    };
  } else {
    ctx.state.code = 0;
  }
}

//获取班级信息
async function getAdminClassList(ctx) {
  let page = isNaN(Number(ctx.query.page)) ? 1 : Number(ctx.query.page);
  //获取数量
  let classResultLength = await mysql
    .count("id")
    .from("cClass");
  //获取数据
  let classResult = await mysql
    .select("*")
    .from("cClass");
  console.log(classResult, classResultLength);
  ctx.state.code = 1;
  ctx.state.data = {
    count: classResultLength[0]["count(`id`)"],
    pageCount: Math.ceil(classResultLength[0]["count(`id`)"] / classResultLength[0]["count(`id`)"]),
    perPage: classResultLength[0]["count(`id`)"],
    currentPage: 1,
    data: classResult
  }
}

module.exports = {
  getCardList,
  getNotCardList,
  getAdminClassList
};