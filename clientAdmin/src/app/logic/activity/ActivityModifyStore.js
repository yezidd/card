/**
 * Created by yzdd on 2018/4/28.
 */

import URI from 'urijs';
import {get, post} from '../rpc';
import {observable} from "mobx";

//获取到活动详情
export async function getActivityInfoById(id) {
  const uri = new URI("/activity/info").query({
    id
  });
  try {
    let result = await get(uri);
    console.log(result, "====结果====");
    return result;
  } catch (err) {
    throw err;
  }
}

//修改活动
export async function postActivityModify(id, obj) {
  const uri = new URI("/activity/modify");
  try {
    let result = await post(uri, {
      id,
      ...obj
    });
    console.log(result, "====结果====");
    return result;
  } catch (err) {
    throw err;
  }
}