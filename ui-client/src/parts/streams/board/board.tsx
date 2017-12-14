import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'
import { ReadyState } from '@streaming/types'


import { List, Avatar, Icon, Collapse, Layout } from 'antd';
const { Header, Content, Sider } = Layout;
const { Panel } = Collapse

import { HlsStreamState } from 'src/types'
import { HlsPlayer } from 'src/modules/hls-player'

import { ListItem } from './list-item.mobx'


export interface Props {
  streams: Map<string, HlsStreamState>
  streamsSelected: Map<string, number>
}

interface State {

}

export class Board extends React.Component<Props, State> {

  render() {
    const { streams, streamsSelected } = this.props
    const data = Array.from(streams.values())

    const selected = Array.from(streamsSelected.keys())
      .map(key => {
        const count = streamsSelected.get(key)
        const arr = new Array<HlsStreamState>(count)
        arr.fill(streams.get(key))
        return arr
      })
      .reduce((p, c) => {
        p = p.concat(c)
        return p
      }, [])
      .filter(x => !!x)



    // data.sort((a, b) => {
    //   if (b.wallCount) return 1
    //   if (a.wallCount) return -1
    //   return 0
    // })

    data.sort((a, b) => {
      if (b.state.readyState != ReadyState.UNSET) return 1
      if (a.state.readyState != ReadyState.UNSET) return -1
      return 0
    })

    return (
      <Content style={{ background: '#fff', height: '100%', padding: '24px' }}>
        <div style={{ height: '50%', overflow: 'auto' }}>
          <List
            grid={{ gutter: 8, xs: 1, sm: 2, md: 4, lg: 4, xl: 6 }}
            dataSource={selected}
            renderItem={(stream: HlsStreamState, i) => {
              return (
                <List.Item key={`${stream.id}_${i}`} extra={''}>
                  <HlsPlayer streamState={stream.state} streamInfo={stream.cam} />
                </List.Item>
              )
            }}
          />
        </div>
        <div style={{ height: '50%', overflow: 'auto' }}>
          <List
            itemLayout="horizontal"
            size="small"
            dataSource={data}
            renderItem={(item: HlsStreamState) => (
              <ListItem key={item.cam.title} stream={item} />
            )}
          />
        </div>
      </Content>
    )
  }

}
