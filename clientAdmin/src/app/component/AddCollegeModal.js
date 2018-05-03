/**
 * Created by yzdd on 2018/4/5.
 */
import React, {Component} from 'react';
import {Button, Dialog, Form, Select, Input, Loading, Message} from "element-react";
import {addClass} from "../logic/ClassApiStore";
import {ClassItem} from "../logic/ClassListStore";
import {addGrade, GradeItem} from "../logic/GradeListStore";
import {addCollege, CollegeItem} from "../logic/CollegeListStore";

export default class AddCollegeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible2: false,
      dialogVisible3: false,
      fullscreen: false,
      form: {
        name: '',
      }
    };
  }

  show = () => {
    this.setState({
      dialogVisible3: true
    })
  };

  addCollege = async () => {
    let flag = false;
    this.props.collegeStore.list.map((v, i) => {
      if (v.collegeName === this.state.form.name) {
        flag = true;
      }
    });
    if (flag) {
      Message("不能添加重复学院");
    } else {
      this.setState({fullscreen: true});
      let result = await addCollege(this.state.form.name);
      this.setState({fullscreen: false});
      if (result.code === 1) {
        Message({
          message: '添加成功',
          type: 'success'
        });
        //本地添加数据
        this.props.collegeStore.add(new CollegeItem().from({
          id: result.data.id,
          collegeName: this.state.form.name,
          isActive: 1
        }));

      } else {
        Message.error("发生错误");
      }
      this.setState({dialogVisible3: false});
      this.state.form['name'] = "";
    }
  };

  onChange(key, value) {
    this.state.form[key] = value;
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Dialog
          title="添加学院"
          visible={this.state.dialogVisible3}
          onCancel={() => this.setState({dialogVisible3: false})}
        >
          <Dialog.Body>
            <Form model={this.state.form}>
              <Form.Item label="学院名称" labelWidth="120">
                <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.setState({dialogVisible3: false})}>取 消</Button>
            <Button type="primary" onClick={this.addCollege}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
        {
          this.state.fullscreen && <Loading fullscreen={true}/>
        }
      </div>
    );
  }
}