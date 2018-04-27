/**
 * Created by yzdd on 2018/4/22.
 */
import URI from 'urijs';
import {get, post} from '../rpc';
import {observable} from 'mobx';
import moment from 'moment';

export class ActivityCheckListStore {
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
      const uri = new URI(`/activity/check`).query({
        page: this.page,
        ...this.obj,
        id
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new ActivityCheckItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class ActivityCheckItem {
  id;
  activityId;
  signCheck;
  checkTime;
  studentId;
  name;
  className;

  from(obj) {
    this.id = obj.id;
    this.activityId = obj.activityId;
    this.signCheck = obj.signCheck;
    this.checkTime = obj.checkTime;
    this.studentId = obj.studentId;
    this.name = obj.name;
    this.className = obj.className;
    return this;
  }
}

//导出报名xls名单
export async function loadCheckApi(id, flag) {
  const uri = new URI("/download/check").query({
    id,
    flag
  });
  try {
    fetch("/admin" + uri.toString()).then(res => res.blob().then(blob => {
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      var filename = res.headers.get('Content-Disposition');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }));
  } catch (error) {
    console.log(error);
  }
}