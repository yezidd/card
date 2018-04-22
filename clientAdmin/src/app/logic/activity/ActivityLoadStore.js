/**
 * Created by yzdd on 2018/4/19.
 */

import URI from 'urijs';
import {get, post} from '../rpc';

export async function addActivity(obj) {
  const uri = new URI("/activity/add");
  console.log(obj,"------")
  try {
    let result = await post(uri, {
      ...obj
    });
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
}