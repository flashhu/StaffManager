import React, { Component } from 'react'
import { Form, Input, Button, Select, message } from 'antd'
import { Redirect } from 'react-router-dom'
import { USER_TYPE, DEPT_TYPE } from '../../constant/data' 
import HttpUtil from '../../util/HttpUtil';
import ApiUtil from '../../util/ApiUtil';
import './index.less'

const { Option } = Select;

class Register extends Component{
  constructor(props) {
    super(props)
    this.state = {
      isRegister: false
    }
  }

  doRegister = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('输入有误，请重新根据提示填写！');
      } else {
        // console.log('registerInput', values);
        HttpUtil.post(ApiUtil.API_USER_REGISTER, values)
          .then(
            re => {
              console.log(re);
              if (re.isRegister) {
                message.success(re.message);
                this.setState({
                  isRegister: true
                })
              }else {
                message.error(re.message);
              }
            }
          ).catch(error => {
            message.error(error.message);
            // console.log(error.message);
          })
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className="g-register">
        {this.state.isRegister && <Redirect to='/login' />}
        <div className="m-box">
          <div className="m-title">信息管理系统</div>
          <div className="m-register">
            <Form {...layout}>
              <Form.Item label="工号">
                {getFieldDecorator('id', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                    message: '请输入工号！'
                  }],
                  initialValue: ''
                })(
                  <Input allowClear />
                )}
              </Form.Item>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入姓名！' }],
                  initialValue: ''
                })(
                  <Input allowClear />
                )}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('passwd', {
                  rules: [{
                    required: true,
                    message: '请输入密码！'
                  }]
                })(
                  <Input.Password allowClear />
                )}
              </Form.Item>
              <Form.Item label="确认密码">
                {getFieldDecorator('re_passwd', {
                  rules: [{ 
                    required: true, 
                    message: '请输入确认密码！' },
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback()//如果还没填写，则不进行一致性验证
                        }
                        if (value === getFieldValue('passwd')) {
                          callback()
                        } else {
                          callback('两次密码不一致')
                        }
                      }
                    }
                  ]
                })(
                  <Input.Password />
                )}
              </Form.Item>
              <Form.Item label="手机">
                {getFieldDecorator('phone', {
                  rules: [{
                    required: true,
                    max: 11,
                    pattern: /^1[3456789]\d{9}$/,
                    message: '请输入11位手机号！'
                  }],
                  initialValue: ''
                })(
                  <Input allowClear />
                )}
              </Form.Item>
              <Form.Item label="部门">
                {getFieldDecorator('department', {
                  rules: [{ required: true, message: '请选择部门！' }],
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
                  rules: [{ required: true, message: '请选择职位！' }],
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    {USER_TYPE.map((item) =>
                      <Option value={item.name} key={item.id + ''}>{item.name}</Option>
                    )}
                  </Select>)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" block onClick={this.doRegister} className="u-btn">
                    注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(Register);