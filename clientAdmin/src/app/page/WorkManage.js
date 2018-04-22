/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import AddClassModal from "../component/AddClassModal";
import {observer} from 'mobx-react';
import {
  Message,
  Switch,
  Form,
  DatePicker,
  TimePicker,
  Radio,
  Button,
  Input,
  Select,
  Layout,
  Checkbox,
  MessageBox,
  Loading,
  Notification,
  Tag
} from 'element-react';
import moment from "moment";
import {getCurrentWork, subWork, WorkItem} from "../logic/WorkApiStore";

//任务发布管理
@observer
export default class WorkManage extends Component {

  workItem = new WorkItem();

  async componentWillMount() {
    this.setState({fullscreen: true});
    let result = await getCurrentWork();
    if (result.code === 1) {
      this.workItem.from(result.data.data);
    } else {
      Message.error("发生错误,请刷新页面");
    }
    console.log(this.checkCurrentTime())
    this.setState({fullscreen: false})
  }

  constructor(props) {
    super(props);

    this.state = {
      form: {
        title: "",
        mess: "",
        startTime: null,
        timeLong: "",
        distance: "",
        fullscreen: false,
      },
      rules: {
        title: [
          {required: true, message: '请输入打卡标题', trigger: 'blur'}
        ],
        mess: [
          {required: true, message: '请输入打卡备注信息', trigger: 'blur'}
        ],
        startTime: [
          {type: 'date', required: true, message: '请选择打卡开始时间', trigger: 'change'}
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

  checkCurrentTime() {
    let dateTime = new Date();
    //获取到时和分
    let hour = this.workItem.startTime.split(":")[0];
    let minutes = this.workItem.startTime.split(":")[1];
    dateTime.setHours(Number(hour));
    dateTime.setMinutes(Number(minutes));
    let setNow = moment(dateTime).format("YYYY-MM-DD HH:mm");
    if (moment().format("YYYY-MM-DD HH:mm") > moment(dateTime).format("YYYY-MM-DD HH:mm") && moment().format("YYYY-MM-DD HH:mm") < moment(dateTime).add(this.workItem.timeLong, "hours").format("YYYY-MM-DD HH:mm")) {
      return true;
    } else {
      return false
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate((valid) => {
      if (valid) {

        let obj = this.state.form;

        let mess = obj.mess;
        let title = obj.title;
        let timeLong = obj.timeLong;
        let startTime = obj.startTime;
        let distance = obj.distance;
        console.log(moment(startTime).format("HH:mm"));
        if (timeLong > 24) {
          Message.error("请注意限制时间是否输入正确");
        } else if (this.checkCurrentTime()) {
          Message.error("请在非打卡时间端发布任务");
        }
        else if (isNaN(Number(distance)) || isNaN(Number(timeLong))) {
          Message.error("请注意输入正确的数值");
        } else {
          MessageBox.msgbox({
            title: '消息',
            message: `<标题>:${title},<备注信息>:${mess},<开始时间>:${moment(startTime).format("HH:mm")},<限制时间>:${timeLong}(小时),<限制距离>:${distance}(千米)`,
            showCancelButton: true
          }).then(async (action) => {
            if (action === "confirm") {
              this.setState({
                fullscreen: true
              });
              let result = await subWork({
                title,
                mess,
                startTime: moment(startTime).format("HH:mm"),
                timeLong: Number(timeLong),
                distance: Number(distance)
              });
              this.setState({
                fullscreen: false
              });
              if (result.code === 1) {
                Notification({
                  title: '成功',
                  message: '发布任务成功',
                  type: 'success'
                });
                this.workItem.from({
                  title,
                  mess,
                  startTime: moment(startTime).format("HH:mm"),
                  timeLong: Number(timeLong) * 1000 * 3600,
                  distance: Number(distance) * 1000
                });
                this.setState({
                  form: {
                    title: "",
                    mess: "",
                    startTime: null,
                    timeLong: "",
                    distance: "",
                    fullscreen: false,
                  }
                });
              } else {
                Notification.error({
                  title: '错误',
                  message: '发生错误',
                });
              }
            }
          })
        }
      } else {
        return false;
      }
    });

  }

  handleReset(e) {
    e.preventDefault();

    this.refs.form.resetFields();
    this.setState({
      form: {
        title: "",
        mess: "",
        startTime: null,
        timeLong: "",
        distance: "",
        fullscreen: false,
      }
    });
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, {[key]: value})
    });
  }

  render() {
    return (
      <div>
        <Layout.Col span="24">
          <div className="btn-class-group-work">
            <Tag>标题:{this.workItem.title}</Tag>
            <Tag type="gray">备注信息:{this.workItem.mess}</Tag>
            <Tag type="primary">开始时间:{this.workItem.startTime}</Tag>
            <Tag type="success">限制时间:{this.workItem.timeLong}(小时)</Tag>
            <Tag type="warning">限制距离:{this.workItem.distance}(千米)</Tag>
          </div>
        </Layout.Col>
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
          {
            this.state.fullscreen && <Loading fullscreen={true}/>
          }
        </div>
      </div>
    )
  }
}