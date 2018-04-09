/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import {Table, Layout, DatePicker, Loading, Pagination, Button} from 'element-react'
import './home.css';
import moment from "moment";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {ClassListStore} from "../logic/ClassListStore";


//打卡数据界面
@observer
export default class ClassManage extends Component {

  classListStore = new ClassListStore();

  @observable
  loading = false;

  @observable
  changeVisible = false;

  /*
       [
            {
                "id": 1,
                "className": "计算机1401",
                "isActive": 1
            },
            {
                "id": 2,
                "className": "计算机1402",
                "isActive": 1
            },
            {
                "id": 3,
                "className": "计算机1403",
                "isActive": 1
            },
            {
                "id": 4,
                "className": "计算机1404",
                "isActive": 1
            }
        ]
   */
  async componentWillMount() {
    await this.classListStore.getList()
  }


  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          type: 'index',
          width: "160"
        },
        {
          label: "班级名字",
          prop: "className",
        },
        {
          label: "激活状态",
          prop: "isActive",
          width:"160",
          render: function (data) {
            return (
              <div>
                {
                  data.isActive === 1 ?
                    <span style={{marginLeft: '10px', color: "#20A0FF"}}>{"已激活"}</span>
                    :
                    <span style={{marginLeft: '10px', color: "#FF4949"}}>{"未激活"}</span>
                }
              </div>
            )
          }
        },
        {
          label: "操作",
          prop: "zip",
          render: (data) => {
            if (data.isActive) {
              return (
                <span>
                  <Button type="danger" size="small">禁用</Button>
                </span>
              )
            } else {
              return (
                <span>
                  <Button type="info" size="small">激活</Button>
                </span>
              )
            }
          }
        }
      ]
    }
  }

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.classListStore.page = currentPage;
    this.loading = true;
    await this.classListStore.getList();
    this.loading = false;
  };

  changeTag = () => {
    this.changeVisible = !this.changeVisible;
  }

  render() {
    const {selectDate} = this.state;
    console.log(window.screen.availHeight);
    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
              {
                this.changeVisible ?
                  <Button type="primary" icon="minus" onClick={this.changeTag}>只显示激活的班级</Button>
                  :
                  <Button type="primary" icon="more" onClick={this.changeTag}>显示所有的班级</Button>
              }
              <Button type="primary" icon="search">搜索</Button>
              <Button type="primary" icon="plus">添加</Button>
            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={
              this.changeVisible ?
                this.classListStore.list.slice(0)
                :
                this.classListStore.list.filter((v, i) => v.isActive === 1).slice(0)
            }
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
        </Loading>
      </div>
    );
  }
}