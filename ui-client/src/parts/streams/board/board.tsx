import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'

import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'

import { BoardSettings } from './board-settings'

import { List, Avatar, Icon, Collapse, Layout } from 'antd';
const { Header, Content, Sider } = Layout;
const { Panel } = Collapse

import { HlsStreamState } from 'src/types'


export interface Props {
  streams: Map<string, HlsStreamState>
}

interface State {

}


// const listData = [];
// for (let i = 0; i < 15; i++) {
//   listData.push({
//     href: 'http://ant.design',
//     title: `ant design part ${i}`,
//     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
//     description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//     content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//   });
// }

export class Board extends React.Component<Props, State> {

  render() {
    console.log('render board', this.props.streams.size)

    const { streams } = this.props

    const data = Array.from(streams.values())
    const listData = [];
    for (let i = 0; i < 50; i++) {
      listData.push({
        href: 'http://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      });
    }

    const pagination = {
      pageSize: 10,
      current: 1,
      total: listData.length,
      onChange: ((page, pageSize) => {
        console.warn(page, pageSize)
      }),
    };
    return (
      <Content style={{ background: '#fff', height: '100%', padding: '24px' }}>
        <div style={{ height: '20%', overflow: 'auto' }}>
          <BoardSettings />
        </div>
        <div style={{ height: '80%', overflow: 'auto' }}>
          <List
            itemLayout="horizontal"
            size="small"
            pagination={{ pageSizeOptions: ['10', '25', '50', '100', '200'], showSizeChanger: true, pageSize: 10 }}
            dataSource={data}
            renderItem={(item: HlsStreamState) => (
              <List.Item key={item.cam.title}
                actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
                extra={''}>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.cam.title}</a>}
                  description={item.cam.version.object.cam_url || 'undefined'}
                />
                <div>{item.cam.version.object.address}</div>
              </List.Item>
            )}
          />
        </div>
      </Content>
    )
  }

}

{/* <List
itemLayout="horizontal"
size="small"
pagination={{pageSizeOptions: ['10', '25', '50', '100','200'],    showSizeChanger: true,  pageSize: 10}}
dataSource={data}
renderItem={(item: HlsStreamState) => (
  <List.Item  key={item.cam.title}
  actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
  extra={''}>
    <List.Item.Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title={<a href="https://ant.design">{item.cam.title}</a>}
      description={item.cam.version.object.cam_url || 'undefined'}
    />
    <div>{item.cam.version.object.address}</div>
  </List.Item>
)}
/> */}

{/* <List.Item
key={item.cam.title}
actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
>
<List.Item.Meta
  title={item.cam.title}
  description={String(item.cam.version.object.cam_url)}
/>
{item.cam.version.object.address}
</List.Item> */}
// avatar={<Avatar src={item.avatar} />}

const IconText: React.StatelessComponent<any> = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
