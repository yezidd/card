/**
 * Created by yzdd on 2018/4/9.
 */
import {observable} from 'mobx';
import {get, post} from './rpc';
import URI from "urijs";
import {Card} from "./CardListStore";

export class StudentListStore {
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
      const uri = new URI(`/student/list`).query({
        page: this.page
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new StudentItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }

  //解绑删除本地数据信息
  del(open_id, uuid) {
    let index = -1;
    this.list.map((v, i) => {
      if (v.open_id === open_id && v.uuid === uuid) {
        index = i;
      }
    });
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }
}

//解绑学生信息
export async function DelBindStudent(open_id, uuid) {
  try {
    let uri = new URI("/student/del");
    let result = await post(uri, {
      open_id,
      uuid
    });
    return result;
  } catch (err) {
    throw err;
  }
}

export class StudentItem {
  uuid;
  open_id;
  name;
  className;
  studentId;
  classId;
  last_visit_time;
  user_info = null;

  from(obj) {
    this.uuid = obj.uuid;
    this.open_id = obj.open_id;
    this.name = obj.name;
    this.className = obj.className;
    this.studentId = obj.studentId;
    this.classId = obj.classId;
    this.last_visit_time = obj.last_visit_time;
    this.user_info = JSON.parse(obj.user_info);
    return this;
  }

}