/**
 * Created by yzdd on 2018/4/26.
 */
import React, {Component} from 'react';
import {getQueryVariable} from "../../util/utilFunc";
import {Button, Loading, Pagination, Table, Layout} from "element-react";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {withRouter} from "react-router-dom";
import moment from "moment/moment";
import {ActivityFeedBackStore} from "../../logic/activity/ActivityFeedBackStore";

//活动签到页面
@observer
class ActivityCheck extends Component {
  id;

  @observable
  loading = false;

  @observable
  checkFlag = true;

  @observable
  loadingBtn = false;

  activityFeedBackStore = new ActivityFeedBackStore();

  async componentWillMount() {
    this.id = getQueryVariable("id");
    this.loading = true;
    this.activityFeedBackStore.obj.flag = this.checkFlag ? 1 : 0;

    await this.activityFeedBackStore.getList(this.id);
    this.loading = false;
  }

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          label: '学号',
          prop: "studentId"
        },
        {
          label: '班级',
          prop: "className"
        },
        {
          label: '姓名',
          prop: "name"
        },
        {
          label: "反馈信息",
          render: (data) => {
            return (
              <div>
                <span>{data.feedbackFlag ? data.feedbackMess : "未反馈"}</span>
              </div>
            )
          }
        },
        {
          label: "反馈时间",
          render: (data) => {
            return (
              <div>
                <span>{data.feedbackFlag ? moment(data.feedTime).format("YYYY-MM-DD HH:mm") : ""}</span>
              </div>
            )
          }
        },
        {
          label: "操作",
          render: (data) => {

          }
        }
      ]
    }
  }


  changeCurrent = async (currentPage) => {
    this.activityFeedBackStore.page = currentPage;
    this.loading = true;
    await this.activityFeedBackStore.getList(this.id);
    this.loading = false;
  };
  //切换签到或者未签到状态
  changeFlag = async () => {
    this.checkFlag = !this.checkFlag;
    this.id = getQueryVariable("id");
    this.loading = true;
    this.activityFeedBackStore.obj.flag = (this.checkFlag) ? 1 : 0;
    this.activityFeedBackStore.page = 1;
    await this.activityFeedBackStore.getList(this.id);
    this.loading = false;
  };

  render() {
    return (
      <div>
        <h1>{decodeURIComponent(getQueryVariable("title"))}-{this.checkFlag ? "反馈情况" : "未反馈情况"}</h1>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
              <Button type={"primary"} onClick={() => this.changeFlag()}
              >切换到{this.checkFlag ? "未反馈" : "反馈"}状态</Button>
            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={
              this.activityFeedBackStore.list.slice(0)
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
                        total={this.activityFeedBackStore.count}
                        pageSize={10}
                        currentPage={this.activityFeedBackStore.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}

export default withRouter(ActivityCheck)