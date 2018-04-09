/**
 * Created by yzdd on 2018/4/9.
 */
import {observable} from 'mobx';
import {post, get} from './rpc';
import URI from 'urijs';

//发布任务
export async function subWork(obj) {

  console.log(obj);
  try {
    const uri = new URI("/work/update");
    let result = await post(uri, {
      ...obj
    });
    console.log(result);
    return result;
  } catch (err) {
    throw err;
  }
}

//获取当前任务
export async function getCurrentWork() {
  try {
    const uri = new URI("/work/current");
    let result = await get(uri);
    console.log(result, "---当前任务");
    return result;
  } catch (err) {
    throw err;
  }
}

export class WorkItem {
  @observable
  title;
  @observable
  mess;
  @observable
  startTime;
  @observable
  timeLong;
  @observable
  distance;

  from(obj) {
    this.title = obj.title;
    this.mess = obj.mess;
    this.startTime = obj.startTime;
    this.timeLong = parseFloat(obj.timeLong / 3600 / 1000).toFixed(2);
    this.distance = parseFloat(obj.distance / 1000).toFixed(2);
    return this;
  }

}