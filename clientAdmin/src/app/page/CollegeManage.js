import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Loading, Table, Button, Message, Layout} from "element-react";
import {CollegeListStore} from "../logic/CollegeListStore";
import {withRouter} from 'react-router-dom';
import {updateCollege} from "../logic/GradeListStore";
import AddCollegeModal from "../component/AddCollegeModal";

//学院管理
@observer
class CollegeManage extends Component {

  collegeListStore = new CollegeListStore();

  async componentWillMount() {
    this.loading = true;
    this.collegeListStore.getList();
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
          label: "学院名字",
          prop: "collegeName",
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
                <Button type="primary" size="small" onClick={() => this.toLookGrade(data)}>查看年级</Button>
              </span>
            )
          }
        }
      ]
    }
  }

  @observable
  loading = false;

  @observable
  changeVisible = false;

  //跳转到学院的年级管理
  toLookGrade = (data) => {
    this.props.history.push(`/grade?title=${data.collegeName}&cid=${data.id}`)
  };

  updateBtn = async (data) => {
    this.loading = true;
    let result = await updateCollege(data.id, !data.isActive);
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
    this.addCollegeModal.show();
  }

  render() {
    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="btn-class-group">
              {
                this.changeVisible ?
                  <Button type="primary" icon="minus" onClick={this.changeTag}>只显示激活的学院</Button>
                  :
                  <Button type="primary" icon="more" onClick={this.changeTag}>显示所有的学院</Button>
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
                this.collegeListStore.list.slice(0)
                :
                this.collegeListStore.list.filter((v, i) => v.isActive === 1).slice(0)
            }
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
        </Loading>
        <AddCollegeModal ref={ref => this.addCollegeModal = ref}
                         collegeStore={this.collegeListStore}/>
      </div>
    )
  }
}

export default withRouter(CollegeManage);