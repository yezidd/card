/**
 * Created by yzdd on 2018/4/18.
 */
import React, {Component} from 'react';
import {Button, Checkbox, DatePicker, Form, Input, Select, Switch, Layout, Radio, Message} from "element-react";
import './activity.css'
import {addActivity} from "../../logic/activity/ActivityLoadStore";
import {observer} from 'mobx-react';
import {TypeListStore} from "../../logic/activity/TypeListStore";
import {observable} from 'mobx';

//发布活动任务
@observer
export default class ActivityLoad extends Component {

  TypeListStore = new TypeListStore();

  @observable
  loadingData = false;
  @observable
  loadingSub = false;

  async componentWillMount() {
    this.loadingData = true;
    await this.TypeListStore.getList();
    this.loadingData = false;
  }

  constructor(props) {
    super(props);

    this.state = {
      form: {
        title: '',
        startDateTime: null,
        endDate: null,
        location: "",
        lon: "",
        lat: "",
        check: false,
        req: [],
        mess: '',
        distance: '',
        type: '',
        reward: '',
        rewardMark: ''
      }
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();

    console.log(this.state.form);
    this.loadingSub = true;
    let result = await addActivity(this.state.form);
    console.log(result, "---")
    if (result.code === 1) {
      Message({
        message: '发布成功',
        type: 'success'
      });
      this.setState({
        form: {
          title: '',
          startDateTime: null,
          endDate: null,
          location: "",
          lon: "",
          lat: "",
          check: false,
          req: [],
          mess: '',
          distance: '',
          type: '',
          reward: '',
          rewardMark: ''
        }
      });
    }
    if (result.code === 0) {
      Message.error(result.data.error);
    }
    if (result.code === -1) {
      Message.error("发生错误，请联系管理员");
    }
    this.loadingSub = false;
  };

  onChange(key, value) {
    this.state.form[key] = value;
    this.forceUpdate();
  }

  handleReset(e){
    e.preventDefault();

    this.setState({
      form: {
        title: '',
        startDateTime: null,
        endDate: null,
        location: "",
        lon: "",
        lat: "",
        check: false,
        req: [],
        mess: '',
        distance: '',
        type: '',
        reward: '',
        rewardMark: ''
      }
    });
  }


  render() {
    return (
      <div className="activity-load-container">
        <Form ref="form" model={this.state.form} labelWidth="120" onSubmit={this.onSubmit}>
          <Form.Item label="活动名称">
            <Input value={this.state.form.title} onChange={this.onChange.bind(this, 'title')}
                   placeholder="活动标题"/>
          </Form.Item>
          <Form.Item label="活动类型">
            <Select value={this.state.form.type} placeholder="请选择活动类型" name="type"
                    loading={this.loadingData}
                    onChange={this.onChange.bind(this, 'type')}>
              {
                this.TypeListStore.list.filter((v, i) => v.isActive === 1).slice(0).map((v, i) => {
                  return (<Select.Option label={v.typeName} value={v.id} key={v.id}/>)
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="开始时间">
            <Layout.Col span="11">
              <Form.Item prop="date1" labelWidth="0px">
                <DatePicker
                  isShowTime={true}
                  value={this.state.form.startDateTime}
                  placeholder="选择日期时间"
                  onChange={this.onChange.bind(this, 'startDateTime')}
                />
              </Form.Item>
            </Layout.Col>
          </Form.Item>
          <Form.Item label="报名截止时间">
            <Layout.Col span="11">
              <Form.Item prop="date1" labelWidth="0px">
                <DatePicker
                  value={this.state.form.endDate}
                  placeholder="选择日期"
                  onChange={this.onChange.bind(this, 'endDate')}
                />
              </Form.Item>
            </Layout.Col>
          </Form.Item>

          <Form.Item label="活动地点名称">
            <Input
              value={this.state.form.location}
              onChange={this.onChange.bind(this, 'location')}
              placeholder={"请填写活动地点名称"}
            />
          </Form.Item>

          <Form.Item label="活动地点经纬度">
            <Layout.Col span="11">
              <Form.Item prop="lon" labelWidth="0px">
                <Input
                  value={this.state.form.lon}
                  onChange={this.onChange.bind(this, 'lon')}
                  placeholder={"活动地点经度"}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col className="line" span="2">-</Layout.Col>
            <Layout.Col span="11">
              <Form.Item prop="lat" labelWidth="0px">
                <Input
                  value={this.state.form.lat}
                  onChange={this.onChange.bind(this, 'lat')}
                  placeholder={"活动地点纬度"}
                />
              </Form.Item>
            </Layout.Col>
          </Form.Item>

          <Form.Item label="签到规定距离">
            <Layout.Col span="16">
              <Form.Item prop="distance" labelWidth="0px">
                <Input
                  value={this.state.form.distance}
                  onChange={this.onChange.bind(this, 'distance')}
                  placeholder={"请填写签到规定距离"}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col className="unit" span="4">(千米)</Layout.Col>
          </Form.Item>

          <Form.Item label="马上签到">
            <Switch
              onText=""
              offText=""
              value={this.state.form.check}
              onChange={this.onChange.bind(this, 'check')}
            />
          </Form.Item>
          <Form.Item label="报名要求">
            <Checkbox.Group value={this.state.form.req} onChange={this.onChange.bind(this, 'req')}>
              <Checkbox label="是否填写手机号" name="req" value="checkPhone"></Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="活动奖励">
            <Layout.Col span="11">
              <Form.Item prop="reward" labelWidth="0px">
                <Input
                  value={this.state.form.distance}
                  onChange={this.onChange.bind(this, 'reward')}
                  placeholder={"请填写奖励数量"}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col span="2">&nbsp;</Layout.Col>
            <Layout.Col span="11">
              <Form.Item labelWidth="0px">
                <Select value={this.state.form.rewardMark} placeholder="请选择奖励类型" name="rewardMark"
                        onChange={this.onChange.bind(this, 'rewardMark')}>
                  <Select.Option label="创新分" value="创新分"></Select.Option>
                  <Select.Option label="工时" value="工时"></Select.Option>
                </Select>
              </Form.Item>
            </Layout.Col>
          </Form.Item>

          <Form.Item label="活动备注信息">
            <Input type="textarea" value={this.state.form.mess} onChange={this.onChange.bind(this, 'mess')}></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" nativeType="submit" loading={this.loadingSub}>立即创建</Button>
            <Button onClick={this.handleReset.bind(this)}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}