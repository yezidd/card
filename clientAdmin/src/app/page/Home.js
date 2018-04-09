/**
 * Created by yzdd on 2018/4/3.
 */
import React, {Component} from 'react';
import {Table, Layout, DatePicker, Loading, Pagination} from 'element-react'
import {CardListStore} from "../logic/CardListStore";
import './home.css';
import moment from "moment";
import {observable} from 'mobx';
import {observer} from 'mobx-react';


//打卡数据界面
@observer
export default class Home extends Component {

  cardListStore = new CardListStore();

  @observable
  loading = false;

  /*
      [ { id: 1,
        uuid: '5e67f827-213c-435b-9a61-21192f2e0aac',
        open_id: 'oHzQa0WbW-5PvasllOi68SPIUceI',
        distance: 11284.49,
        checkFlag: 1,
        time: 2018-04-01T02:26:30.000Z,
        workId: 1 },
      { id: 2,
        uuid: '5e67f827-213c-435b-9a61-21192f2e0aac',
        open_id: 'oHzQa0WbW-5PvasllOi68SPIUceI',
        distance: 11284.49,
        checkFlag: 1,
        time: 2018-04-01T09:08:10.000Z,
        workId: 1 } ]
   */
  async componentWillMount() {
    await this.cardListStore.getList()
  }


  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          type: 'index'
        },
        {
          label: "打卡时间",
          prop: "momentTime",
          width: 150
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
          label: "打卡时距离标准点距离(米)",
          prop: "distance"
        },
        {
          label: "唯一ID",
          prop: "open_id"
        },
        {
          label: "当时任务开始时间",
          prop: "startTime"
        },
        {
          label: "持续时间(小时)",
          prop: "timeLongFormat"
        },
        {
          label: "标题",
          prop: "title"
        },
        {
          label: "规定距离(米)",
          prop: "workDistance"
        }
      ]
    }
  }

  changeCurrent = async (currentPage) => {
    console.log(currentPage, "----当前页数");
    this.cardListStore.page = currentPage;
    this.loading = true;
    await this.cardListStore.getList();
    this.loading = false;
  };

  render() {
    const {selectDate} = this.state;
    console.log(window.screen.availHeight)
    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <div className="rowBlock">
              <div className="select-date-view">
                <p className="date-title-view">选择数据日期:</p>
                <DatePicker
                  value={selectDate}
                  placeholder="选择日期"
                  onChange={async (dateSelect) => {
                    let date = moment(dateSelect).format("YYYY-MM-DD");
                    console.log('DatePicker1 changed: ', moment(dateSelect).format("YYYY-MM-DD"));
                    let year = date.split("-")[0];
                    let month = date.split("-")[1];
                    let day = date.split("-")[2];
                    this.cardListStore.year = Number(year);
                    this.cardListStore.month = Number(month);
                    this.cardListStore.day = Number(day);
                    this.cardListStore.page = 1;
                    this.loading = true;
                    await this.cardListStore.getList();
                    this.loading = false;
                    this.setState({selectDate: dateSelect});

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
            data={this.cardListStore.list.slice(0)}
            border={true}
            height={window.screen.availHeight * 0.6}
            highlightCurrentRow={true}
            onCurrentChange={item => {
              console.log(item)
            }}
          />
          <div className="bottom-block">
            <Pagination layout="prev, pager, next, jumper"
                        total={this.cardListStore.count}
                        pageSize={10}
                        currentPage={this.cardListStore.page}
                        onCurrentChange={(currentPage) => this.changeCurrent(currentPage)}/>
          </div>
        </Loading>
      </div>
    );
  }
}