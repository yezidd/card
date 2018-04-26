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