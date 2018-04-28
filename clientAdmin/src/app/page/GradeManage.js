/**
 * Created by yzdd on 2018/4/25.
 */
import React, {Component} from 'react';
import {GradeListStore, updateGrade} from "../logic/GradeListStore";
import {Button, Loading, Message, Table, Layout} from "element-react";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import AddGradeModal from "../component/AddGradeModal";
import {withRouter} from "react-router-dom";

@observer
class GradeManage extends Component {

  gradeListStore = new GradeListStore();

  async componentWillMount() {

    //获取到上个页面传递来的参数
    let title = this.props.location.query.title;
    let cid = this.props.location.query.cid;


    this.loading = true;
    await this.gradeListStore.getList(cid);
    this.loading = false;
  }

  @observable
  changeVisible = false;

  @observable
  loading = false;

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          type: 'index',
          width: "160"
        },
        {
          label: "年级名字",
          prop: "gradeName",
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
        },
        {
          label: "操作",
          render: (data) => {
            return (
              <span>
                <Button type="primary" onClick={() => this.toLookClass(data)}>查看班级</Button>
              </span>
            )
          }
        }
      ]
    }
  }

  //跳转到对应的年级  学院的班级里面去
  toLookClass = (data) => {
    this.props.history.push({
      pathname: "/class",
      query: {
        cid: this.props.location.query.cid,
        ctitle: this.props.location.query.title,
        gid: data.id,
        gtitle: data.gradeName
      }
    })
  };

  updateBtn = async (data) => {
    this.loading = true;
    let result = await updateGrade(data.id, !data.isActive);
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
  }

  changeTag = () => {
    this.changeVisible = !this.changeVisible;
  };

  showAddModal = () => {
    this.gradeAddModal.show();
  }

  render() {
    return (
      <div>
        <h1>{this.props.location.query.title}</h1>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
              {
                this.changeVisible ?
                  <Button type="primary" icon="minus" onClick={this.changeTag}>只显示激活的年级</Button>
                  :
                  <Button type="primary" icon="more" onClick={this.changeTag}>显示所有的年级</Button>
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
                this.gradeListStore.list.slice(0)
                :
                this.gradeListStore.list.filter((v, i) => v.isActive === 1).slice(0)
            }
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
        </Loading>
        <AddGradeModal ref={ref => this.gradeAddModal = ref} cid={this.props.location.query.cid}
                       gradeStore={this.gradeListStore}/>
      </div>
    );
  }
}

export default withRouter(GradeManage);