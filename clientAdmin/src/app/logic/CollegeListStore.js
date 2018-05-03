/**
 * Created by yzdd on 2018/4/25.
 */
import {observable} from 'mobx';
import URI from 'urijs';
import {get, post} from './rpc';
import moment from "moment";
import {ClassItem} from "./ClassListStore";

export class CollegeListStore {

  @observable
  list = [];

  async getList() {
    const uri = new URI("/college/list");

    try {
      let result = await get(uri);

      let listPre = [];

      result.data.map((v, i) => {
        listPre.push(new CollegeItem().from(v));
      });
      this.list.replace(listPre);
    } catch (err) {
      throw err;
    }
  }
  add(obj) {
    this.list.push(obj);
    console.log(this.list);
  }
}

export class CollegeItem {
  @observable
  collegeName;

  id;
  @observable
  isActive;

  from(obj) {
    this.collegeName = obj.collegeName;
    this.id = obj.id;
    this.isActive = obj.isActive;
    return this;
  }
}
//添加学院
export async function addCollege(collegeName) {
  const uri = new URI("/college/add");
  try {
    let result = await post(uri, {
      collegeName: collegeName
    });
    console.log(result, "====添加的结果");
    return result;
  } catch (err) {
    throw err;
  }
}