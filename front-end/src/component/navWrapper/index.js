import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Icon, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import myIcon from '../../image/orca.jpg'
import { MENU_MAIN } from '../../constant/data'

import 'antd/dist/antd.css'

const { Content, Sider, Footer } = Layout

class NavWrapper extends Component{
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {

    return (
      <Layout style={{ minHeight: '100vh'}}>
        <Sider
          width={152}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu 
            theme="dark"  
            mode="inline"
            defaultSelectedKeys={['0']} 
          >
            <div style={{height:100,backgroundColor:"#002140", textAlign: 'center'}}>
              <Avatar src={myIcon} alt='' style={{width:60, height:60, marginTop:20}}/>
            </div>
            <div style={{ height: 30, backgroundColor: "#002140", textAlign: 'center'}}>
              <Link to='/login' style={{ color: '#fff', marginRight:10 }}>登录</Link>
              <Link to='/register' style={{ color: '#fff' }}>注册</Link>
            </div>
            {MENU_MAIN.map((item,j)=>
              <Menu.Item key={j}>
                <NavLink to={item.path}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </NavLink> 
              </Menu.Item>           
            )}
          </Menu>
        </Sider> 
        <Layout>
          <Content style={{ margin: '12px 12px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center'}}>
            ©2020 Created by flashhu
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default NavWrapper;
