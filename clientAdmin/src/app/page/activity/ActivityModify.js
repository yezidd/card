/**
 * Created by yzdd on 2018/4/28.
 */
import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {getQueryVariable} from "../../util/utilFunc";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {getActivityInfoById, postActivityModify} from "../../logic/activity/ActivityModifyStore";
import {
  Button, Checkbox, DatePicker, Form, Input, Select, Switch, Layout, Radio, Message,
  Loading
} from "element-react";
import './activity.css'
import {addActivity} from "../../logic/activity/ActivityLoadStore";
import {CollegeListStore} from "../../logic/CollegeListStore";
import {TypeListStore} from "../../logic/activity/TypeListStore";
import SelectClassModal from "../../component/SelectClassModal";
import moment from "moment";

@observer
class ActivityModify extends Component {

  typeListStore = new TypeListStore();

  collegeListStore = new CollegeListStore();

  @observable
  loadingData = false;
  @observable
  loadingSub = false;

  //获取到活动的详情，然后实现修改功能
  async componentWillMount() {
    let id = getQueryVariable("id");
    this.setState({
      fullscreen: true
    });
    let result = await getActivityInfoById(id);
    console.log(result.data, "======");
    this.setState({
      form: {
        title: result.data.title,
        distance: Number(result.data.distance),
        check: result.data.isCheck,
        isNeedCheck: JSON.parse(result.data.isNeedCheck),
        location: result.data.location,
        lon: JSON.parse(result.data.locationId).lon,
        lat: JSON.parse(result.data.locationId).lat,
        mess: result.data.mess,
        personNum: Number(result.data.personNum),
        pointClass: JSON.parse(result.data.pointClass),
        pointCollege: result.data.pointCollege,
        reward: Number(result.data.reward),
        rewardMark: result.data.rewardMark,
        startDateTime: new Date(result.data.startTime),
        endDate: new Date(result.data.endTime),
        type: Number(result.data.typeId),
      }
    });
    this.setState({
      fullscreen: false
    });
    this.loadingData = true;
    //获取活动类型
    await this.typeListStore.getList();

    //获取学院列表
    await this.collegeListStore.getList();

    this.loadingData = false;
  }

  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
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
        rewardMark: '',
        personNum: null,
        isNeedCheck: [
          {key: 1, name: "手机号", value: ""}
        ],
        pointCollege: "",
        fullscreen: false,
        pointClass: []
      },
      rules: {
        title: [{required: true, message: '请输入标题', trigger: 'blur,change'}],
        startDateTime: [{type: "date", required: true, message: '请输入开始时间', trigger: 'blur,change'}],
        endDate: [{type: "date", required: true, message: '请输入截止时间', trigger: 'blur,change'}],
        location: [{required: true, message: '请输入地点', trigger: 'blur'}],
        lon: [{required: true, message: '请输入经度', trigger: 'blur'}],
        lat: [{required: true, message: '请输入纬度', trigger: 'blur'}],
        type: [{required: true, message: '请输入类型', trigger: 'blur'}],
        rewardMark: [{required: true, message: '请输入奖励类型', trigger: 'blur'}],
      }
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();

    this.refs.form.validate(async (valid) => {
      let id = getQueryVariable("id");
      if (valid) {
        console.log("--提交的数据--", this.state.form);
        this.loadingSub = true;

        let result = await postActivityModify(id, this.state.form);

        console.log(result, "===修改的结果");
        if (result.code === 1) {
          Message({
            message: '修改成功',
            type: 'success'
          });
          this.props.history.push("/activity/list");
        }
        if (result.code = 0) {
          Message.error("发生错误");
        }
        this.loadingSub = false;
      } else {
        return false;
      }
    });
  };


  onChange(key, value) {
    this.state.form[key] = value;
    this.forceUpdate();
  }

  handleReset(e) {
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
      },

    });
  }

  toLoadPoint = () => {
    window.open("http://api.map.baidu.com/lbsapi/getpoint/index.html");
  }

  //添加报名所需的规则项
  addCheckItem = () => {
    this.state.form.isNeedCheck.push({
      key: this.state.form.isNeedCheck.length,
      name: "",
      value: ''
    });

    this.forceUpdate();
  }

  //绑定输入框的值
  onNeedCheckChange(index, value) {
    this.state.form.isNeedCheck[index].name = value;
    this.forceUpdate();
  }


  //跳转到选择班级界面
  toSelectClass = () => {
    if (this.state.form['pointCollege'] === "") {
      Message("请先选择学院")
    } else {
      this.selectClassModal.show();
    }
  }

  //设置一个回调函数用于给当前页面的pointClass
  setPointClassData = (data) => {
    this.state.form['pointClass'] = data;
    this.forceUpdate();
  };

  render() {
    return (
      <div className="activity-load-container">
        <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="120" onSubmit={this.onSubmit}>
          <Form.Item label="活动名称">
            <Form.Item prop="title" labelWidth="0px">
              <Input value={this.state.form.title} onChange={this.onChange.bind(this, 'title')}
                     placeholder="活动标题"/>
            </Form.Item>
          </Form.Item>
          <Form.Item label="活动类型">
            <Select value={this.state.form.type} placeholder="请选择活动类型" name="type"
                    loading={this.loadingData}
                    onChange={this.onChange.bind(this, 'type')}>
              {
                this.typeListStore.list.filter((v, i) => v.isActive === 1).slice(0).map((v, i) => {
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
            <Form.Item prop="location" labelWidth="0px">
              <Input
                value={this.state.form.location}
                onChange={this.onChange.bind(this, 'location')}
                placeholder={"请填写活动地点名称"}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item label="活动地点经纬度">
            <Layout.Col span="9">
              <Form.Item prop="lon" labelWidth="0px">
                <Input
                  value={this.state.form.lon}
                  onChange={this.onChange.bind(this, 'lon')}
                  placeholder={"活动地点经度"}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col className="line" span="2">-</Layout.Col>
            <Layout.Col span="9">
              <Form.Item prop="lat" labelWidth="0px">
                <Input
                  value={this.state.form.lat}
                  onChange={this.onChange.bind(this, 'lat')}
                  placeholder={"活动地点纬度"}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col className="line" span="2">-</Layout.Col>
            <Layout.Col span="2">
              <Button type="primary" onClick={() => this.toLoadPoint()}>跳转获取坐标</Button>
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
          <Form.Item label="规定报名人数">
            <Layout.Col span="16">
              <Form.Item prop="personNum" labelWidth="0px">
                <Input
                  value={this.state.form.personNum}
                  onChange={this.onChange.bind(this, 'personNum')}
                  placeholder={"请填写规定人数"}
                />
              </Form.Item>
            </Layout.Col>
            <Layout.Col className="unit" span="4">(人)</Layout.Col>
          </Form.Item>
          <Form.Item label="马上签到">
            <Switch
              onText=""
              offText=""
              value={this.state.form.check}
              onChange={this.onChange.bind(this, 'check')}
            />
          </Form.Item>
          <Form.Item label="报名规则">
            <Layout.Col span="11">
              <Button type={"primary"} onClick={this.addCheckItem}>添加</Button>
            </Layout.Col>
          </Form.Item>
          {
            this.state.form.isNeedCheck.map((check, index) => {
              return (
                <Form.Item
                  key={index}
                  label={`报名规则${index + 1}`}
                  prop={check.name}
                >
                  <Layout.Col span="11">
                    <Input value={check.name} onChange={this.onNeedCheckChange.bind(this, index)}></Input>
                  </Layout.Col>
                  <Layout.Col className="line" span="2">-</Layout.Col>
                  <Layout.Col span="11">
                    <Button>删除</Button>
                  </Layout.Col>
                </Form.Item>
              )
            })
          }
          <Form.Item label="活动奖励">
            <Layout.Col span="11">
              <Form.Item prop="reward" labelWidth="0px">
                <Input
                  value={this.state.form.reward}
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

          <Form.Item label={"发布目标学院"}>
            <Select value={this.state.form.pointCollege} name="pointCollege"
                    onChange={this.onChange.bind(this, 'pointCollege')}>
              {
                this.collegeListStore.list.filter((v, i) => v.isActive === 1).slice(0).map((v, i) => {
                  return (
                    <Select.Option label={v.collegeName} value={v.id} key={v.id}/>
                  )
                })
              }
            </Select>
          </Form.Item>

          <Form.Item label={"发布目标班级"}>
            <Button type={"primary"} onClick={this.toSelectClass}>点击选择班级</Button>
          </Form.Item>


          <Form.Item label="活动备注信息">
            <Input type="textarea" value={this.state.form.mess} onChange={this.onChange.bind(this, 'mess')}></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" nativeType="submit" loading={this.loadingSub}>立即创建</Button>
            <Button onClick={this.handleReset.bind(this)}>重置</Button>
          </Form.Item>
        </Form>
        <SelectClassModal ref={ref => this.selectClassModal = ref} setPointClassData={this.setPointClassData}
                          cid={this.state.form['pointCollege']} selectData={this.state.form['pointClass']}/>
        {
          this.state.fullscreen && <Loading fullscreen={true}/>
        }
      </div>
    )
  }
}

export default withRouter(ActivityModify)