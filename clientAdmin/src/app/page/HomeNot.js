/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import {Table, Layout, DatePicker, Loading, Pagination} from 'element-react'
import './home.css';
import moment from "moment";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {CardNotListStore} from "../logic/CardNotListStore";
import globalData from "../logic/GlobalDataStore";


//打卡数据界面
@observer
export default class HomeNot extends Component {

  cardNotListStore = new CardNotListStore();

  @observable
  loading = false;

  /*
       [
            {
                "id": 13,
                "uuid": "5e67f827-213c-435b-9a61-21192f2e0aac",
                "open_id": "Qa0WbW-5PvasllOi68SPIUceI",
                "name": "",
                "classId": 3,
                "studentId": "201426811223",
                "count": 0
            }
        ]
   */
  async componentWillMount() {
    if (globalData.selectData) {
      let date = moment(globalData.selectData).format("YYYY-MM-DD");
      console.log(globalData, "--------")
      let year = date.split("-")[0];
      let month = date.split("-")[1];
      let day = date.split("-")[2];
      this.cardNotListStore.year = Number(year);
      this.cardNotListStore.month = Number(month);
      this.cardNotListStore.day = Number(day);
      this.cardNotListStore.page = 1;
    }
    this.loading = true;
    await this.cardNotListStore.getList();
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
      ]
    }
  }

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.cardNotListStore.page = currentPage;
    this.loading = true;
    await this.cardNotListStore.getList();
    this.loading = false;
  };

  render() {
    // const {selectDate} = this.state;
    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="rowBlock">
              <div className="select-date-view">
                <p className="date-title-view">选择数据日期:</p>
                <DatePicker
                  value={globalData.selectData}
                  placeholder="选择日期"
                  onChange={async (dateSelect) => {
                    let date = moment(dateSelect).format("YYYY-MM-DD");
                    console.log('DatePicker1 changed: ', moment(dateSelect).format("YYYY-MM-DD"));
                    let year = date.split("-")[0];
                    let month = date.split("-")[1];
                    let day = date.split("-")[2];
                    this.cardNotListStore.year = Number(year);
                    this.cardNotListStore.month = Number(month);
                    this.cardNotListStore.day = Number(day);
                    this.cardNotListStore.page = 1;
                    this.loading = true;
                    await this.cardNotListStore.getList();
                    this.loading = false;
                    console.log(dateSelect, "-----");
                    globalData.selectData = dateSelect;

                  }}
                  disabledDate={time => time.getTime() > Date.now() - 8.64e7 + 24 * 3600 * 1000}
                />
              </div>
            </div>
          </Layout.Col>
        </Layout.Row>
        <Loading loading={this.loading}>
          <Table
            style={{width: '100%', marginTop: 10}}
            columns={this.state.columns}
            data={this.cardNotListStore.list.slice(0)}
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
          <div className="bottom-block">
            <Pagination layout="prev, pager, next, jumper"
                        total={this.cardNotListStore.count}
                        pageSize={10}
                        currentPage={this.cardNotListStore.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}