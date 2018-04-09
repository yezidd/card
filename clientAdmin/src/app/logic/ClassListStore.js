import {observable} from 'mobx';
import URI from 'urijs';
import {get} from './rpc';
import moment from "moment";

export class ClassListStore {
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

  add(obj) {
    this.list.push(obj);
    console.log(this.list);
  }

  async getList() {
    try {
      const uri = new URI(`/class/list`).query({
        page: this.page
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new ClassItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class ClassItem {
  id = "";
  className = "";
  @observable
  isActive = 1;

  from(data) {
    this.id = data.id;
    this.className = data.className;
    this.isActive = data.isActive;
    return this;
  }
}