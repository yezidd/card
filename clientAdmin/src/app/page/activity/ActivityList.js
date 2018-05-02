/**
 * Created by yzdd on 2018/4/21.
 */
import React, {Component} from 'react';
import {Loading, Pagination, Table, Tooltip, Button, Message} from "element-react";
import {ActivityListStore, finishActivityApi, updateCheckStatusApi} from "../../logic/activity/ActivityListStore";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import './activity.css'
import {withRouter} from "react-router-dom";

@observer
class ActivityList extends Component {

  activityListStore = new ActivityListStore();

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          label: '序号',
          prop: "id",
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          label: "标题",
          prop: "title",
          width: 160,
          fixed: 'left',
          align: 'center',
          render: (data) => {
            return (
              <span onClick={() => this.toModifyActivity(data)} className="point">{data.title}</span>
            )
          }
        },
        {
          label: "操作",
          fixed: 'left',
          width: 160,
          align: "center",
          render: (data) => {
            return (
              <span>
                  <Tooltip className="item" effect="dark" content="用户根据位置进行签到" placement="top-start">
                    <Button type="primary"
                            onClick={() => this.updateCheckStatus(data)}>{data.isCheck ? '关闭签到' : '开启签到'}</Button>
                  </Tooltip>
                </span>
            )
          }
        },
        {
          label: "操作",
          fixed: 'left',
          width: 160,
          align: "center",
          render: (data) => {
            return (
              <span>
                <Button type="primary" onClick={() => this.toSignList(data)}>点击查看报名情况</Button>
                </span>
            )
          }
        },
        {
          label: "操作",
          fixed: 'left',
          width: 160,
          align: "center",
          render: (data) => {
            return (
              <span>
                  <Tooltip className="item" effect="dark" content="活动结束之后,用户可以进行反馈" placement="top-end">
                    <Button type="primary waring" disabled={!!data.isFinish}
                            onClick={() => this.finishActivity(data)}>活动结束</Button>
                  </Tooltip>
                </span>
            )
          }
        },
        {
          label: "奖励",
          render(data) {
            return <span><span className={"font1"}>{data.reward}</span>{data.rewardMark}</span>
          },
          width: 160,
        },
        {
          label: "地点",
          prop: "location",
          width: 160,
        },
        {
          label: "签到是否开启",
          render(data) {
            if (data.isCheck) {
              return <i className="el-icon-circle-check"></i>
            } else {
              return <i className="el-icon-circle-close"></i>
            }
          }
        },
        {
          label: "规定打卡距离",
          prop: "distance",
          width: 160,
        },
        {
          label: "活动开始时间",
          prop: "startTime",
          width: 160,
        },
        {
          label: "报名截止时间",
          prop: "endTime",
          width: 160,
        },
        {
          label: "报名要求",
          prop: "signNum",
        },
        {
          label: "报名额定人数",
          prop: "personNum",
        },
        {
          label: "报名人数",
          prop: "signNum",
        },
        {
          label: "备注",
          prop: "mess",
          render(data) {
            return <span className={"font2"}>{data.mess}</span>
          },
          width: 400,
        },
        {
          label: "活动类型",
          prop: "typeName",
        },
        {
          label: "活动是否结束",
          render(data) {
            return <span className={"font2"}>{data.isFinish ? '是' : '否'}</span>
          },
        }
      ]
    }
  }

  toModifyActivity = (data) => {
    console.log(data.title);
    this.props.history.push("/activity/modify?id=" + data.id);
  }

  @observable
  loading = false;


  //跳转到报名页面
  toSignList = (data) => {
    console.log(data.id)
    this.props.history.push("/activity/sign?id=" + data.id + "&title=" + data.title);
  }

  //更新是否签到的状态
  updateCheckStatus = async (data) => {
    this.loading = true;
    let result = await updateCheckStatusApi(data);
    if (result.code === 1) {
      Message({
        message: data.isCheck ? data.id + "-开启签到成功" : data.id + "-关闭签到成功",
        type: "success"
      });
    } else {
      Message.error("发生错误");
    }
    this.loading = false;
  }

  //结束活动
  finishActivity = async (data) => {
    if (data.isCheck) {
      Message('请先确认是否已经关闭签到');
    } else {
      this.loading = true;
      let result = await finishActivityApi(data);
      if (result.code === 1) {
        Message({
          message: "结束成功",
          type: "success"
        });
      } else if (result.code === 0) {
        Message("请先关闭签到之后再结束任务");
      } else {
        Message.error("发生错误,请刷新页面");
      }
    }
    this.loading = false;
  }

  async componentWillMount() {
    this.loading = true;
    await this.activityListStore.getList();
    this.loading = false;
  }

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.activityListStore.page = currentPage;
    this.loading = true;
    await this.activityListStore.getList();
    this.loading = false;
  };

  render() {
    return (
      <div>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={
              this.activityListStore.list.filter((v, i) => v.isActive === 1).slice(0)
            }
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
          <div className="bottom-block">
            <Pagination layout="prev, pager, next, jumper"
                        total={this.activityListStore.count}
                        pageSize={10}
                        currentPage={this.activityListStore.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}

export default withRouter(ActivityList);