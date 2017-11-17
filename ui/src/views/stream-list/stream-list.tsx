import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'
import { AppContent, AppHeader, AppSidebar, AppFooter } from 'src/parts/layout'

import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles, Grid, Paper, BottomNavigation, BottomNavigationButton, RadioGroup, Checkbox, FormControlLabel, Radio } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'
import CheckCircle from 'material-ui-icons/CheckCircle'

import { Cams } from '@streaming/types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

import { AppStore } from 'src/store'
import { FFmpegStream } from 'src/parts/ffmpeg'

interface IProps {
  className?: string
  store?: AppStore
}

interface IState {

}

@inject(({ store }) => ({ store }))
@observer
export class ViewStreamList extends React.Component<IProps & WithStyles<"streams">, IState> {

  @observable.shallow checked = {
    [Cams.CamType.INTELELCT]: true,
    [Cams.CamType.httpcameras]: true
  }

  @observable rtspcamerasChecked: boolean = true
  @observable krechectChecked: boolean = true

  componentDidMount() {
    const { store } = this.props
    store.selectDataset(store.datasetSelectedFilename)
  }

  render() {
    const { store } = this.props
    const { datasetSelectedFilename, ffmpeg, cams } = store

    return (
      <Box flexcol height={1}>
        <AppHeader />
        <AppContent >
          <Box flexcol margin={'1em'} height={1}>
            <Grid item container direction={'row'} spacing={24} alignItems="center" >
              {
                store.datasetsInfo.map((dInfo) => {
                  return (
                    <Grid item spacing={8} >
                      <FormControlLabel
                        key={dInfo.fileName}
                        value={dInfo.fileName}
                        control={<Checkbox
                          value={dInfo.type.toString()}
                          checked={this.checked[dInfo.type]}
                          onChange={(evt) => { this.checked[dInfo.type] = !this.checked[dInfo.type] }} />}
                        label={dInfo.title} />
                    </Grid >
                  )
                })
              }
            </Grid>
            <Grid container direction={'row'} item xs={10} spacing={16} style={{ height: '100%', overflow: 'auto' }}>
              {
                cams
                  .filter(cam => this.checked[cam.version.object.type])
                  // .sort((a, b) => Number(a.version.object.cam_url < b.version.object.cam_url))
                  .map((cam) => {
                    return (
                      <Grid key={cam.id} container direction={'row'} item spacing={24} style={{ margin: '0' }}  >
                        <Typography key={cam.id} >{cam.version.object.title}</Typography>
                        <CheckCircle color={'red'} />
                      </Grid>
                    )
                  })
              }
            </Grid>
          </Box>
        </AppContent>
        <AppSidebar />
        {/* <AppFooter /> */}
      </Box>
    );
  }
}



