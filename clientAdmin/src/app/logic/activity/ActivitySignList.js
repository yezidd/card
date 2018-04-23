/**
 * Created by yzdd on 2018/4/22.
 */

import URI from 'urijs';
import {get, post} from '../rpc';
import {ActivityItem} from "./ActivityListStore";
import {observable} from "mobx";

export class ActivitySignList {
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

  async getList(id) {
    try {
      const uri = new URI(`/activity/sign`).query({
        page: this.page,
        id
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        console.log('-----v', "-------", v)
        listPre.push(new SignItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

      console.log(this.list);

    } catch (err) {
      throw err;
    }
  }
}

export class SignItem {


  name;

  className;

  studentId;

  phone;

  createTime;


  from(obj) {

    this.name = obj.name;
    this.className = obj.className;
    this.studentId = obj.studentId;
    this.phone = obj.phone;
    this.createTime = obj.createTime;

    return this;
  }
}

//导出报名xls名单
export async function loadSignApi(id) {
  const uri = new URI("/download/sign").query({
    id
  });
  console.log()
  try {
    fetch("/admin"+uri.toString()).then(res => res.blob().then(blob => {
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      var filename = res.headers.get('Content-Disposition');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }));
  }catch (error){
    console.log(error);
  }
}