/**
 * Created by yzdd on 2018/4/26.
 */
import React, {Component} from 'react';
import {Button, Dialog, Form, Select, Input, Loading, Message, Transfer} from "element-react";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {ClassListStore} from "../logic/ClassListStore";
import {SelectClassModalStore} from "../logic/activity/SelectClassModalStore";

@observer
export default class SelectClassModal extends Component {

  selectClassModalStore = new SelectClassModalStore();

  constructor(props) {
    super(props);

    this.state = {
      dialogVisible2: false,
      dialogVisible3: false,
      fullscreen: false,
      value: []
    };

    this._handleChange = this.handleChange.bind(this);
    this._filterMethod = this.filterMethod.bind(this);
    this._renderFunc = this.renderFunc.bind(this);
  }

  show = async () => {
    console.log(this.props.cid);
    this.setState({
      dialogVisible3: true
    });
    this.setState({
      fullscreen: true
    });
    await this.selectClassModalStore.getClassSelectList(this.props.cid);
    this.setState({
      value: this.props.selectData
    });
    this.setState({
      fullscreen: false
    });
  };

  get data() {
    const data = [];
    this.selectClassModalStore.list.forEach((v, i) => {
      data.push({
        key: v.id,
        label: v.gradeName + "-" + v.className
      })
    });
    return data;
  }

  filterMethod(query, item) {
    return item.label.indexOf(query) > -1;
  }

  handleChange(value) {
    this.setState({value})
  }

  renderFunc(option) {
    return <span>{option.label}</span>;
  }

  get style() {
    return {
      marginLeft: '20px',
      padding: '6px 5px'
    }
  }

  addClass = () => {
    //把当前选择的值传递回之前的页面
    this.props.setPointClassData(this.state.value);
    this.setState({
      dialogVisible3: false
    });
  };

  render() {
    const {value} = this.state;
    console.log(value, "==value------")
    return (
      <div>
        <Dialog
          title="选择班级"
          visible={this.state.dialogVisible3}
          onCancel={() => this.setState({dialogVisible3: false})}
        >
          <Dialog.Body>
            <Transfer
              value={value}
              filterable

              renderContent={this.renderFunc}
              titles={['未选择班级', '已选择班级']}
              buttonTexts={['到左边', '到右边']}
              footerFormat={{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }}
              onChange={this._handleChange}
              data={this.data}
            >
            </Transfer>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.setState({dialogVisible3: false})}>取 消</Button>
            <Button type="primary" onClick={this.addClass}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
        {
          this.state.fullscreen && <Loading fullscreen={true}/>
        }
      </div>
    )
  }
}