/**
 * Created by yzdd on 2018/4/22.
 */
import URI from 'urijs';
import {get, post} from '../rpc';
import {observable} from 'mobx';
import {ActivityTypeItem} from "./TypeListStore";
import moment from 'moment';

export class ActivityListStore {
  @observable
  list = [];

  @observable
  page;

  //总的页数和总的数量
  @observable
  pageCount;

  @observable
  count;

  constructor() {
    this.page = 1;
  }

  async getList() {
    try {
      const uri = new URI(`/activity/list`).query({
        page: this.page
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new ActivityItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class ActivityItem {
  id;
  title;
  reward;
  rewadMark;
  location;
  locationId;
  @observable
  isCheck;

  distance;

  startTime;
  endTime;
  createdTime;
  updatedTime;
  isNeedCheck;
  isActive;
  personNum;
  signNum;
  mess;
  cid;
  typeName;
  @observable
  isFinish;

  from(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.reward = obj.reward;
    this.rewardMark = obj.rewardMark;
    this.location = obj.location;
    this.locationId = JSON.parse(obj.locationId);
    this.isCheck = obj.isCheck;
    this.distance = obj.distance;
    this.startTime = moment(obj.startTime).format("YYYY-MM-DD HH:mm");
    this.endTime = moment(obj.endTime).format("YYYY-MM-DD");
    this.createdTime = moment(obj.createdTime).format("YYYY-MM-DD HH:mm");
    this.updatedTime = moment(obj.updatedTime).format("YYYY-MM-DD HH:mm");
    this.isNeedCheck = JSON.parse(obj.isNeedCheck);
    this.isActive = obj.isActive;
    this.personNum = obj.personNum;
    this.signNum = obj.signNum;
    this.mess = obj.mess;
    this.cid = obj.cid;
    this.typeName = obj.typeName;
    this.isFinish = obj.isFinish;
    return this;
  }
}

//更新签到状态
export async function updateCheckStatusApi(data) {
  const uri = new URI("/activity/check/update");
  try {
    let result = await post(uri, {
      id: data.id,
      isCheck: !data.isCheck
    });
    if (result.code === 1) {
      data.isCheck = result.data.isCheck;
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}
//结束活动成功
export async function finishActivityApi(data){
  const uri = new URI("/activity/finish");
  try {
    let result = await post(uri, {
      id: data.id,
    });
    if (result.code === 1) {
      data.isFinish = 1;
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}