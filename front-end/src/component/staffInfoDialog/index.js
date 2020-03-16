import React, { Component } from 'react'
import { Icon, Modal, Form, Input, Select, Button, message } from 'antd'
import { USER_STATUS, USER_TYPE, DEPT_TYPE } from '../../constant/data' 
import HttpUtil from '../../util/HttpUtil.js';
import ApiUtil from '../../util/ApiUtil.js';

const { Option } = Select;

class StaffInfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      staff:{},
      deleteConfirm: false
    }
  }

  componentDidUpdate(prevProps){
    // console.log('live this:', this.props.visible, this.props.staff);
    // console.log('live prev:', prevProps.visible, prevProps.staff);

    // 点击添加 及 跳出弹窗后修改 state
    if( this.state.visible === prevProps.visible  && prevProps.visible !== this.props.visible) {
      this.setState({
        visible: this.props.visible
      })
    }
    
    // 点击编辑
    if( this.props.staff && this.state.staff.id !== this.props.staff.id) {
      this.setState({
        visible: true,
        staff: this.props.staff,
        deleteConfirm: false
      })
    }
  }

  handleOk = e => {
    // console.log(e);
    // this.setState({
    //   visible: false,
    // });
    // ? form.vaildateFields
    this.props.form.validateFields((err, values) => {
      if(err) {
        message.error('表单数据有误，请根据提示填写！');
      } else {
        this.setState({
          confirmLoading: true,
        });
        console.log(values);
        HttpUtil.post(ApiUtil.API_STAFF_UPDATE, values)
        .then(
          re => {
            if (re.isExist){
              message.error(re.message);
            } else{
              message.success(re.message);
            }
          }
        ).catch(error => {
          message.error(error.message);
        })

        console.log('Received values of form: ', values);
        // ? why setTimeout
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          });
          this.props.onDialogConfirm(values);
        }, 1000);
      }
    })
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  // 点击删除 出现二次确认
  handleDelete = () => {
    if(!this.state.deleteConfirm) {
      this.setState({
        deleteConfirm: true
      });
    }else {
      this.setState({
        visible: false
      })
      
    }
    
    HttpUtil.get(ApiUtil.API_STAFF_DELETE + this.state.staff.no)
    .then(
      re => {
        message.success(re.message);
        this.setState({
          visible: false
        });
        // ? why undefine
        this.props.onDialogConfirm(undefined);
      }
    ).catch(error => {
      message.error(error.message);
    });

    // const re = '删除' + this.state.staff.name + '吗？ 请再点一次确认操作。'
    // message.info(re);
    // console.log(re); 
  }

  handleSubmit = (e) => {
    //通知 Web 浏览器不要执行与事件关联的默认动作
    e.preventDefault();
    console.log("handle submit");
  }

  render() {
    // console.log('Info render:', this.props.visible, this.props.staff);
    // confirmLoading 确定按钮 loading
    const { visible, confirmLoading, staff } = this.state;
    const { getFieldDecorator } = this.props.form;
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        title="编辑信息"
        visible={visible}
        width={400}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        afterClose={this.props.afterClose}
        okText="保存"
        cancelText="取消"
      > 
        <div>
          <Form {...layout} onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('no')(
                <Input type="hidden" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('passwd')(
                <Input type="hidden" />
              )}
            </Form.Item>
            <Form.Item label="工号">
              {getFieldDecorator('id', {
                rules: [{
                  required: true, 
                  pattern: new RegExp(/^[1-9]\d*$/, "g"),
                  message: '请输入正确的工号！'}],
                initialValue: ''
              })(
                <Input
                  placeholder=""
                  allowClear
                  prefix={<Icon type="idcard" style={{color: 'rgba(0,0,0,.25)'}}/>}
                />)}
            </Form.Item>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                rules: [{required: true, message: '请输入姓名！'}],
                initialValue: ''
              })(
                <Input
                  placeholder=""
                  allowClear
                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                />)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules:[{
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message:'邮箱格式不正确'
                }, {
                  max: 50,
                  message:'邮箱不可以超过50字符'
                }]
              })(
                <Input
                  placeholder=""
                  allowClear
                  prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                />)}
            </Form.Item>
            <Form.Item label="手机">
              {getFieldDecorator('phone', {
                rules: [{
                  required: true, 
                  max: 11,
                  pattern: /^1[3456789]\d{9}$/,
                  message: '请输入11位手机号！'}],
                  initialValue: ''
              })(
                <Input
                  placeholder=""
                  allowClear
                  prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                />)}
            </Form.Item>
            <Form.Item label="部门">
              {getFieldDecorator('department', {
                rules: [{required: true, message: '请选择部门！'}],
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {DEPT_TYPE.map((item) => 
                    <Option value={item} key={item.id + ''}>{item}</Option>
                  )}
                </Select>)}
            </Form.Item>
            <Form.Item label="职位">
              {getFieldDecorator('position', {
                rules: [{required: true, message: '请选择职位！'}],
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {USER_TYPE.map((item) => 
                    <Option value={item.name} key={item.id + ''}>{item.name}</Option>
                  )}
                </Select>)}
            </Form.Item>
            <Form.Item label="状态">
              {getFieldDecorator('status', {
                rules: [{required: true, message: '请选择状态！'}],
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {USER_STATUS.map((item) => 
                    <Option value={item.id} key={item.id + ''}>{item.name}</Option>
                  )}
                </Select>)}
            </Form.Item>

            {
              staff.no > 0 && <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Button
                  type="danger"
                  icon="delete"
                  onClick={this.handleDelete}
                  style={{ width: 300 }}>{this.state.deleteConfirm ? '删除' + this.state.staff.name + '吗？ 请再点一次确认操作。' : '删除'}</Button>
              </Form.Item>
            }

          </Form>
        </div>
      </Modal>  
    )
  }
}

const objToForm = (obj) => {
  let target = {}
  // Object.entries 返回其可枚举属性的键值对的对象
  for(let [key, value] of Object.entries(obj)) {
    // ? Form.createFormField
    target[key] = Form.createFormField({ value })
  }
  return target
}

const mForm = Form.create({
  name:'infoForm',
  mapPropsToFields(props) {
    // ? why not this.props.staff
    if(!props.staff) {
      return;
    }
    return objToForm(props.staff);
  }
})(StaffInfoDialog)

export default mForm;