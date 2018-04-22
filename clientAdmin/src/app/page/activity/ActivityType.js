/**
 * Created by yzdd on 2018/4/19.
 */
import React, {Component} from 'react';
import {Table, Layout, Loading, Button, Message, MessageBox} from 'element-react'
import moment from "moment";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {TypeListStore, updateTypeStatus} from "../../logic/activity/TypeListStore";
import AddTypeModal from "../../component/AddTypeModal";


//活动类型管理
@observer
export default class ActivityType extends Component {
  TypeListStore = new TypeListStore();

  @observable
  loading = false;

  @observable
  changeVisible = false;

  async componentWillMount() {
    await this.TypeListStore.getList()
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
          label: "类型名称",
          prop: "typeName",
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
    let result = await updateTypeStatus(data.id, !data.isActive);
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

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.TypeListStore.page = currentPage;
    this.loading = true;
    await this.TypeListStore.getList();
    this.loading = false;
  };

  changeTag = () => {
    this.changeVisible = !this.changeVisible;
  };

  showAddModal = () => {
    this.addTypeModal.show();
  };


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
                  <Button type="primary" icon="minus" onClick={this.changeTag}>只显示激活的类型</Button>
                  :
                  <Button type="primary" icon="more" onClick={this.changeTag}>显示所有的类型</Button>
              }
              <Button type="primary" icon="plus" onClick={this.showAddModal}>添加</Button>
            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={
              this.changeVisible ?
                this.TypeListStore.list.slice(0)
                :
                this.TypeListStore.list.filter((v, i) => v.isActive === 1).slice(0)
            }
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
        </Loading>
        <AddTypeModal ref={ref => this.addTypeModal = ref} typeStore={this.TypeListStore}/>
      </div>
    );
  }
}