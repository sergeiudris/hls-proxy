import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { createHashHistory, History, Location } from 'history'
import { LocaleProvider, notification } from 'antd'
import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'
// import { Provider } from 'react-redux'
import { Provider } from 'mobx-react'


import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

// import { TableView, ChartView , CompanyView, BuildingView} from 'src/views'
// import { AppFooter,AppHeader,AppNav,AppContent } from 'src/parts/layout'
// import { Box } from 'src/modules/grid'
// import { Sidebar } from 'src/parts/sidebar'
// import { Wizard } from 'src/parts/wizard'


import { asyncComponent } from 'src/modules/async-component'
import { AppHeader, Sidebar } from './views/layout'


import { history } from './history'
import { store } from './store'
import * as hlsStore from 'src/redux/modules/hls'
import * as appStore from 'src/redux/modules/app'


declare var System: any
declare var NODE_ENV


const HlsView = asyncComponent(() =>
  System.import('src/views/hls').then(module => module.Hls)
)


const MjpegView = asyncComponent(() =>
  System.import('src/views/mjpeg').then(module => module.Mjpeg)
)


const SettingsView = asyncComponent(() =>
  System.import('src/views/settings').then(module => module.Settings)
)

const StreamsView = asyncComponent(() =>
  System.import('src/views/streams').then(module => module.Streams)
)

export class App extends React.Component<any, any>{

  // componentDidMount() {
  //   store.dispatch(hlsStore.socketOpen())
  //   store.dispatch(appStore.fetchDatasets())
  // }
  // componentWillUnmount() {
  //   store.dispatch(hlsStore.socketClose())
  // }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Layout style={{padding: '0', marginTop: 64 }}>
              <Sidebar />
              <Layout style={{ padding: '0px 24px 24px' }}>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>not</Breadcrumb.Item>
                  <Breadcrumb.Item>yet</Breadcrumb.Item>
                  <Breadcrumb.Item>implemented</Breadcrumb.Item>
                </Breadcrumb> */}
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                  <Switch>
                    <Route exact path={`/`} render={() => <Redirect to={'/streams'} />} />
                    <Route path={`/streams`} component={StreamsView} />
                    <Route path={'/hls'} component={HlsView} />
                    <Route path={`/mjpeg`} component={MjpegView} />
                    <Route path={`/settings`} component={SettingsView} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      </Provider >
    )
  }
}

injectGlobal`
      html {
        /* height: 100%; */
        box-sizing: border-box;
        // font-size: 10px !important;
        // line-height: 0.8em;
      }

      *, *:before, *:after {
          box-sizing: inherit;
      }

      body {
          margin:0;
        padding: 0;
        /* height: 100%; */
      }
      body > div:first-child {
          display: flex;
        /* height: 100%; */
      }

`
