import React, {Component} from 'react'
import StaffList from './app/staffList'
import { Layout, Menu, Icon, Avatar } from 'antd'
import myIcon from './image/orca.jpg'
import { MENU_MAIN } from './constant/data'

import 'antd/dist/antd.css'

const { Content, Sider, Footer } = Layout

class App extends Component{
  state = {
    collapsed: false,
    currentPage: '1',
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    let pageView;
    if (this.state.currentPage === "1") {
      pageView = <StaffList />
    }

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
            defaultSelectedKeys={[this.state.currentPage]} 
            onSelect={({key}) => this.setState({currentPage:key})}
          >
            <div className="logo" style={{height:100,backgroundColor:"#002140", textAlign: 'center'}}>
              <Avatar src={myIcon} alt='' style={{width:60, height:60, marginTop:20}}/>
            </div>
            <Menu.Item key="1">
              <Icon type={MENU_MAIN[0].icon} />
              <span>{MENU_MAIN[0].title}</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type={MENU_MAIN[1].icon} />
              <span>{MENU_MAIN[1].title}</span>
            </Menu.Item>
          </Menu>
        </Sider> 
        <Layout>
          <Content style={{ margin: '12px 12px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {pageView}
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

export default App;
