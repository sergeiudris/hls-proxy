import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import styled, { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { MenuItem, NavLinkStyled } from 'src/comps'

interface Props {

}

interface State {

}

@withRouter
export class AppHeader extends React.Component<Props, State> {

  render() {

    console.log('render header')
    return (
      <Header className="header"
        style={{ position: 'fixed', width: '100%', paddingLeft: 0 }}
      >
        <h3 style={{
          float: 'left',
          // width:'120px',
          // height: '32px',
          textAlign: 'center',
          background: 'rgba(255,255,255,.2)',
          // padding: '0 64px'
          width: '200px'
        }}>streaming-client</h3>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[]}
          selectedKeys={[]}
          style={{ lineHeight: '64px', height: '64px' }}
        >
          <MenuItem key="streams">
            <NavLinkStyledPadding to="/streams">streams</NavLinkStyledPadding>
          </MenuItem>
          {/* <SubMenu
            key="/streams"
            title={
              <NavLinkStyled to="/streams">streams</NavLinkStyled>
            }
          >
            <MenuItem key="/streams/board">
              <NavLinkStyled to="/streams/board">board</NavLinkStyled>
            </MenuItem>
            <MenuItem key="/streams/hls">
              <NavLinkStyled to="/streams/hls">hls</NavLinkStyled>
            </MenuItem>
            <MenuItem key="/streams/mjpeg">
              <NavLinkStyled to="/streams/mjpeg">mjpeg</NavLinkStyled>
            </MenuItem>
          </SubMenu> */}
          {/* <MenuItem key="table">
            <NavLinkStyled to="/table">table</NavLinkStyled>
          </MenuItem> */}
          <MenuItem key="settings">
            <NavLinkStyledPadding to="/settings">settings</NavLinkStyledPadding>
          </MenuItem>
        </Menu>
      </Header>
    )
  }

}


export const NavLinkStyledPadding = NavLinkStyled.extend`

  padding: 0 20px;

`


// <Menu theme="dark" defaultSelectedKeys={['streams/board']} mode="inline">
// <Menu.Item key="table">
//   <Icon type="table" />
//   <span>table</span>
// </Menu.Item>
// <SubMenu
//   key="streams"
//   title={<span><Icon type="desktop" /><span>streams</span></span>}
// >
//   <Menu.Item key="streams/board">board</Menu.Item>
//   <Menu.Item key="streams/hls">hls</Menu.Item>
//   <Menu.Item key="streams/mjpeg">mjpeg</Menu.Item>
// </SubMenu>
// <Menu.Item key="settings">
//   <Icon type="setting" />
//   <span>settings</span>
// </Menu.Item>
