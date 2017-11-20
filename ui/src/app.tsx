import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { createHashHistory, History, Location } from 'history'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';




import 'src/style/css-global'
import { history } from './history'
import { store } from './store'


import { asyncComponent, Box } from 'src/comps'
import { injectGlobal, ThemeProvider, THEME_STYLED_COMPONENTS } from 'src/styled-components'
import { ViewHome, ViewStreamBoard, ViewSettings, ViewStreamList, ViewFFmpegBoard } from 'src/views'

// import 'video.js/dist/video-js.min.css'
// require('videojs-contrib-media-sources'); // increase browser support with MSE polyfill
// require('videojs-contrib-hls.js'); // auto attaches hlsjs handler

declare var System: any
declare var NODE_ENV

// const Home = asyncComponent(() =>
//   System.import('./views/home').then(module => module.HomePage)
// )



declare var _VERSION_: string

interface IState {

}

const theme = createMuiTheme({
  palette: {
    type: 'light', // Switching the dark mode on is a single property value change.
  },
});

export class App extends React.Component<any, IState & any>{

  state = {
    index: 0,
    error: undefined
  }

  handleChange = (event, index) => {
    this.setState({ index });
  };

  handleChangeIndex = index => {
    this.setState({ index });
  };

  componentDidCatch(error, info) {
    this.setState({
      error: error
    })
  }

  //transition: 'width 0.1s ease-out', flex: '1 1 auto', width: '60%'
  render() {
    if (this.state.error) {
      return null
    }
    const { version, index, handleChangeIndex, classes } = this.props
    return (
      <Provider store={store}>
        {/* <ThemeProvider theme={THEME_STYLED_COMPONENTS} > */}
        <MuiThemeProvider theme={theme}>
          <Box height={1} width={0.9}>
            {NODE_ENV == 'development' && <DevTools />}
            <Router history={history}>
              <Switch>
                <Route exact path={`/`} render={() => <Redirect to={'/stream-board'} />} />
                <Route path={`/stream-board`} component={ViewStreamBoard} />
                <Route path={`/ffmpeg-board`} component={ViewFFmpegBoard} />
                <Route path={`/settings`} component={ViewSettings} />
                <Route path={`/stream-list`} component={ViewStreamList} />
                {/*  <SwipeableRoutes className={classes.root}> */}
                {/*    <Route exact path={`/`} render={() => <Redirect to={'/home'} />} />
                <Route exact path={`/settings`} render={() => <Redirect to={'/settings'} />} />
                <Route exact path={`/settings`} component={Settings} /> */}
                <Route render={() => <Redirect to={'/'} />} />
              </Switch>
            </Router>
          </Box>
        </MuiThemeProvider>
        {/* </ThemeProvider > */}
      </Provider>
    )
  }
}

// const Routes = withRouter(class extends React.Component<any, any>{

//   render() {
//     return (

//     )
//   }

// })
