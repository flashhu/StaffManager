import React, { Component, Fragment } from 'react'
import { Table, Button, Tag, Icon, message  } from 'antd'
import StaffInfoDialog from '../staffInfoDialog'
import { USER_STATUS, USER_TYPE } from '../../constant/data' 
import HttpUtil from '../../util/HttpUtil.js';
import ApiUtil from '../../util/ApiUtil.js';

class StaffList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfoBox: false,
      userlist:[{
        no: 1,
        id: "202001",  
        name: '张三', 
        email: '12726597@gmail.com', 
        phone:'13245769870', 
        department:'销售部', 
        position: 2, 
        status:1
      }, { 
        no: 2,
        id: "202002",
        name: '李四', 
        email: '127262234247@gmail.com', 
        phone:'13987653456', 
        department:'人事部', 
        position: 0, 
        status:2
      }],
      editItem: null,
      loading: true
    }
  }

  //用于搜索，存放所有用户列表
  allData = []

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
    render: d => <span className="m-status">
                   <Tag color={USER_TYPE[d].color}>{USER_TYPE[d].name}</Tag>
                 </span>
  }, {
    title: '状态',
    dataIndex: 'status',
    key:"status",
    width:'100px',
    render: d => <span>
                   <Tag color={USER_STATUS[d].color}>{USER_STATUS[d].name}</Tag>
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

  handleInfoDialogClose = (staff) => {
    if(staff && staff.id) {
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
    }
  }

  render() {
    // console.log('list render:', this.state.showInfoBox, this.state.editItem);
    const { showInfoBox, editItem, userlist } = this.state;

    return (
      <Fragment>
        <div>
          <Button 
            type="primary" 
            icon="plus" 
            style={{float:'right', margin: 10}}
            onClick={() => this.showInfoDialog()}
          >
            添加
          </Button>
        </div>

        <Table 
          dataSource={userlist} 
          columns={this.columns} 
          rowKey={item => item.id}
          pagination={{ pageSize: 10 }}
          style={{clear:'both'}}
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