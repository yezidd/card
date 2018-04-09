/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import AddClassModal from "../component/AddClassModal";

import {Switch, Form, DatePicker, TimePicker, Radio, Button, Input, Select, Layout, Checkbox} from 'element-react';

//任务发布管理
export default class WorkManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        title: "",
        mess: "",
        startTime: null,
        timeLong: "",
        distance: "",
      },
      rules: {
        title: [
          {required: true, message: '请输入打卡标题', trigger: 'blur'}
        ],
        mess: [
          {required: true, message: '请输入打卡备注信息', trigger: 'blur'}
        ],
        startTime: [
          {required: true, message: '请选择打卡开始时间', trigger: 'blur'}
        ],
        timeLong: [
          {required: true, message: '请输入打卡限制时间', trigger: 'blur'}
        ],
        distance: [
          {required: true, message: '请输入打卡限制距离', trigger: 'blur'}
        ],
      }
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate((valid) => {
      if (valid) {
        alert('submit!');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  handleReset(e) {
    e.preventDefault();

    this.refs.form.resetFields();
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, {[key]: value})
    });
  }

  render() {
    return (
      <div className="work-container">
        <h2>打卡任务发布</h2>
        <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80" className="demo-ruleForm">
          <Form.Item label="标题" prop="title">
            <Input value={this.state.form.title} onChange={this.onChange.bind(this, 'title')}/>
          </Form.Item>
          <Form.Item label="备注信息" prop="mess">
            <Input value={this.state.form.mess} onChange={this.onChange.bind(this, 'mess')}/>
          </Form.Item>
          <Form.Item label="活动时间" required={true}>
            <Layout.Col span="11">
              <Form.Item prop="startTime" labelWidth="0px">
                <TimePicker
                  value={this.state.form.startTime}
                  selectableRange="00:00:00 - 23:59:00"
                  placeholder="选择开始时间"
                  onChange={this.onChange.bind(this, 'startTime')}
                />
              </Form.Item>
            </Layout.Col>
          </Form.Item>
          <Form.Item label="限制时间" prop="timeLong">
            <Input value={this.state.form.timeLong} onChange={this.onChange.bind(this, 'timeLong')}/>
            <span>(小时)</span>
          </Form.Item>
          <Form.Item label="限制距离" prop="distance">
            <Input value={this.state.form.distance} onChange={this.onChange.bind(this, 'distance')}/>
            <span>(千米)</span>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSubmit.bind(this)}>立即创建</Button>
            <Button onClick={this.handleReset.bind(this)}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}