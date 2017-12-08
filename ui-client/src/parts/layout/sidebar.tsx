import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import { Store } from 'src/store'
import { NavLinkStyled } from 'src/comps'

export interface Props {
  onCollapse?(collapsed): any
  collapsed?: boolean
}

interface State {

}


// @(connect<PropsState, PropsDispatch, Props, Store>(
//   (state) => ({
//     store: state
//   }), (dispatch) => ({
//     dispatch: dispatch
//   })
// ) as any)
@withRouter
export class Sidebar extends React.Component<Props, State> {

  onCollapse = (collapsed) => {
    this.props.onCollapse(collapsed)
  }

  render() {
    const { collapsed } = this.props
    return (

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
        style={{ overflow: 'auto',/*  position: 'fixed',  */left: 0 }}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[]} selectedKeys={[]}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="bar-chart" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="cloud-o" />
              <span className="nav-text">nav 5</span>
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="appstore-o" />
              <span className="nav-text">nav 6</span>
            </Menu.Item>
            <Menu.Item key="7">
              <Icon type="team" />
              <span className="nav-text">nav 7</span>
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="shop" />
              <span className="nav-text">nav 8</span>
            </Menu.Item>
          </Menu>


        </Menu>
        {/* <Menu theme="dark" defaultSelectedKeys={['streams/board']} mode="inline">
          <Menu.Item key="table">
            <Icon type="table" />
            <span>table</span>
          </Menu.Item>
          <SubMenu
            key="streams"
            title={<span><Icon type="desktop" /><span>streams</span></span>}
          >
            <Menu.Item key="streams/board">board</Menu.Item>
            <Menu.Item key="streams/hls">hls</Menu.Item>
            <Menu.Item key="streams/mjpeg">mjpeg</Menu.Item>
          </SubMenu>
          <Menu.Item key="settings">
            <Icon type="setting" />
            <span>settings</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={<span><Icon type="user" /><span>User</span></span>}
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={<span><Icon type="team" /><span>Team</span></span>}
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu> */}
      </Sider>
    )
  }

}
   /* <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="3">option3</Menu.Item>
            <Menu.Item key="4">option4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
            <Menu.Item key="9">option9</Menu.Item>
            <Menu.Item key="10">option10</Menu.Item>
            <Menu.Item key="11">option11</Menu.Item>
            <Menu.Item key="12">option12</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider> */


    //   <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
    //   <Menu.Item key="1">
    //     <Icon type="user" />
    //     <span className="nav-text">nav 1</span>
    //   </Menu.Item>
    //   <Menu.Item key="2">
    //     <Icon type="video-camera" />
    //     <span className="nav-text">nav 2</span>
    //   </Menu.Item>
    //   <Menu.Item key="3">
    //     <Icon type="upload" />
    //     <span className="nav-text">nav 3</span>
    //   </Menu.Item>
    //   <Menu.Item key="4">
    //     <Icon type="bar-chart" />
    //     <span className="nav-text">nav 4</span>
    //   </Menu.Item>
    //   <Menu.Item key="5">
    //     <Icon type="cloud-o" />
    //     <span className="nav-text">nav 5</span>
    //   </Menu.Item>
    //   <Menu.Item key="6">
    //     <Icon type="appstore-o" />
    //     <span className="nav-text">nav 6</span>
    //   </Menu.Item>
    //   <Menu.Item key="7">
    //     <Icon type="team" />
    //     <span className="nav-text">nav 7</span>
    //   </Menu.Item>
    //   <Menu.Item key="8">
    //     <Icon type="shop" />
    //     <span className="nav-text">nav 8</span>
    //   </Menu.Item>
    // </Menu>


