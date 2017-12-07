import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import styled, { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


interface Props {

}

interface State {

}

@withRouter
export class AppHeader extends React.Component<Props, State> {

  render() {

    console.warn('render app header')
    return (
      <Header className="header"
        style={{ position: 'fixed', width: '100%', paddingLeft: 0 }}
      >
        <h4 style={{
          float: 'left',
          // width:'120px',
          // height: '32px',
          background: 'rgba(255,255,255,.2)',
          padding: '0 64px'
        }}>streaming-client</h4>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px', height: '64px' }}
        >
          <MenuItem key="streams">
            <NavLinkStyled to="/streams">streams</NavLinkStyled>
          </MenuItem>
          <MenuItem key="hls">
            <NavLinkStyled to="/hls">hls</NavLinkStyled>
          </MenuItem>
          <MenuItem key="mjpeg">
            <NavLinkStyled to="/mjpeg">mjpeg</NavLinkStyled>
          </MenuItem>
          <MenuItem key="settings">
            <NavLinkStyled to="/settings">settings</NavLinkStyled>
          </MenuItem>
        </Menu>
      </Header>
    )
  }

}

const MenuItem = styled(Menu.Item) `

  padding: 0;

`

export const NavLinkStyled = styled(NavLink).attrs({
  activeClassName: 'active'
}) `
  // cursor: pointer;
  // user-select: none;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // flex: 1 1 auto;
  // margin: 0.5em 1em;
  // font-size: 1.2em;
  // color: white;
  // background-color: #8E9295;
  // fontSize: 1em;
  width: 100%;
  padding: 0 20px;
  // &:hover {
  //   background-color: #337AB8;
  //   color: #fff;
  // }
  &.active {
    background-color: #1890ff;
    color: #fff;
  }
`;
