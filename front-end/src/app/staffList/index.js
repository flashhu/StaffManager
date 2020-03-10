import React, { Component, Fragment } from 'react'
import { Table, Button, Tag, Icon, Select, Input, message  } from 'antd'
import StaffInfoDialog from '../staffInfoDialog'
import { USER_STATUS, DEPT_TYPE } from '../../constant/data' 
import HttpUtil from '../../util/HttpUtil.js';
import ApiUtil from '../../util/ApiUtil.js';

const { Option } = Select;

class StaffList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfoBox: false,
      userlist:[],
      editItem: null,
      loading: true
    }
  }

  //用于搜索，存放所有用户列表
  allData = []
  //用于搜索，存放搜索关键词
  searchItems = {}

  showInfoDialog = (item) => {
    if (item === undefined) {
      item = null;
    }

    this.setState({
      showInfoBox: true,
      editItem: item
    })
    // console.log('click btn:', this.state.showInfoBox, this.state.editItem);
  }

  columns = [{
    title: '工号',
    dataIndex: 'id',
    key: 'id',
    width: '100px'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key:"name",
    width:'100px'
  }, {
    title: '邮箱',
    dataIndex: 'email',
    key:"email",
    width:'150px'
  }, {
    title: '联系方式',
    dataIndex: 'phone',
    key:"phone",
    width:'100px'
  }, {
    title: '部门',
    dataIndex: 'department',
    key:"department",
    width:'100px'
  }, {
    title: '职位',
    dataIndex: 'position',
    key:"position",
    width:'100px',
  }, {
    title: '状态',
    dataIndex: 'status',
    key:"status",
    width:'100px',
    render: d => <span>
                   <Tag color={USER_STATUS[d-1].color}>{USER_STATUS[d-1].name}</Tag>
                 </span>
  }, {
    title: '编辑',
    key: 'action',
    width: '80px',
    align: 'center',
    render: (staff) => (
      <span>
        <Icon type="edit" id="btn" title="编辑" onClick={() => this.showInfoDialog(staff)} style={{ padding: 8 }} />
      </span>
    )
  }];

  getData() {
    HttpUtil.get(ApiUtil.API_STAFF_LIST)
    .then(
      staffList => {
        this.allData = staffList;
        this.setState({
          showInfoBox: false,
          userlist: staffList,
          loading: false
        })
      }
    ).catch(error => {
      message.error(error.message);
      this.setState({
        loading: false
      })
    })
  }
  
  componentDidMount() {
    this.getData();
  }

  handleInfoDialogClose = (staff) => {
    if(staff && staff.no) {
      //修改信息
      let data = [...this.state.userlist];
      for(let i = 0; i< data.length; i ++) {
        if(data[i].id === staff.id) {
          data[i] = staff;
          this.setState({
            userlist: data,
            showInfoBox: false
          });
          break;
        }
      } 
    } else {
      // 新增或删除信息
      this.getData();
      // console.log('add or delete');
    }
  }

  handleFilterChange = (value) => {
    if (typeof(value) === "string") { //部门
      this.searchItems['department'] = value;
    }
    if (typeof(value) === "number") { //就职状态
      this.searchItems['status'] = value;
    }
    this.handleSearch();
  }

  handleTextChange = (e) => {
    let attr = e.target.getAttribute('item');
    if (attr) {
      this.searchItems[attr] = e.target.value;
    }
    // console.log(this.searchItems);
  }

  handleSearch = () => {
    let search = JSON.stringify(this.searchItems);
    let url = ApiUtil.API_STAFF_SEARCH + "?search=" + encodeURI(search);
    this.setState({loading: true});
    HttpUtil.get(url)
    .then(
      staffList => {
        this.allData = staffList;
        this.setState({
          userlist: staffList,
          loading: false
        })
      }
    ).catch(error => {
      message.error(error.message);
    })
  }

  render() {
    // console.log('list render:', this.state.showInfoBox, this.state.editItem);
    const { showInfoBox, editItem, userlist } = this.state;
    const seachBar = {width:160, marginTop:10, marginRight:5};

    return (
      <Fragment>
        <div>
          <Select defaultValue="所有部门" style={seachBar} onChange={this.handleFilterChange}>
            <Option value="all" key="all ">所有部门</Option>
            {DEPT_TYPE.map((item) => 
              <Option value={item} key={item.id + ''}>{item}</Option>
            )}
          </Select>
          <Select defaultValue="所有状态" style={seachBar} onChange={this.handleFilterChange}>
            <Option value={0} key="all ">所有状态</Option>
            {USER_STATUS.map((item) => 
              <Option value={item.id} key={item.id + ''}>{item.name}</Option>
            )}
          </Select>
          <Input
            placeholder="工号"
            item="id"
            allowClear
            prefix={<Icon type="idcard" style={{color: 'rgba(0,0,0,.25)'}}/>}
            style={seachBar}
            onChange={this.handleTextChange}
          />
          <Input
            placeholder="姓名"
            item="name"
            allowClear
            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
            style={seachBar}
            onChange={this.handleTextChange}
          />
          <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
          <Button 
            type="primary" 
            icon="plus" 
            style={{float:'right', marginTop:10}}
            onClick={() => this.showInfoDialog()}
          >
            添加
          </Button>
        </div>

        <Table 
          dataSource={userlist} 
          columns={this.columns} 
          rowKey={item => item.id}
          pagination={{ pageSize: 7 }}
          style={{clear:'both', marginTop:10}}
        />

        <StaffInfoDialog
          visible={showInfoBox}
          staff={editItem}
          afterClose={() => this.setState({ showInfoBox: false })}
          onDialogConfirm={this.handleInfoDialogClose}
        />

      </Fragment>    
    )
  }
}

export default StaffList;