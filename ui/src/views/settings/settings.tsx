import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'
import { AppContent, AppHeader, AppSidebar, AppFooter } from 'src/parts/layout'

import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles, Grid } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'

import { Cams } from '@streaming/types'
import { inject, observer } from 'mobx-react'
import { AppStore } from 'src/store'


interface IProps {
  className?: string
  store?: AppStore
}

interface IState {


}
const decorate = withStyles(({ palette, spacing }) => ({
  container: {
    padding: spacing.unit,
    // background: palette.background,
    color: palette.primary,
  },
}));

export const ViewSettings =
  decorate(
    inject(({ store }) => ({ store }))(
      observer(
        class extends React.Component<IProps & WithStyles<"container">, IState> {
          render() {
            const { classes } = this.props
            return (
              <Box flexcol height={1}>
                <AppHeader />
                <AppContent >
                  <Grid className={classes.container} container spacing={24} alignItems="center" >
                    <Grid item xs={12} >
                      <Typography>settings</Typography>
                    </Grid>
                  </Grid>
                </AppContent>
                <AppSidebar />
                {/* <AppFooter /> */}
              </Box>
            );
          }

        })
    )
  )

