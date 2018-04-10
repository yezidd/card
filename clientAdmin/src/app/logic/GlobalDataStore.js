/**
 * Created by yzdd on 2018/4/10.
 */

import {observable, autorun} from 'mobx';
import moment from "moment";

var localStorage = window.localStorage;

class GlobalDataStore {
  @observable
  selectData = null;

  // 构造
  constructor() {
    autorun(async () => {
      await localStorage.setItem("selectDate", this.selectData);
    }, {delay: 300})
  }

}

let globalData = new GlobalDataStore();

async function setGlobalData() {
  let result = await localStorage.getItem("selectDate");
  if (result) {
    globalData.selectData = new Date(result);
  }
}

setImmediate(async () => {
  await setGlobalData();
});

export default globalData;