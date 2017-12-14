import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'


import { List, Avatar, Icon, Collapse, Layout } from 'antd';
const { Header, Content, Sider } = Layout;
const { Panel } = Collapse

import { HlsStreamState } from 'src/types'
import { asyncComponent } from 'src/modules/async-component'

import { Sidebar } from './sidebar'
import { Board } from './board'

export interface Props {
  streams: Map<string, HlsStreamState>
}

interface State {

}
declare var System: any




const BoardView = asyncComponent(() =>
  System.import('src/parts/streams/board').then(module => module.Board)
)

const SettingsView = asyncComponent(() =>
  System.import('src/parts/streams/settings').then(module => module.Settings)
)
const TableView = asyncComponent(() =>
  System.import('src/parts/streams/table').then(module => module.Table)
)

@withRouter
export class Streams extends React.Component<Props, State> {

  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Sidebar />
        <Switch>
          <Route exact path={`/streams`} render={() => <Redirect to={'/streams/board'} />} />
          <Route path={'/streams/board'} component={BoardView} />
          <Route path={'/streams/settings'} component={SettingsView} />
          <Route path={'/streams/table'} component={TableView} />
        </Switch>
      </Layout>

    )
  }

}

