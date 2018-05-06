/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import {Table, Layout, DatePicker, Loading, Pagination, Button, Message, MessageBox} from 'element-react'
import './home.css';
import moment from "moment";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {ClassListStore} from "../logic/ClassListStore";
import AddClassModal from "../component/AddClassModal";
import {DelAllClass, updateClass} from "../logic/ClassApiStore";
import {withRouter} from "react-router-dom";
import {getQueryVariable} from "../util/utilFunc";


//打卡数据界面
@observer
class ClassManage extends Component {

  classListStore = new ClassListStore();

  @observable
  loading = false;

  @observable
  changeVisible = false;


  async componentWillMount() {
    let gid = getQueryVariable("gid");
    this.loading = true;
    await this.classListStore.getList(gid);
    this.loading = false;
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
          width: "160",
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
                  <Button type="danger" size="small" onClick={() => this.updateBtn(data)}>禁用</Button>
                </span>
              )
            } else {
              return (
                <span>
                  <Button type="info" size="small" onClick={() => this.updateBtn(data)}>激活</Button>
                </span>
              )
            }
          }
        }
      ]
    }
  }

  updateBtn = async (data) => {
    this.loading = true;
    let result = await updateClass(data.id, !data.isActive);
    if (result.code === 1) {
      Message({
        message: data.isActive ? "禁用成功" : "激活成功",
        type: "success"
      });
      data.isActive = !data.isActive;
    } else {
      Message.error("发生错误");
    }
    this.loading = false;
  };

  changeTag = () => {
    this.changeVisible = !this.changeVisible;
  };

  showAddModal = () => {
    this.addClassModal.show();
  };

  //一键全部禁止
  delAll = () => {
    MessageBox.confirm('此操作将禁用全部班级, 是否继续?', '提示', {
      type: 'warning'
    }).then(async () => {
      this.loading = true;
      await DelAllClass();
      Message({
        type: 'success',
        message: '禁用成功!'
      });
      this.classListStore.list.map((v, i) => {
        v.isActive = 0;
      });
      this.loading = false;

    }).catch(() => {

    });
  };


  render() {
    return (
      <div>
        <h1>{decodeURIComponent(getQueryVariable("ctitle"))}-{decodeURIComponent(getQueryVariable("gtitle"))}</h1>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
              {
                this.changeVisible ?
                  <Button type="primary" icon="minus" onClick={this.changeTag}>只显示激活的班级</Button>
                  :
                  <Button type="primary" icon="more" onClick={this.changeTag}>显示所有的班级</Button>
              }
              <Button type="primary" icon="plus" onClick={this.showAddModal}>添加</Button>
              {/*<Button type="danger" icon="circle-close" onClick={this.delAll}>全部禁用</Button>*/}
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
        <AddClassModal ref={ref => this.addClassModal = ref}
                       gid={getQueryVariable("gid")}
                       classStore={this.classListStore}/>
      </div>
    );
  }
}

export default withRouter(ClassManage)