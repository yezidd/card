/**
 * Created by yzdd on 2018/4/22.
 */
import URI from 'urijs';
import {get, post} from '../rpc';
import {observable} from 'mobx';
import moment from 'moment';

export class ActivityFeedBackStore {
  @observable
  list = [];

  @observable
  page;

  //总的页数和总的数量
  @observable
  pageCount;

  @observable
  count;

  @observable
  obj = {
    flag: 1
  };

  constructor() {
    this.page = 1;
  }

  async getList(id) {
    try {
      const uri = new URI(`/activity/feedback`).query({
        page: this.page,
        ...this.obj,
        id
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new ActivityFeedBackItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class ActivityFeedBackItem {
  id;
  activityId;
  feedbackFlag;
  feedbackMess;
  feedTime;
  studentId;
  name;
  className;

  from(obj) {
    this.id = obj.id;
    this.activityId = obj.activityId;
    this.feedbackFlag = obj.feedbackFlag;
    this.feedbackMess = obj.feedbackMess;
    this.feedTime = obj.feedTime;
    this.studentId = obj.studentId;
    this.name = obj.name;
    this.className = obj.className;
    return this;
  }
}