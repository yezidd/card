import {observable} from 'mobx';
import URI from 'urijs';
import {get} from './rpc';
import moment from "moment";

export class CardListStore {
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
    this.month = new Date().getMonth();
    this.day = new Date().getDay();
    this.page = 1;
  }

  async getList() {
    try {
      const uri = new URI(`/card/list/${this.year}/${this.month}/${this.day}`).query({
        page: this.page
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new Card().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class Card {
  uuid = "";
  open_id = "";
  distance = "";
  checkFlag = "";
  time = "";
  startTime = "";
  timeLongFormat = "";
  timeLong = "";
  title = "";
  mess = "";
  workDistance = "";
  isActive = "";
  className = "";
  name = "";
  studentId = "";
  user_info = "";
  momentTime = "";

  from(data) {
    this.uuid = data.uuid;
    this.open_id = data.open_id;
    this.distance = data.distance;
    this.checkFlag = data.checkFlag;
    this.time = data.time;
    this.timeLongFormat = parseFloat(Number(data.timeLong) / 3600 / 1000).toFixed(1);
    this.momentTime = moment(data.time).format("YYYY-MM-DD HH:mm");
    this.startTime = data.startTime;
    this.timeLong = data.timeLong;
    this.title = data.title;
    this.mess = data.mess;
    this.workDistance = data.workDistance;
    this.isActive = data.isActive;
    this.className = data.className;
    this.name = data.name;
    this.studentId = data.studentId;
    this.user_info = data.user_info;
    return this;
  }
}