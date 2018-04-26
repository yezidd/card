/**
 * Created by yzdd on 2018/4/22.
 */
import React, {Component} from 'react';
import {getQueryVariable} from "../../util/utilFunc";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {ActivitySignList, loadSignApi} from "../../logic/activity/ActivitySignList";
import {Button, Loading, Pagination, Table,Layout} from "element-react";
import moment from "moment";


@observer
export default class ActivitySign extends Component {

  id;

  activitySignList = new ActivitySignList();

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          label: '学号',
          prop:"studentId"
        },
        {
          label: '班级',
          prop:"className"
        },
        {
          label:'姓名',
          prop:"name"
        },
        {
          label:"报名信息",
          render:(data)=>{
            console.log(data,"======这个数据")
            return (
                <div>
                  {
                    data.needCheckData.map((v,i)=>
                      <p key={i}>{v.name}:{v.value}</p>
                    )
                  }
                </div>
            )
          }
        },
        {
          label:"报名时间",
          render:(data)=>{
            return(
                <span>{moment(data.createTime).format("YYYY-MM-DD HH:mm")}</span>
            )
          }
        },
        {
          label:"操作",
          render:(data)=>{

          }
        }
      ]
    }
  }

  @observable
  loading = false;

  async componentWillMount() {
    this.id = getQueryVariable("id");
    await this.activitySignList.getList(this.id);
  }


  componentDidMount() {
    console.log();
    //获取到活动的id

  }

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.activityListStore.page = currentPage;
    this.loading = true;
    await this.activityListStore.getList(this.id);
    this.loading = false;
  };

  @observable
    loadingBtn = false;

  //导出报名者名单
  loadSign =async ()=>{
    this.loadingBtn = true;
    await loadSignApi(this.id);
    this.loadingBtn = false;
  }

  render() {

    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
                <Button type={"primary"} onClick={()=>this.loadSign()} loading={this.loadingBtn}>导出报名名单</Button>
            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={
              this.activitySignList.list.slice(0)
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
                        total={this.activitySignList.count}
                        pageSize={10}
                        currentPage={this.activitySignList.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}