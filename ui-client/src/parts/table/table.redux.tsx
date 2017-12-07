// import * as React from 'react';
// import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
// import { LocaleProvider, notification } from 'antd'
// import { connect, Dispatch } from 'react-redux'

// import { Layout, Menu, Breadcrumb, Icon, Table, Button, Input, Row, Col } from 'antd';
// const { SubMenu } = Menu;
// const { Header, Content, Sider } = Layout;
// import { Store } from 'src/store'
// import { HlsPlayer } from 'src/modules/hls-player'
// import * as hslStore from 'src/store/modules/hls'
// import { Cams } from '@streaming/types'

// import { Streams as StreamsComp } from './streams'

// interface PropsState {
//   store?: Store
// }

// interface PropsDispatch {
//   dispatch?: Dispatch<any>
// }

// interface Props {

// }

// interface State {
//   filterDropdownVisible: boolean,
//   data: Cams.CameraInfo[]
//   searchText: string
//   filtered: boolean
//   selectedRowKeys: string[]
// }


// export const Streams = connect<PropsState, PropsDispatch>(
//   (state) => ({
//     store: state
//   }), (dispatch) => ({
//     dispatch: dispatch
//   })
// )(StreamsComp)

