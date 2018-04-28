/**
 * Created by yzdd on 2018/4/25.
 */
import {observable} from 'mobx';
import URI from 'urijs';
import {get, post} from './rpc';
import moment from "moment";
import {ClassItem} from "./ClassListStore";

export class GradeListStore {
  @observable
  list = [];

  async getList(cid) {
    const uri = new URI("/grade/list").query({
      cid: cid
    });

    try {
      let result = await get(uri);
      console.log(result, "---年级列表l");

      console.log(result);
      let listPre = [];

      result.data.map((v, i) => {
        console.log(this.list, "-----");
        listPre.push(new GradeItem().from(v));
      });
      this.list.replace(listPre);

      console.log(this.list, "-----")
    } catch (err) {
      throw err;
    }
  }
  add(obj) {
    this.list.push(obj);
    console.log(this.list);
  }
}

export class GradeItem {
  @observable
  gradeName;

  id;
  @observable
  isActive;

  from(obj) {
    this.gradeName = obj.gradeName;
    this.id = obj.id;
    this.isActive = obj.isActive;
    return this;
  }
}

//更新班级的状态
export async function updateGrade(id, isActive) {
  const uri = new URI("/grade/update");
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

//添加班级
export async function addGrade(cid, gradeName) {
  const uri = new URI("/grade/add");
  try {
    let result = await post(uri, {
      collegeId: cid,
      gradeName: gradeName
    });
    console.log(result, "====添加的结果");
    return result;
  } catch (err) {
    throw err;
  }
}