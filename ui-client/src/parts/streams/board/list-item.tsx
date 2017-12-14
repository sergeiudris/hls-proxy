import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { observer } from 'mobx-react'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'


import { List, Avatar, Icon, Collapse, Layout, Tag } from 'antd';
const { Header, Content, Sider } = Layout;
const { Panel } = Collapse

import { HlsStreamState } from 'src/types'


export interface Props {
  stream: HlsStreamState
  onAddToWall?(id: string)
  onSubtractFromWall?(id: string)
  onStart?(id: string)
  onTerminate?(id: string)
}

interface State {

}

export class ListItem extends React.Component<Props, State> {


  onAddToWall = () => {
    this.props.onAddToWall(this.props.stream.id)
  }

  onSubtractFromWall = () => {
    this.props.onSubtractFromWall(this.props.stream.id)
  }

  onStart = () => {
    this.props.onStart(this.props.stream.id)
  }

  onTerminate = () => {
    this.props.onTerminate(this.props.stream.id)
  }

  render() {
    const { stream, onAddToWall, onSubtractFromWall } = this.props
    return (
      <List.Item key={stream.cam.title}
        actions={[
          <span>
            <Icon type="minus-circle-o" style={{ marginRight: 8 }} onClick={this.onSubtractFromWall} />
            <Icon type="plus-circle-o" style={{ marginRight: 8 }} onClick={this.onAddToWall} />
            {stream.wallCount}
          </span>,
          // <Tag color="#87d068">start</Tag>,
          <Tag color="#2db7f5" ><div onClick={this.onStart}>start</div></Tag>,
          <Tag color="#f50"><div onClick={this.onTerminate}>terminate</div></Tag>,
        ]}
        extra={''}>
        <List.Item.Meta
          title={stream.cam.title}
          description={
            <div>
              <div>{stream.cam.version.object.cam_url || 'undefined'}</div>
              <div>{stream.cam.version.object.address}</div>
              <div>{stream.state.ffmpeg.url_hls || 'undefined'}</div>
            </div>}
        />
        &nbsp;
        <div>{stream.state.readyState}</div>
      </List.Item>
    )
  }

}
