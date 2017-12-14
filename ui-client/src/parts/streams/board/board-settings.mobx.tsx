import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'

import { List, Avatar, Icon } from 'antd';

import { Store } from 'src/store'


interface Props {
  store?: Store

}

interface State {

}


export class BoardSettings extends React.Component<Props, State> {

  render() {

    console.log('render board settings')
    return (
      <div style={{ height: '100%' }}>
        settings
      </div>
    )
  }

}
