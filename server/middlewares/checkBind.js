/**
 * Created by yzdd on 2018/4/1.
 */
const debug = require('debug')('koa-weapp-demo')

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
  if (ctx.state.$wxInfo.loginState) {
    let resultOne = await mysql("id").from("cStudentInfo").where("open_id", ctx.state.$wxInfo.userinfo.openId);
    if (resultOne.length = 0) {
      ctx.state.code = 403;
      ctx.state.data = {message: "此用户还未绑定"};
    }
  }
  await next();
};