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

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app-body">
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/class" component={ClassManage}/>
            <Route exact path="/work" component={WorkManage}/>
            <Route exact path="/student" component={StudentManage}/>
            <Route exact path="/statistics" component={Statistics}/>
            <Route exact path="/homeNot" component={HomeNot}/>
          </Switch>
        </div>
      </Router>
    )
  }
}