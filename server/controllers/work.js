/**
 * Created by yzdd on 2018/4/1.
 */
const {mysql} = require('../qcloud');

//获取到任务列表
async function getWorkTask(ctx) {
  let result = await mysql.select("*").from("cWork").where('isActive', 1);
  console.log(result, "----搜寻的结果");
  ctx.state.data = result[0];
}

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


//获取当前位置距离标准点距离
//当前工大百度地图坐标是
//120.043334,30.230949
async function getDistance(ctx) {
  ctx.state.code = 1;
  ctx.state.data = {
    distance: getFlatternDistance(30.230949, 120.043334, Number(ctx.query.lat), Number(ctx.query.lng))
  }
}

//查询

module.exports = {
  getWorkTask: getWorkTask,
  getDistance: getDistance
};