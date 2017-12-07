import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import { Store } from 'src/store'

interface PropsState {
  store?: Store
}

interface PropsDispatch {
  dispatch?: Dispatch<any>
}

interface Props {

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
export class Board extends React.Component<PropsState & PropsDispatch & Props, State> {

  render() {

    console.warn(this.props.store)

    return (
      <div>
        board
      </div>
    )
  }

}
