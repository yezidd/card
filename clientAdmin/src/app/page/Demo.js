/**
 * Created by yzdd on 2018/4/13.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Demo extends Component {
  componentDidMount() {
    let nodes = ReactDOM.findDOMNode(this);
    console.log(nodes[0])
  }

  render() {
    return (
      <div>
        <p>111</p>
      </div>
    );
  }
}