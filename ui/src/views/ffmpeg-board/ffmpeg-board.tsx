import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'
import { AppContent, AppHeader, AppSidebar, AppFooter } from 'src/parts/layout'

import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles, Grid, Paper, BottomNavigation, BottomNavigationButton, RadioGroup, FormControlLabel, Radio } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'
import { Cams } from '@streaming/types'
import { inject, observer } from 'mobx-react'

import { AppStore } from 'src/store'
import { FFmpegStream } from 'src/parts/ffmpeg'

interface IProps {
  className?: string
  store?: AppStore
}

interface IState {


}

const decorate = withStyles(({ palette, spacing }) => ({
  streams: {
    padding: spacing.unit,
    // background: palette.background,
    color: palette.primary,
  },
}));

export const ViewFFmpegBoard =
  decorate(
    inject(({ store }) => ({ store }))(
      observer(
        class extends React.Component<IProps & WithStyles<"streams">, IState> {


          componentDidMount() {
            const { store } = this.props
            store.selectDataset(store.datasetSelectedFilename)
          }

          render() {
            const { classes, store } = this.props
            const { datasetSelectedFilename, ffmpeg } = store
            const dataset = store.datasets.get(datasetSelectedFilename) || []
            const streams = ffmpeg.streams || []

            return (
              <Box flexcol height={1}>
                <AppHeader />
                <AppContent >
                  <Grid className={classes.streams} container spacing={24} alignItems="center">
                    <Grid item xs={12} >
                      <RadioGroup
                        row
                        aria-label="dataset"
                        name="dataset"
                        value={datasetSelectedFilename}
                        onChange={(e, v) => store.selectDataset(v)}
                      >
                        {
                          store.datasetsInfo.map((dInfo) => {
                            return (
                              <FormControlLabel key={dInfo.fileName} value={dInfo.fileName} control={<Radio />} label={dInfo.title} />
                            )
                          })
                        }
                      </RadioGroup>
                    </Grid >
                    <Grid container direction={'row'} item xs={12} spacing={24} >
                      {
                        streams
                          .map((s,i) => {
                            // console.warn(s)
                            const info = dataset.find(x => x.version.object.cam_url == s.url_src)
                            return (
                              <FFmpegStream key={`${s.url_src}_${i}`} streamState={s}  streamInfo={info}/>
                            )
                          })
                      }
                    </Grid>
                  </Grid>
                </AppContent>
                <AppSidebar />
                {/* <AppFooter /> */}
              </Box>
            );
          }
        })))

