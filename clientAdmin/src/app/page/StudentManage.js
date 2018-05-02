/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import moment from "moment/moment";
import {Loading, Table, Pagination, Layout, Button, MessageBox, Message} from 'element-react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {DelBindStudent, StudentListStore} from "../logic/StudentListStore";


//学生绑定管理界面
@observer
export default class StudentManage extends Component {

  studentListStore = new StudentListStore();

  @observable
  loading = true;

  async componentWillMount() {
    this.loading = true;
    await this.studentListStore.getList();
    this.loading = false;
  }

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          type: 'index'
        },
        {
          label: "上次登录时间",
          prop: "last_visit_time",
          render: (data) => {
            return <span>{moment(data.last_visit_time).format("YYYY_MM_DD HH:mm:ss")}</span>
          }
        },
        {
          label: "微信信息",
          prop: "user_info",
          render: (data) => {
            console.log("---data---", data);
            return (
              <div className={"user-block"}>
                <img src={data.user_info.avatarUrl} className="avatar"/>
                {data.user_info.nickName}
              </div>
            )
          }
        },
        {
          label: "姓名",
          prop: "name",
          width: 160
        },
        {
          label: "班级",
          prop: "className"
        },
        {
          label: "学号",
          prop: "studentId"
        },
        {
          label: "唯一ID",
          prop: "open_id"
        },
        // {
        //   label: "操作",
        //   render: (data) => {
        //     return (
        //       <span>
        //           <Button type="danger" size="small" onClick={() => this.DelBind(data)}>解绑</Button>
        //         </span>
        //     )
        //   }
        // }
      ]
    }
  }

  //解绑函数
  DelBind = (data) => {
    MessageBox.confirm('此操作将永久此学号和微信的绑定, 是否继续?', '提示', {
      type: 'warning'
    }).then(async () => {
      this.loading = true;
      let result = await DelBindStudent(data.open_id, data.uuid);
      this.loading = false;
      if (result.code === 1) {
        Message({
          type: 'success',
          message: '删除成功!'
        });
        this.studentListStore.del(data.open_id, data.uuid);
      } else {
        Message.error("发生错误");
      }
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消'
      });
    });
  };

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.cardListStore.page = currentPage;
    this.loading = true;
    await this.cardListStore.getList();
    this.loading = false;
  };


  render() {
    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="rowBlock">

            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            fit={true}
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={this.studentListStore.list.slice(0)}
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
          <div className="bottom-block">
            <Pagination layout="prev, pager, next, jumper"
                        total={this.studentListStore.count}
                        pageSize={10}
                        currentPage={this.studentListStore.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}