/**
 * Created by yzdd on 2018/4/5.
 */
import React, {Component} from 'react';
import {Button, Dialog, Form,Select,Input} from "element-react";

export default class AddClassModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible2: false,
      dialogVisible3: false,
      form: {
        name: '',
        region: ''
      }
    };

    this.table = {
      columns: [
        {
          label: "日期",
          prop: "date",
          width: 150
        },
        {
          label: "姓名",
          prop: "name",
          width: 100
        },
        {
          label: "地址",
          prop: "address"
        }
      ],
      data: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    };
  }
  render() {
    return (
      <div>
        <Button type="text" onClick={ () => this.setState({ dialogVisible3: true }) } type="text">打开嵌套表单的 Dialog</Button>
        <Dialog
          title="收货地址"
          visible={this.state.dialogVisible3}
          onCancel={() => this.setState({dialogVisible3: false})}
        >
          <Dialog.Body>
            <Form model={this.state.form}>
              <Form.Item label="活动名称" labelWidth="120">
                <Input value={this.state.form.name}></Input>
              </Form.Item>
              <Form.Item label="活动区域" labelWidth="120">
                <Select value={this.state.form.region} placeholder="请选择活动区域">
                  <Select.Option label="区域一" value="shanghai"></Select.Option>
                  <Select.Option label="区域二" value="beijing"></Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.setState({dialogVisible3: false})}>取 消</Button>
            <Button type="primary" onClick={() => this.setState({dialogVisible3: false})}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}