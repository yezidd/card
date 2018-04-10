import {observable} from 'mobx';
import URI from 'urijs';
import {get} from './rpc';
import moment from "moment";
import globalData from "./GlobalDataStore";

export class CardNotListStore {
  @observable
  list = [];

  @observable
  page;

  @observable
  year;

  @observable
  month;

  @observable
  day;

  //总的页数和总的数量
  @observable
  pageCount;

  @observable
  count;

  constructor() {
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.day = new Date().getDate();
    if(globalData.selectData===null){
      globalData.selectData = new Date();
    }
    this.page = 1;
  }

  async getList() {
    try {
      const uri = new URI(`/card/not/list/${this.year}/${this.month}/${this.day}`).query({
        page: this.page
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new CardPerson().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class CardPerson {
  uuid = "";
  open_id = "";
  name = "";
  className = "";
  studentId = "";

  from(data) {
    this.uuid = data.uuid;
    this.open_id = data.open_id;
    this.name = data.name;
    this.className = data.className;
    this.studentId = data.studentId;
    return this;
  }
}