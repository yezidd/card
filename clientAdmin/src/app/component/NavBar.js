/**
 * Created by yzdd on 2018/4/2.
 */
import React, {Component} from 'react';
import {Menu} from 'element-react';
import './navBar.css';
import {withRouter} from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <div>
        <Menu theme="dark" defaultActive={this.getDefaultActive()} className="el-menu-demo" mode="horizontal"
              onSelect={this.onSelect.bind(this)}>
          <Menu.SubMenu index="2" title="我的管理">
            <Menu.Item index="2-1">管理学院</Menu.Item>
            <Menu.Item index="2-3">管理学生绑定信息</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu index="3" title="活动管理">
            <Menu.Item index="3-1">活动发布管理</Menu.Item>
            <Menu.Item index="3-2">活动管理</Menu.Item>

            <Menu.Item index="3-5">活动类型管理</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu index="4" title="打卡管理">
            <Menu.Item index="4-1">打卡数据查看</Menu.Item>
            <Menu.Item index="4-2">未打卡数据查看</Menu.Item>
            <Menu.Item index="4-3">打卡发布</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>
    );
  }

  getDefaultActive = () => {
    switch (this.props.location.pathname) {
      case "/student":
        return "2-3";
      case "/activity/type":
        return "3-5";
      case "/activity/load":
        return "3-1";
      case "/activity/list":
        return "3-2";
      case "/college":
        return "2-1";
      case "/card/home":
        return "4-1";
      case "/card/homeNot":
        return "4-2";
      case "/card/set":
        return "4-3";
    }
  };

  onSelect(index) {
    if (index === "2-3") {
      this.props.history.push("/student");
    }
    if (index === "3-1") {
      this.props.history.push("/activity/load")
    }
    if (index === "3-2") {
      this.props.history.push("/activity/list")
    }
    if (index === "3-5") {
      this.props.history.push("/activity/type")
    }
    if (index === "2-1") {
      this.props.history.push("/college")
    }
    if (index === "4-1") {
      this.props.history.push("/card/home")
    }
    if (index === "4-2") {
      this.props.history.push("/card/homeNot")
    }
    if (index === "4-3") {
      this.props.history.push("/card/set")
    }
  }
}

export default withRouter(NavBar);