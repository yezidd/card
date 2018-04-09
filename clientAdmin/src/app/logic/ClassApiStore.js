/**
 * Created by yzdd on 2018/4/9.
 */
import {post} from './rpc';
import URI from 'urijs';

//添加班级
export async function addClass(obj) {
  const uri = new URI("/class/add");
  try {
    let result = await post(uri, {
      ...obj
    });
    console.log(result);
    return result;
  } catch (err) {
    throw err;
  }
}

//更新班级
export async function updateClass(id, isActive) {
  const uri = new URI("/class/update");
  try {
    let result = await post(uri, {
      id,
      isActive
    });
    console.log(result, "------");
    return result;
  } catch (err) {
    throw err;
  }
}

//一键禁用全部班级

export async function DelAllClass() {
  const uri = new URI("/class/allDel");
  try {
    let result = await post(uri);
    console.log(result, "------");
    return result;
  } catch (err) {
    throw err;
  }
}