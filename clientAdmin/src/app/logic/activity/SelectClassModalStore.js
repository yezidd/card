/**
 * Created by yzdd on 2018/4/26.
 */
import {get, post} from '../rpc';
import {observable} from 'mobx';
import URI from 'urijs';

export class SelectClassModalStore {
  @observable
  list = [];

  async getClassSelectList(cid) {
    const uri = new URI("/class/select").query({
      cid
    });
    try {
      let result = await get(uri);
      console.log(result);
      this.list.replace(result.data);
      return result;
    } catch (err) {
      throw err;
    }
  }
}