/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import AddClassModal from "../component/AddClassModal";

//任务发布管理
export default class WorkManage extends Component {
  render() {
    return (
      <div>
        <p>任务管理界面</p>
        <AddClassModal/>
      </div>
    );
  }
}