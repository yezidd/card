/**
 * Created by yzdd on 2018/4/2.
 */
import React, {Component} from 'react';
import icon1 from './icon_more2.png';
import NavBar from "./component/NavBar";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom';
import Home from "./page/Home";
import Statistics from "./page/Statistics";
import StudentManage from "./page/StudentManage";
import WorkManage from "./page/WorkManage";
import ClassManage from "./page/ClassManage";
import HomeNot from "./page/HomeNot";
import Demo from "./page/Demo";
import ActivityLoad from "./page/activity/ActivityLoad";
import ActivityType from "./page/activity/ActivityType";
import ActivityList from "./page/activity/ActivityList";
import ActivitySign from "./page/activity/ActivitySign";
import GradeManage from "./page/GradeManage";
import CollegeManage from "./page/CollegeManage";
import ActivityCheck from "./page/activity/ActivityCheck";
import {ActivityFeedBackStore} from "./logic/activity/ActivityFeedBackStore";
import ActivityFeedBack from "./page/activity/ActivityFeedBack";
import ActivityModify from "./page/activity/ActivityModify";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app-body">
          <NavBar/>
          <Switch>
            <Route exact path="/activity/load" component={ActivityLoad}/>
            <Route exact path="/activity/type" component={ActivityType}/>
            <Route exact path="/activity/list" component={ActivityList}/>
            <Route exact path="/activity/sign" component={ActivitySign}/>
            <Route exact path="/activity/check" component={ActivityCheck}/>
            <Route exact path="/activity/feedback" component={ActivityFeedBack}/>
            <Route exact path="/activity/modify" component={ActivityModify}/>
            <Route exact path="/card/home" component={Home}/>
            <Route exact path="/card/set" component={WorkManage}/>
            <Route exact path="/card/homeNot" component={HomeNot}/>
            <Route exact path="/class" component={ClassManage}/>
            <Route exact path="/student" component={StudentManage}/>
            <Route exact path="/grade" component={GradeManage}/>
            <Route exact path="/college" component={CollegeManage}/>
            <Route exact path="/demo" component={Demo}/>
          </Switch>
        </div>
      </Router>
    )
  }
}