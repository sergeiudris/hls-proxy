import * as React from 'react';
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { LocaleProvider, notification } from 'antd'
import { connect, Dispatch } from 'react-redux'
import { injectGlobal, ThemeProvider, THEME, withTheme } from 'src/modules/styled-components'
import { Layout, Menu, Breadcrumb, Icon, Table, Button, Input, Row, Col } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import { HlsPlayer } from 'src/modules/hls-player'
import { Cams } from '@streaming/types'
import { HlsStreamState } from 'src/types'


export interface Props {
  datasets: Cams.Dataset[]
  datasetsInfo: Cams.DatasetInfo[]
  streams: Map<string, HlsStreamState>
  // onSelectChange(selectedRowKeys): any
  onTerminate(cam: Cams.CameraInfo): any
  onRemove(cam: Cams.CameraInfo): any
  onAdd(cam: Cams.CameraInfo): any
}

interface State {
  filterDropdownVisible: boolean,
  searchText: string
  filtered: boolean
  selectedRowKeys: string[]
}


export class TableView extends React.Component<Props, State> {

  searchInput: Input

  get data() {
    const { datasets, datasetsInfo } = this.props

    const data = datasets.reduce<Cams.CameraInfo[]>((p, c) => {
      return p.concat(c.items)
    }, [])
    return data
  }

  state = {
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    selectedRowKeys: []
  };
  onInputChange = (e) => {
    this.setState({ searchText: e.target.value }, () => {
      this.onSearch()

    })
  }

  // componentDidMount() {
  //   this.setState({
  //     data: this.data.slice()
  //   })
  // }
  // componentWillReceiveProps() {
  //   this.setState({
  //     data: this.data.slice()
  //   })
  // }
  onSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    // this.setState({
    //   // filterDropdownVisible: false,
    //   filtered: !!searchText,
    //   data: this.data.filter((cam) => {
    //     return (
    //       cam.title.includes(searchText)
    //     )
    //   })
    // });
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  onTerminate = (cam: Cams.CameraInfo) => {
    this.props.onTerminate(cam)
  }

  onRemove = (cam: Cams.CameraInfo) => {
    this.props.onRemove(cam)
  }

  onAdd = (cam: Cams.CameraInfo) => {
    this.props.onAdd(cam)
  }

  render() {
    console.log('render table')
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
      }),
    };
    const { selectedRowKeys } = this.state
    const { datasets, datasetsInfo, streams } = this.props
    const hasSelected = selectedRowKeys.length > 0;
    const data = Array.from(streams.values())


    const columns = [
      {
        title: 'title', dataIndex: 'cam.title', key: 'title', width: 250,
        sorter: (a, b) => {
          if (a.title < b.title) return -1
          if (a.title > b.title) return 1
          return 0
        },
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="Search name"
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            {/* <Button type="primary" onClick={this.onSearch}>Search</Button> */}
          </div>
        ),
        filterIcon: <Icon type="filter" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisible: visible,
          }, () => this.searchInput && this.searchInput.focus());
        },
      },
      {
        title: 'url', dataIndex: 'cam.version.object.cam_url', key: 'url', width: 200,
        sorter: (a: HlsStreamState, b: HlsStreamState) => {
          if (!b.cam.version.object.cam_url) return -1
          if (!a.cam.version.object.cam_url) return -1
          if (a.cam.version.object.cam_url < b.cam.version.object.cam_url) return -1
          if (a.cam.version.object.cam_url > b.cam.version.object.cam_url) return 1
          return 0
        },
      },
      // {
      //   title: 'action', dataIndex: 'action', key: 'action', width: 250,
      //   render: (text, record: Cams.CameraInfo) => {
      //     return (
      //       <div >
      //         <Button type="primary" onClick={() => this.onAdd(record)} size={'small'}>add</Button>
      //         &nbsp;
      //         <Button onClick={() => this.onRemove(record)} size={'small'}>remove</Button>
      //         &nbsp;
      //         <Button type="danger" onClick={() => this.onTerminate(record)} size={'small'}>terminate</Button>
      //       </div>
      //     );
      //   },
      // },
      { title: 'address', dataIndex: 'cam.version.object.address', key: 'address', width: 200, },
      {
        title: 'type', dataIndex: 'cam.version.object.type', key: 'type', width: 100,
        filters: datasetsInfo.map(d => ({
          text: d.title,
          value: String(d.type)
        })),
        onFilter: (value, record: HlsStreamState) => {
          // console.warn(record,value)
          return record.cam.version.object.type == value
        }
      },
      { title: 'id', dataIndex: 'cam.id', key: 'id', width: 100, },

      // { title: 'Action', dataIndex: '', key: 'x', render: () => <a href="#">Delete</a> },
    ];

    return (
      <Content style={{ background: '#fff', height: '100%', padding: '24px' }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table
          bordered
          size={'small'}
          pagination={{ pageSizeOptions: ['10', '25', '50', '100', '200'], showSizeChanger: true, pageSize: 200 }} scroll={{ y: '60vh' }}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={data}
        />
        <Row gutter={16}>
          {
            // Array.from(streams.values()).map((stream) => {
            //   const streamInfo = this.data.find(x => x.version.object.cam_url == stream.id)
            //   return <HlsPlayer
            //     key={stream.id || streamInfo.id}
            //     streamInfo={streamInfo}
            //     streamState={stream}
            //   />
            // })
          }
          {/* <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col>
          <Col span={4} ><div>Column</div></Col> */}
        </Row>
      </Content>
    )
  }

}
