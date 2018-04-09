import React from 'react';
import ReactDOM from 'react-dom'
import App from "./app/App";
import "./index.less";

import 'element-theme-default/lib/index.css';

global.__DEV__ = true;

ReactDOM.render(
  <App/>, document.getElementById("root")
);