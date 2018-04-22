import {observable} from 'mobx';
import URI from 'urijs';
import {get, post} from '../rpc';
import moment from "moment";

export class TypeListStore {
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
      const uri = new URI(`/type/list`).query({
        page: this.page
      });
      let result = await get(uri);
      console.log(result);
      let listPre = [];

      result.data.data.map((v, i) => {
        listPre.push(new ActivityTypeItem().from(v));
      });
      this.list.replace(listPre);

      this.count = result.data.count;
      this.pageCount = result.data.pageCount;

    } catch (err) {
      throw err;
    }
  }
}

export class ActivityTypeItem {
  id = "";

  typeName = "";

  @observable
  isActive = 1;

  from(data) {
    this.id = data.id;
    this.typeName = data.typeName;
    this.isActive = data.isActive;
    return this;
  }
}

//添加类型
export async function addType(obj) {
  const uri = new URI("/type/add");
  try {
    let result = await post(uri, {
      ...obj
    });
    console.log(result);
    return result;
  } catch (err) {
    throw err;
  }
}

//更新类型状态
export async function updateTypeStatus(id, isActive) {
  const uri = new URI("/type/update");
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

//更新类型信息
export async function updateTypeInfo(id, typeName) {
  const uri = new URI("/type/modify");
  try {
    let result = await post(uri, {
      id,
      typeName
    });
    return result;
  } catch (err) {
    throw err;
  }
}

