/**
 * Created by yzdd on 2018/4/26.
 */
import React, {Component} from 'react';
import {getQueryVariable} from "../../util/utilFunc";
import {ActivityCheckListStore, loadCheckApi} from "../../logic/activity/ActivityCheckStore";
import {Button, Loading, Pagination, Table, Layout} from "element-react";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {withRouter} from "react-router-dom";
import moment from "moment/moment";

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

  activityCheckListStore = new ActivityCheckListStore();

  async componentWillMount() {
    this.id = getQueryVariable("id");
    this.loading = true;
    this.activityCheckListStore.obj.flag = this.checkFlag ? 1 : 0;

    await this.activityCheckListStore.getList(this.id);
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
          label: "签到信息",
          render: (data) => {
            return (
              <div>
                <span>{data.signCheck ? "已签到" : "未签到"}</span>
              </div>
            )
          }
        },
        {
          label: "签到时间",
          render: (data) => {
            return (
              <div>
                <span>{data.signCheck ? moment(data.checkTime).format("YYYY-MM-DD HH:mm") : ""}</span>
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
    this.activityCheckListStore.page = currentPage;
    this.loading = true;
    await this.activityCheckListStore.getList(this.id);
    this.loading = false;
  };


  //跳转到反馈页面
  toActivityFeedBack = () => {
    this.props.history.push("/activity/feedback?id=" + this.id+"&title="+decodeURIComponent(getQueryVariable("title")));
  };
  //导出签到情况名单
  downCheckExcel = async () => {
    this.loadingBtn = true;
    await loadCheckApi(this.id, (this.checkFlag) ? 1 : 0);
    this.loadingBtn = false;
  }
  //切换签到或者未签到状态
  changeFlag = async () => {
    this.checkFlag = !this.checkFlag;
    this.id = getQueryVariable("id");
    this.loading = true;
    this.activityCheckListStore.obj.flag = (this.checkFlag) ? 1 : 0;
    this.activityCheckListStore.page = 1;
    await this.activityCheckListStore.getList(this.id);
    this.loading = false;
  };

  render() {
    return (
      <div>
        <h1>{decodeURIComponent(getQueryVariable("title"))}-{this.checkFlag ? "签到情况" : "未签到情况"}</h1>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
              <Button type={"primary"} onClick={() => this.changeFlag()}
              >切换到{this.checkFlag ? "未签到" : "签到"}状态</Button>
              <Button type={"primary"} onClick={() => this.downCheckExcel()}
                      loading={this.loadingBtn}>导出{this.checkFlag ? "签到" : "未签到"}名单</Button>
              <Button type={"primary"} onClick={() => this.toActivityFeedBack()}
              >跳转到反馈页面</Button>
            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={
              this.activityCheckListStore.list.slice(0)
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
                        total={this.activityCheckListStore.count}
                        pageSize={10}
                        currentPage={this.activityCheckListStore.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}

export default withRouter(ActivityCheck)