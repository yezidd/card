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
          <Menu.Item index="4">未打卡数据</Menu.Item>
          <Menu.Item index="1">打卡数据</Menu.Item>
          <Menu.SubMenu index="2" title="我的管理">
            <Menu.Item index="2-1">管理班级</Menu.Item>
            <Menu.Item index="2-2">管理打卡任务</Menu.Item>
            <Menu.Item index="2-3">管理学生绑定信息</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item index="3">打卡数据统计</Menu.Item>
        </Menu>
      </div>
    );
  }

  getDefaultActive = () => {
    console.log(this.props);
    switch (this.props.location.pathname) {
      case '/':
        return "1";
      case "/class":
        return "2-1";
      case "/work":
        return "2-2";
      case "/student":
        return "2-3";
      case "/statistics":
        return "3";
      case "/homeNot":
        return "4";
      default:
        return "1";
    }
  };

  onSelect(index) {
    if (index === "1") {
      this.props.history.push("/");
    }
    if (index === "2-1") {
      this.props.history.push("/class");
    }
    if (index === "2-2") {
      this.props.history.push("/work");
    }
    if (index === "2-3") {
      this.props.history.push("/student");
    }
    if (index === "3") {
      this.props.history.push("/statistics");
    }
    if (index === "4") {
      this.props.history.push("/homeNot");
    }
  }
}

export default withRouter(NavBar);