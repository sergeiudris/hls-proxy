import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'
import { AppContent, AppHeader, AppSidebar, AppFooter } from 'src/parts/layout'

import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'

interface IProps {
  className?: string
}

interface IState {


}


export class ViewHome extends React.Component<IProps, IState> {
  render() {
    return (
      <Box flexcol height={1}>
        <AppHeader />
        <AppContent ></AppContent>
        <AppSidebar />
        {/* <AppFooter /> */}
      </Box>
    );
  }


}

